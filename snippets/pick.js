// pick — raycasting: click a sphere to light it up.
import * as THREE from "three"

export default {
  title: "Click Picking",
  blurb: "Raycast from the camera through the pointer — the foundation of 3D interaction.",
  hint: "click a sphere",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x101418)
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.set(0, 2.5, 6)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const sun = new THREE.DirectionalLight(0xffffff, 1.8)
    sun.position.set(4, 6, 5)
    scene.add(sun)

    const spheres = []
    for (let i = 0; i < 9; i++) {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 32, 16),
        new THREE.MeshStandardMaterial({ color: 0x5a7a9a, roughness: 0.4 })
      )
      s.position.set((i % 3 - 1) * 1.4, (Math.floor(i / 3) - 1) * 1.4, 0)
      scene.add(s)
      spheres.push(s)
    }

    const ray = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      ray.setFromCamera(pointer, camera)
      const hit = ray.intersectObjects(spheres)[0]
      if (hit) {
        const s = hit.object
        const on = s.material.color.getHex() === 0x5ab0e0
        s.material.color.setHex(on ? 0x5a7a9a : 0x5ab0e0)
        s.material.emissive?.setHex(on ? 0x000000 : 0x0a2838)
      }
    }
    canvas.addEventListener("pointerdown", onClick)

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
      spheres.forEach((s, i) => (s.position.y += Math.sin(t / 600 + i) * 0.001))
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", fit)
      canvas.removeEventListener("pointerdown", onClick)
      renderer.dispose()
    }
  },
}
