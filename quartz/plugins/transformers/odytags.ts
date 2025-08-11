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
      const content = src.toString()

      const tagsLineMatch = content.match(tagslineRegex)
      const tags: string[] = []

      if (tagsLineMatch) {
        const tagsLine = tagsLineMatch[0]

        let match
        while ((match = tagRegex.exec(tagsLine)) !== null) {
          const tag = String(match[1].split("/").pop())
          if (tag) tags.push(tag)
        }
      }

      // Build replacement line: tags prefixed with '#', joined by spaces
      const replacementLine = tags.map((t) => `#${t}`).join(" ")

      // Replace the whole Tags: line with replacement line
      const content_ = src.replace(tagslineRegex, replacementLine)

      return content_
    },
  }
}
