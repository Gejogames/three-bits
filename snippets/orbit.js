// orbit-controls — drag to rotate, scroll to zoom, via three/addons.
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export default {
  title: "Orbit Controls",
  blurb: "Drag to orbit, scroll to zoom — the control scheme almost every 3D demo needs.",
  hint: "drag to orbit · scroll to zoom",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x101418)
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.set(0, 1.5, 4)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.08

    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const sun = new THREE.DirectionalLight(0xffffff, 2)
    sun.position.set(4, 6, 3)
    scene.add(sun)

    scene.add(
      new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.8, 0.28, 120, 16),
        new THREE.MeshStandardMaterial({ color: 0xe0a35a, roughness: 0.3, metalness: 0.4 })
      )
    )
    scene.add(new THREE.GridHelper(8, 16, 0x3a4a5c, 0x22303c))

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
    const loop = () => {
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", fit)
      controls.dispose()
      renderer.dispose()
    }
  },
}
