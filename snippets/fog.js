// fog — scene.fog + depth-tested geometry = instant atmosphere and a
// free performance trick (you can cull what's fully fogged out).
import * as THREE from "three"

export default {
  title: "Depth Fog",
  blurb: "scene.fog turns distance into mood — and hides your polygon budget.",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x8ba7b8)
    scene.fog = new THREE.Fog(0x8ba7b8, 4, 26)
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.set(0, 1.6, 0)

    scene.add(new THREE.HemisphereLight(0xdfeef8, 0x3a4a3c, 1.4))
    const sun = new THREE.DirectionalLight(0xfff2d8, 1.5)
    sun.position.set(4, 8, 2)
    scene.add(sun)

    // pylons receding into the murk
    const coneGeo = new THREE.ConeGeometry(0.5, 2.4, 6)
    const mat = new THREE.MeshStandardMaterial({ color: 0x4a6b4f, flatShading: true })
    const pylons = []
    for (let i = 0; i < 60; i++) {
      const c = new THREE.Mesh(coneGeo, mat)
      c.position.set((Math.random() - 0.5) * 20, 1.2, -i * 0.7 - 2)
      c.rotation.y = Math.random() * Math.PI
      scene.add(c)
      pylons.push(c)
    }
    scene.add(new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x5d7a52 })
    ).rotateX(-Math.PI / 2))

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
      for (const c of pylons) {
        c.position.z += 0.03
        if (c.position.z > 4) c.position.z -= 42
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", fit)
      coneGeo.dispose()
      renderer.dispose()
    }
  },
}
