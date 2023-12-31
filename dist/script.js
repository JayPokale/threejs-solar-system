import * as THREE from "https://unpkg.com/three@0.112/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";

const sunImg = "./textures/sun.jpg";
const mercuryImg = "./textures/mercury.jpg";
const venusImg = "./textures/venus.jpg";
const earthImg = "./textures/earth.jpg";
const marsImg = "./textures/mars.jpg";
const jupiterImg = "./textures/jupiter.jpg";
const saturnImg = "./textures/saturn.jpg";
const saturnRing = "./textures/saturn_ring.png";
const uranusImg = "./textures/uranus.jpg";
const neptuneImg = "./textures/neptune.jpg";
const starsImg = "./textures/stars.jpg";

let sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
let renderer, scene, camera;

init();
animate();

function init() {
  const [w, h] = [window.innerWidth, window.innerHeight];
  const PI = Math.PI;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
  camera.position.set(0, 50, 100);

  const cubeTextureLoader = new THREE.CubeTextureLoader();
  scene.background = cubeTextureLoader.load([
    starsImg,
    starsImg,
    starsImg,
    starsImg,
    starsImg,
    starsImg,
  ]);

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.update();

  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = "Anonymous";

  // Sun
  const sunGeo = new THREE.SphereGeometry(4, 30, 30);
  const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunImg),
    shininess: 100,
    side: THREE.DoubleSide,
    needsUpdate: true,
  });
  sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  // Planet Function
  const createPlanet = (size, texture, position, ring = false) => {
    const obj = new THREE.Object3D();
    scene.add(obj);

    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshPhongMaterial({
      map: textureLoader.load(texture),
      shininess: 100,
      needsUpdate: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = position;
    obj.add(mesh);

    const mat2 = new THREE.MeshBasicMaterial({
      map: textureLoader.load(texture),
      transparent: true,
      opacity: 0.25,
    });
    const meshDark = new THREE.Mesh(geo, mat2);
    mesh.add(meshDark);

    if (ring) {
      const ringGeo = new THREE.RingGeometry(ring.inner, ring.outer, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(ring.texture),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.x = position;
      ringMesh.rotation.x = 0.5 * PI;
      obj.add(ringMesh);
    }

    const curve = new THREE.EllipseCurve(
      0.0,
      0.0,
      position,
      position,
      0.0,
      2.0 * PI
    );
    const curvePts = curve.getSpacedPoints(256);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
    const curveMat = new THREE.LineBasicMaterial({ color: 0xbbbbbb });
    const circle = new THREE.LineLoop(curveGeo, curveMat);
    circle.rotateX(0.5 * PI);
    scene.add(circle);

    return { obj, mesh };
  };

  // Planets
  mercury = createPlanet(0.8, mercuryImg, 28);
  venus = createPlanet(1.4, venusImg, 44);
  earth = createPlanet(1.5, earthImg, 62, null);
  mars = createPlanet(1, marsImg, 78);
  jupiter = createPlanet(3, jupiterImg, 100);
  saturn = createPlanet(2.5, saturnImg, 138, {
    inner: 2.5,
    outer: 5,
    texture: saturnRing,
  });
  uranus = createPlanet(1.7, uranusImg, 176);
  neptune = createPlanet(1.7, neptuneImg, 200);

  const pointLight = new THREE.PointLight(0xfdfdd3, 2, 300);
  scene.add(pointLight);

  mercury.obj.rotateY(2 * Math.random() * PI);
  venus.obj.rotateY(2 * Math.random() * PI);
  earth.obj.rotateY(2 * Math.random() * PI);
  mars.obj.rotateY(2 * Math.random() * PI);
  jupiter.obj.rotateY(2 * Math.random() * PI);
  saturn.obj.rotateY(2 * Math.random() * PI);
  uranus.obj.rotateY(2 * Math.random() * PI);
  neptune.obj.rotateY(2 * Math.random() * PI);
}

function animate() {
  requestAnimationFrame(animate);

  // camera.rotateY(0.01)

  // Sun Rotation
  sun.rotateY(0.001);

  // Self-rotation
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);

  // Around-sun-rotation
  mercury.obj.rotateY(0.004);
  venus.obj.rotateY(0.0015);
  earth.obj.rotateY(0.001);
  mars.obj.rotateY(0.0008);
  jupiter.obj.rotateY(0.0002);
  saturn.obj.rotateY(0.00009);
  uranus.obj.rotateY(0.00004);
  neptune.obj.rotateY(0.00001);

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  const [w, h] = [window.innerWidth, window.innerHeight];
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});