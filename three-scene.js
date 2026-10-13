import * as THREE from "three";

const canvas = document.getElementById("threeDScene");
let renderer;

try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power"
  });
} catch (error) {
  console.warn("3D graphics are not available in this browser.", error);
}

if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xc9bfff, 0.018);

  const camera = new THREE.PerspectiveCamera(
    48,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 19);

  scene.add(new THREE.AmbientLight(0xffffff, 2.0));

  const pearlLight = new THREE.PointLight(0xffd7f1, 45, 45);
  pearlLight.position.set(-6, 7, 9);
  scene.add(pearlLight);

  const blueLight = new THREE.PointLight(0xbccaff, 35, 40);
  blueLight.position.set(7, -4, 7);
  scene.add(blueLight);

  const objects = [];
  const pastelMaterials = [
    new THREE.MeshPhysicalMaterial({
      color: 0xffc5e8, roughness: 0.24, metalness: 0.05,
      clearcoat: 1, clearcoatRoughness: 0.15
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xd9ceff, roughness: 0.2, metalness: 0.12,
      clearcoat: 1, clearcoatRoughness: 0.12
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xc6e4ff, roughness: 0.22, metalness: 0.08,
      clearcoat: 1, clearcoatRoughness: 0.15
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xfff2fc, roughness: 0.16, metalness: 0.08,
      clearcoat: 1, clearcoatRoughness: 0.1
    })
  ];

  function heartGeometry() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.18);
    shape.bezierCurveTo(-0.05, 0.55, -0.62, 0.55, -0.62, 0.12);
    shape.bezierCurveTo(-0.62, -0.16, -0.28, -0.42, 0, -0.67);
    shape.bezierCurveTo(0.28, -0.42, 0.62, -0.16, 0.62, 0.12);
    shape.bezierCurveTo(0.62, 0.55, 0.05, 0.55, 0, 0.18);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.18, bevelEnabled: true, bevelSegments: 3,
      steps: 1, bevelSize: 0.06, bevelThickness: 0.05, curveSegments: 12
    });
    geometry.center();
    return geometry;
  }

  const heartGeo = heartGeometry();

  function addFloating(mesh, index, speed = 1) {
    mesh.userData.baseY = mesh.position.y;
    mesh.userData.phase = Math.random() * Math.PI * 2;
    mesh.userData.spin = (Math.random() - 0.5) * 0.006 * speed;
    mesh.userData.floatSpeed = 0.5 + Math.random() * 0.8;
    mesh.userData.floatAmount = 0.18 + Math.random() * 0.42;
    mesh.userData.baseX = mesh.position.x;
    mesh.userData.index = index;
    objects.push(mesh);
    scene.add(mesh);
  }

  // Floating glossy 3D hearts.
  for (let i = 0; i < 15; i++) {
    const mesh = new THREE.Mesh(heartGeo, pastelMaterials[i % pastelMaterials.length]);
    const scale = 0.28 + Math.random() * 0.52;
    mesh.scale.setScalar(scale);
    mesh.position.set(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12,
      -2 + Math.random() * 7
    );
    mesh.rotation.z = (Math.random() - 0.5) * 0.55;
    addFloating(mesh, i, 1);
  }

  // Small dimensional stars made from extruded star shapes.
  function starShape(points = 5, outer = 0.55, inner = 0.23) {
    const shape = new THREE.Shape();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.12, bevelEnabled: true, bevelSegments: 2,
      bevelSize: 0.035, bevelThickness: 0.03, curveSegments: 3
    });
  }

  const starGeo = starShape();
  for (let i = 0; i < 32; i++) {
    const star = new THREE.Mesh(starGeo, pastelMaterials[(i + 1) % pastelMaterials.length]);
    const scale = 0.2 + Math.random() * 0.48;
    star.scale.setScalar(scale);
    star.position.set(
      (Math.random() - 0.5) * 21,
      (Math.random() - 0.5) * 13,
      -3 + Math.random() * 8
    );
    addFloating(star, i + 20, 0.7);
  }

  // A little 3D birthday cake, visible as a floating decorative object.
  const cakeGroup = new THREE.Group();
  const cakeBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.12, 0.55, 48),
    new THREE.MeshPhysicalMaterial({ color: 0xffc9e8, roughness: 0.3, clearcoat: 0.8 })
  );
  cakeBase.position.y = -0.35;
  cakeGroup.add(cakeBase);

  const icing = new THREE.Mesh(
    new THREE.CylinderGeometry(1.08, 1.08, 0.16, 48),
    new THREE.MeshPhysicalMaterial({ color: 0xfff5fc, roughness: 0.18, clearcoat: 1 })
  );
  icing.position.y = -0.04;
  cakeGroup.add(icing);

  const topLayer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.78, 0.42, 48),
    new THREE.MeshPhysicalMaterial({ color: 0xd8c8ff, roughness: 0.26, clearcoat: 0.9 })
  );
  topLayer.position.y = 0.23;
  cakeGroup.add(topLayer);

  const candle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.09, 0.55, 16),
    new THREE.MeshStandardMaterial({ color: 0xfff6ba, roughness: 0.25 })
  );
  candle.position.y = 0.7;
  cakeGroup.add(candle);

  const flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 18, 14),
    new THREE.MeshBasicMaterial({ color: 0xffb9df })
  );
  flame.scale.set(0.7, 1.45, 0.7);
  flame.position.y = 1.05;
  cakeGroup.add(flame);

  cakeGroup.position.set(5.2, -2.9, 1.4);
  cakeGroup.scale.setScalar(0.9);
  scene.add(cakeGroup);

  const cakeLight = new THREE.PointLight(0xffc5e8, 7, 5);
  cakeLight.position.set(5.2, -1.6, 2.3);
  scene.add(cakeLight);

  // A glassy pearl orbit for extra fantasy atmosphere.
  const orbGroup = new THREE.Group();
  const orbMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xfff2fc, roughness: 0.08, metalness: 0.05,
    transmission: 0.15, transparent: true, opacity: 0.78, clearcoat: 1
  });
  for (let i = 0; i < 7; i++) {
    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.12 + (i % 3) * 0.035, 20, 16), orbMaterial);
    const angle = (i / 7) * Math.PI * 2;
    pearl.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 0.5, Math.sin(angle) * 0.8);
    orbGroup.add(pearl);
  }
  orbGroup.position.set(-5.2, -2.6, 0.5);
  scene.add(orbGroup);

  let pointerX = 0;
  let pointerY = 0;
  window.addEventListener("pointermove", event => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 1.1;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.7;
  }, { passive: true });

  let lastTime = 0;
  function animate(time) {
    const seconds = time * 0.001;
    const delta = Math.min((time - lastTime) / 16.67 || 1, 2);
    lastTime = time;

    objects.forEach((obj, i) => {
      obj.position.y = obj.userData.baseY +
        Math.sin(seconds * obj.userData.floatSpeed + obj.userData.phase) * obj.userData.floatAmount;
      obj.position.x = obj.userData.baseX +
        Math.sin(seconds * 0.24 + obj.userData.phase) * 0.18;
      obj.rotation.y += obj.userData.spin * delta;
      obj.rotation.x = Math.sin(seconds * 0.35 + obj.userData.phase) * 0.14;
      obj.rotation.z += 0.0008 * delta;
    });

    cakeGroup.rotation.y = Math.sin(seconds * 0.45) * 0.18;
    cakeGroup.position.y = -2.9 + Math.sin(seconds * 1.1) * 0.15;
    flame.scale.y = 1.25 + Math.sin(seconds * 9) * 0.22;
    orbGroup.rotation.y = seconds * 0.22;
    orbGroup.rotation.z = Math.sin(seconds * 0.45) * 0.12;

    camera.position.x += (pointerX - camera.position.x * 0.035 - camera.position.x * 0.0) * 0.015;
    camera.position.y += (-pointerY - camera.position.y * 0.035) * 0.015;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);
  }

  renderer.setAnimationLoop(animate);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  });

  // Respect battery and motion preferences.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) renderer.setAnimationLoop(null);
    else renderer.setAnimationLoop(animate);
  });
}
