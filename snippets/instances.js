// instances — one InstancedMesh draws 2000 boxes in a single draw call,
// animated by writing matrices per instance per frame.
import * as THREE from "three"

export default {
  title: "Instanced Mesh",
  blurb: "2,000 boxes, one draw call — InstancedMesh is how you scale geometry.",
  run(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x101418)
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)
    camera.position.set(0, 10, 16)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const sun = new THREE.DirectionalLight(0xffffff, 1.8)
    sun.position.set(5, 10, 6)
    scene.add(sun)

    const N = 45
    const mesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.28, 1, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x5ab0e0 }),
      N * N
    )
    scene.add(mesh)

    const m = new THREE.Matrix4()
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
      let i = 0
      for (let x = 0; x < N; x++) {
        for (let z = 0; z < N; z++) {
          const dx = x - N / 2, dz = z - N / 2
          const h = Math.sin(t / 500 + Math.hypot(dx, dz) * 0.55) * 1.6 + 2.2
          m.makeScale(1, h, 1).setPosition(dx * 0.42, h / 2, dz * 0.42)
          mesh.setMatrixAt(i++, m)
        }
      }
      mesh.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", fit)
      mesh.dispose()
      renderer.dispose()
    }
  },
}
