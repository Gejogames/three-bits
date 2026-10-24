// particles — a drifting point cloud: BufferGeometry positions + PointsMaterial.
import * as THREE from "three"

export default {
  title: "Particle Cloud",
  blurb: "A drifting starfield — BufferGeometry positions rendered as THREE.Points.",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0f16)
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.set(0, 0, 8)

    const COUNT = 2500
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      speeds[i] = 0.2 + Math.random() * 0.8
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x9ed4f0, size: 0.045, sizeAttenuation: true })
    )
    scene.add(points)

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
      for (let i = 0; i < COUNT; i++) {
        let y = pos.getY(i) + speeds[i] * 0.004
        if (y > 6) y = -6
        pos.setY(i, y)
      }
      pos.needsUpdate = true
      points.rotation.y = t / 24000
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
