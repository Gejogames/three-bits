// hello-cube — the "hello world" of three.js: scene, camera, light, one mesh.
import * as THREE from "three"

export default {
  title: "Hello Cube",
  blurb: "The minimal three.js scene — renderer, camera, one light, one spinning cube.",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x101418)
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.set(0, 0.5, 3)

    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const sun = new THREE.DirectionalLight(0xffffff, 2)
    sun.position.set(3, 4, 5)
    scene.add(sun)

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x5ab0e0, roughness: 0.35 })
    )
    scene.add(cube)

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
      cube.rotation.y = t / 900
      cube.rotation.x = t / 2200
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", fit)
      renderer.dispose()
    }
  },
}
