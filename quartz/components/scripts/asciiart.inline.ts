// ASCII Art responsive display script
function updateAsciiDisplay() {
  const containers = document.querySelectorAll(".ascii-art-container")

  containers.forEach((container) => {
    const breakpoint = parseInt((container as HTMLElement).dataset.breakpoint || "768")
    const mobileArt = container.querySelector(".mobile-ascii") as HTMLElement
    const desktopArt = container.querySelector(".desktop-ascii") as HTMLElement
    const isMobile = window.innerWidth <= breakpoint

    if (mobileArt && desktopArt) {
      if (isMobile) {
        mobileArt.style.display = "block"
        desktopArt.style.display = "none"
      } else {
        mobileArt.style.display = "none"
        desktopArt.style.display = "block"
      }
    }
  })
}

function initAsciiArt() {
  // Initial display
  updateAsciiDisplay()

  // Update on window resize
  let resizeTimeout: ReturnType<typeof setTimeout>
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(updateAsciiDisplay, 100)
  })
}

// Run on initial load
document.addEventListener("DOMContentLoaded", initAsciiArt)

// Re-run on Quartz navigation (client-side routing)
document.addEventListener("nav", initAsciiArt)

// Also listen for any content changes (fallback)
if (typeof window !== "undefined") {
  // Run immediately if DOM is already loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAsciiArt)
  } else {
    initAsciiArt()
  }
}
