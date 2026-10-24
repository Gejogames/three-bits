// terrain — low-poly heightfield made by displacing plane vertices with
// value noise, shaded flat for the faceted look.
import * as THREE from "three"

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi), b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

export default {
  title: "Low-Poly Terrain",
  blurb: "Displace plane vertices with value noise, shade flat — instant hills and valleys.",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a2530)
    scene.fog = new THREE.Fog(0x1a2530, 18, 42)
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.set(0, 6, 12)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x243018, 1.2))
    const sun = new THREE.DirectionalLight(0xfff2d8, 2)
    sun.position.set(6, 10, 4)
    scene.add(sun)

    const geo = new THREE.PlaneGeometry(40, 40, 60, 60)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i)
      pos.setY(i, noise(x * 0.18, z * 0.18) * 3.2 + noise(x * 0.55, z * 0.55) * 0.9)
    }
    geo.computeVertexNormals()
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: 0x5d8f4a, flatShading: true })
    )
    scene.add(mesh)

    const fit = () => {
      const { clientWidth: w, clientHeight: h } = canvas.parentElement
      renderer.setSize(w, h, false)
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    fit()
    window.addEventListener("resize", fit)

    let raf = 0
    const loop = (t) => {
      mesh.rotation.y = t / 9000
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", fit)
      geo.dispose()
      renderer.dispose()
    }
  },
}
