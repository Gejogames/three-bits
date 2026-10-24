// toon — MeshToonMaterial for cel shading plus a flipped-back-face outline shell.
import * as THREE from "three"

export default {
  title: "Toon Shading",
  blurb: "Cel-shaded look: MeshToonMaterial + a scaled back-face shell for outlines.",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0ead8)
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.set(0, 1, 5)
    camera.lookAt(0, 0.4, 0)

    const sun = new THREE.DirectionalLight(0xffffff, 2.4)
    sun.position.set(4, 6, 5)
    scene.add(sun)

    // 3-step gradient map: dark, mid, lit
    const gradient = new THREE.DataTexture(new Uint8Array([60, 150, 255]), 3, 1, THREE.RedFormat)
    gradient.minFilter = THREE.NearestFilter
    gradient.magFilter = THREE.NearestFilter
    gradient.needsUpdate = true

    const shapes = [
      new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 0.7, 6, 16), new THREE.MeshToonMaterial({ color: 0x5ab0e0, gradientMap: gradient })),
      new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), new THREE.MeshToonMaterial({ color: 0xe0a35a, gradientMap: gradient })),
      new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.2, 12, 24), new THREE.MeshToonMaterial({ color: 0x7fbf5a, gradientMap: gradient })),
    ]
    shapes[0].position.x = -2
    shapes[2].position.x = 2

    // outline shell: same geometry, scaled, back-faces only
    for (const s of shapes) {
      const shell = new THREE.Mesh(
        s.geometry,
        new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.BackSide })
      )
      shell.scale.setScalar(1.06)
      s.add(shell)
      scene.add(s)
    }

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
      shapes.forEach((s, i) => {
        s.rotation.y = t / 1200 + i
        s.position.y = Math.sin(t / 800 + i * 2) * 0.15 + 0.2
      })
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
