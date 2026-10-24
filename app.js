// three-bits gallery driver. Snippets are self-contained ES modules in
// snippets/ — each default-exports { title, blurb, hint, run(canvas) }.
// run() returns a cleanup function.

const FILES = [
  "cube", "terrain", "orbit", "instances", "particles",
  "pick", "ripple", "toon", "planets", "fog",
]

const grid = document.getElementById("grid")
const viewer = document.getElementById("viewer")
const canvas = document.getElementById("v-canvas")
const codeEl = document.getElementById("v-code")
const titleEl = document.getElementById("v-title")
const hintEl = document.getElementById("v-hint")

const mods = new Map() // filename -> loaded module
let cleanup = null
let currentFile = null

async function load(file) {
  if (!mods.has(file)) mods.set(file, import(`./snippets/${file}.js`))
  return (await mods.get(file)).default
}

// ---- gallery ----
async function build() {
  for (const file of FILES) {
    const mod = await load(file)
    const card = document.createElement("button")
    card.className = "card"
    card.innerHTML = `<h2>${mod.title}</h2><p>${mod.blurb}</p><span class="tag">${file}.js</span>`
    card.onclick = () => open(file)
    grid.appendChild(card)
  }
  // deep link: #terrain opens that snippet
  const hash = location.hash.slice(1)
  if (hash && FILES.includes(hash)) open(hash)
}

// ---- viewer ----
async function open(file) {
  closeViewer(false)
  currentFile = file
  const mod = await load(file)
  titleEl.textContent = mod.title
  hintEl.textContent = mod.hint || ""
  codeEl.textContent = await (await fetch(`./snippets/${file}.js`)).text()
  viewer.classList.add("open")
  history.replaceState(null, "", `#${file}`)
  // let the canvas size before mounting
  requestAnimationFrame(() => {
    cleanup = mod.run(canvas)
  })
}

function closeViewer(push = true) {
  if (cleanup) {
    cleanup()
    cleanup = null
  }
  const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl")
  ctx?.clearColor(0, 0, 0, 1)
  viewer.classList.remove("open")
  if (push) history.replaceState(null, "", location.pathname)
}

document.getElementById("close").onclick = () => closeViewer()
viewer.onclick = (e) => { if (e.target === viewer) closeViewer() }
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeViewer() })
window.addEventListener("hashchange", () => {
  const hash = location.hash.slice(1)
  if (hash && FILES.includes(hash) && hash !== currentFile) open(hash)
  if (!hash) closeViewer(false)
})

document.getElementById("copy").onclick = async (e) => {
  await navigator.clipboard.writeText(codeEl.textContent)
  e.target.textContent = "Copied!"
  setTimeout(() => (e.target.textContent = "Copy code"), 1200)
}

document.getElementById("raw").onclick = () => {
  window.open(
    `https://raw.githubusercontent.com/Gejogames/three-bits/main/snippets/${currentFile}.js`,
    "_blank"
  )
}

build()
