// planets — a hierarchy of Object3D pivots gives you orbits for free.
import * as THREE from "three"

export default {
  title: "Orbiting Bodies",
  blurb: "Sun, earth, moon — nested Object3D pivots make orbital motion trivial.",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0d14)
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.set(0, 4, 9)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.25))
    const sunLight = new THREE.PointLight(0xffe8b0, 60, 0, 2)
    scene.add(sunLight)

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0xffd166 })
    )
    scene.add(sun)

    // earth pivots around the sun
    const earthPivot = new THREE.Object3D()
    scene.add(earthPivot)
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 24, 12),
      new THREE.MeshStandardMaterial({ color: 0x4a90d9 })
    )
    earth.position.x = 3.2
    earthPivot.add(earth)

    // moon pivots around the earth
    const moonPivot = new THREE.Object3D()
    earth.add(moonPivot)
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 8),
      new THREE.MeshStandardMaterial({ color: 0xcccccc })
    )
    moon.position.x = 0.7
    moonPivot.add(moon)

    // orbit path rings
    for (const [r, parent] of [[3.2, scene], [0.7, earth]]) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.008, r + 0.008, 64),
        new THREE.MeshBasicMaterial({ color: 0x3a4a5c, side: THREE.DoubleSide })
      )
      ring.rotation.x = -Math.PI / 2
      parent.add(ring)
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
      earthPivot.rotation.y = t / 3000
      moonPivot.rotation.y = t / 600
      earth.rotation.y = t / 900
      sun.rotation.y = t / 12000
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
