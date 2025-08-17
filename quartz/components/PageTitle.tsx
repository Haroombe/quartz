import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>{title}</a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.85rem;
  margin: 0;
  font-family: var(--titleFont);
  

  

  
  /* Small Mobile (up to 480px) */
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
  @media (max-width: 480px) {
    font-size: 1.0rem;
  }
}`

export default (() => PageTitle) satisfies QuartzComponentConstructor
