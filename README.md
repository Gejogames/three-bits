# three-bits

Small, complete, copyable three.js snippets — a gallery where every card is one self-contained file. Click a card, watch it run live, copy the code.

**No build step.** Three.js loads from a CDN importmap (`three@0.186.1` via jsdelivr), snippets are plain ES modules. Host the folder on any static host — including GitHub Pages — and it just works.

## Snippets

| File | What it shows |
|------|---------------|
| `cube.js` | the minimal scene — renderer, camera, light, one mesh |
| `terrain.js` | low-poly heightfield via vertex noise + flat shading |
| `orbit.js` | OrbitControls — drag to orbit, scroll to zoom |
| `instances.js` | InstancedMesh — 2,000 boxes, one draw call |
| `particles.js` | point cloud starfield with BufferGeometry |
| `pick.js` | raycaster click-picking — the base of 3D interaction |
| `ripple.js` | animated vertex displacement — fake water, no shaders |
| `toon.js` | MeshToonMaterial cel shading + back-face outline shell |
| `planets.js` | nested Object3D pivots = orbits for free |
| `fog.js` | scene.fog — depth-based atmosphere |

## Run it

```sh
npx serve .        # or any static server
```

Or just deploy the folder to GitHub Pages / Vercel / Netlify — nothing to build.

## Add a snippet

1. Create `snippets/my-thing.js` default-exporting `{ title, blurb, hint?, run }`
2. `run(canvas)` sets up renderer/scene/loop and **returns a cleanup function** (cancel rAF, dispose renderer, remove listeners)
3. Add the filename (without `.js`) to `FILES` in `app.js`

Each file is deliberately self-contained — a little setup duplication is the point: anyone copying one file gets a complete working demo, importmap included in `index.html`.

## License

MIT
