// ripple — displace a plane's vertices with a sine wave each frame:
// cheap animated water with no shaders.
import * as THREE from "three"

export default {
  title: "Water Ripple",
  blurb: "Animated vertex displacement — fake water with no shaders, just sine.",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0e1a26)
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.set(0, 4.5, 8)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x0e2030, 1.4))
    const sun = new THREE.DirectionalLight(0xfff2d8, 1.6)
    sun.position.set(5, 8, 4)
    scene.add(sun)

    const geo = new THREE.PlaneGeometry(16, 16, 64, 64)
    geo.rotateX(-Math.PI / 2)
    const water = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: 0x2b6d8f,
        roughness: 0.25,
        metalness: 0.4,
        flatShading: true,
      })
    )
    scene.add(water)
    const base = geo.attributes.position.array.slice()

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
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3], z = base[i * 3 + 2]
        pos.setY(
          i,
          Math.sin(x * 1.1 + t / 700) * 0.18 +
            Math.sin(z * 1.4 + t / 900) * 0.14 +
            Math.sin((x + z) * 0.7 + t / 500) * 0.1
        )
      }
      pos.needsUpdate = true
      geo.computeVertexNormals()
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
