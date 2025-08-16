// @ts-ignore
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/mainsitelink.scss"

import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"

interface MainSiteLinkOptions {
  url: string
  title?: string
  openInNewTab?: boolean
}

const MainSiteLink: QuartzComponent = ({ displayClass, cfg, fileData }: QuartzComponentProps) => {
  // You can configure these options
  const options: MainSiteLinkOptions = {
    url: "https://example.com", // Replace with your main site URL
    title: "Go to Main Site",
    openInNewTab: true
  }

  // Create path to your SVG icon
  const baseDir = fileData.slug === "404" ? "/" : pathToRoot(fileData.slug!)
  const iconPath = joinSegments(baseDir, "static/haroombe.svg") // Put your SVG in static/ folder

  return (
    <a
      href={options.url}
      class={classNames(displayClass, "mainsitelink")}
      target={options.openInNewTab ? "_blank" : "_self"}
      rel={options.openInNewTab ? "noopener noreferrer" : undefined}
      aria-label="Main Site Link"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="mainSiteLinkIcon"
        aria-label={options.title}
      >
        <title>{options.title}</title>
        <image href={iconPath} width="40" height="40" />
      </svg>
    </a>
  )
}
MainSiteLink.css = style


export default (() => MainSiteLink) satisfies QuartzComponentConstructor