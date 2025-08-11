import { QuartzTransformerPlugin } from "../types"

export interface Options {
  allowedFolders?: string[]
}

const defaultOptions: Options = {
  allowedFolders: ["Tags"],
}

/**
 * quartz-ody-tags is a quartz transformer plugin that converts custom pseudo-tags in your notes
 * (e.g., [[TagName]] links) into real Quartz frontmatter tags during build time.
 *
 * This plugin is opinionated: it assumes your tag notes live in a top-level `/Tags` folder.
 * It injects tags by scanning
 * for links to `/Tags` notes and adding them to frontmatter.tags.
 *
 *  */

const tagslineRegex = /^Tags:.*$/m
const tagRegex = new RegExp("\\[\\[([^\\]|]+)(?:\\|[^\\]]+)?\\]\\]", "g")

export const OdyTagsTransformer: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "OdyTagsTransformer",
    textTransform(_ctx, src) {
      let content = src.toString()

      const tagsLineMatch = content.match(tagslineRegex)
      const tags: string[] = []

      // Build replacement line: tags prefixed with '#', joined by spaces

      // Replace the whole Tags: line with replacement line
      content = src.replace(tagslineRegex, "")
      if (tagsLineMatch) {
        const tagsLine = tagsLineMatch[0]
        let match
        while ((match = tagRegex.exec(tagsLine)) !== null) {
          const pathPart = match[1] // before alias
          const tag = pathPart.split("/").pop()
          if (tag) tags.push(tag)
        }
      }

      if (tags.length > 0) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
        if (frontmatterMatch) {
          let frontmatter = frontmatterMatch[1]

          const tagsKeyMatch = frontmatter.match(/^tags:\s*\n([\s\S]*)/m)
          if (tagsKeyMatch) {
            // Merge tags if `tags:` key exists
            const existingTags = [...frontmatter.matchAll(/^\s*-\s*(.+)$/gm)].map(m => m[1])
            const mergedTags = Array.from(new Set([...existingTags, ...tags]))
            frontmatter = frontmatter.replace(
              /^tags:\s*\n([\s\S]*?)(?=\n\S|$)/m,
              `tags:\n${mergedTags.map(t => `  - ${t}`).join("\n")}`
            )
          } else {
            // Add new tags key
            frontmatter += `\ntags:\n${tags.map(t => `  - ${t}`).join("\n")}`
          }

          // Replace the old frontmatter in content
          content = content.replace(
            /^---\n([\s\S]*?)\n---/,
            `---\n${frontmatter}\n---`
          )
        } else {
          // No frontmatter → add fresh one
          const tagsYaml = `---\ntags:\n${tags.map(t => `  - ${t}`).join("\n")}\n---\n`
          content = tagsYaml + content
        }
      }
      return content
    },
  }
}
