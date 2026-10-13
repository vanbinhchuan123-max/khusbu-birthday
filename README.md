# Khusbu — Pastel Fantasy 3D Birthday Card

A six-stage mobile-friendly birthday website with a real-time 3D pastel scene powered by Three.js.

## Files
- `index.html` — six stages and birthday message
- `style.css` — pastel fantasy visuals and responsive layout
- `script.js` — navigation, envelope, floating hearts and interactions
- `three-scene.js` — animated 3D hearts, stars, pearls and birthday cake
- `assets/khusbu-birthday-art.png` — birthday illustration (if included)

## Publish with GitHub Pages
1. Create a public repository named `khusbu-birthday`.
2. Upload the files to the repository root and keep the `assets` folder.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose branch `main` and folder `/(root)`, then save.
6. Open the published URL shown in the Pages settings.

## Notes
- Three.js is loaded from a CDN, so visitors need an internet connection.
- The 3D hearts, stars and cake are generated in code and animate in real time.
- The featured character artwork remains a 2D image; animating a character as a true 3D model requires a rigged GLB/GLTF model.
- Anyone with the public website link can view the card.
