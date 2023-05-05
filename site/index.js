const MAX_POINTS = 2000;
const width = window.innerWidth;
const attractorElem = document.getElementById('attractor');
const height = attractorElem.offsetHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor('#00000a');

renderer.setSize(width, height);
attractorElem.appendChild(renderer.domElement);

let sigma = 10;
let rho = 28;
let beta = 8 / 3;
const dt = 0.01;
const scale = 1; // Scale factor to make the attractor smaller

const geometry = new THREE.BufferGeometry();
let x = 1, y = 1, z = 1;
const positions = [x, y, z];

const material = new THREE.LineBasicMaterial({
  color: 0xf5fff2,
  linewidth: 1.5,
});
const attractorLine = new THREE.Line(geometry, material);
scene.add(attractorLine);
camera.position.z = 75;
function getNextPoint(vector) {
  const dx = sigma * (vector.y - vector.x) * dt;
  const dy = (vector.x * (rho - vector.z) - vector.y) * dt;
  const dz = (vector.x * vector.y - beta * vector.z) * dt;
  vector.x += dx;
  vector.y += dy;
  vector.z += dz;
  return new THREE.Vector3(vector.x * scale, vector.y * scale, vector.z * scale);
}

function updateAttractor() {
  // Update the parameters over time
  sigma += 0.0001 * Math.sin(Date.now() * 0.0001);
  rho += 0.001 * Math.cos(Date.now() * 0.0002);
  beta += 0.0001 * Math.sin(Date.now() * 0.0003);

  const lastPointIndex = positions.length - 3; // get the index of the last 3D point
  x = positions[lastPointIndex] / scale;
  y = positions[lastPointIndex + 1] / scale;
  z = positions[lastPointIndex + 2] / scale;
  const drawVector = new THREE.Vector3(x, y, z);

  const nextPoint = getNextPoint(drawVector); // get the next point based on the updated drawVector
  positions.push(nextPoint.x, nextPoint.y, nextPoint.z); // add the new point to the positions array

  // Remove the oldest points if the maximum number of points is reached
  const maxPointsReached = positions.length / 3 > MAX_POINTS;
  if (maxPointsReached) {
    positions.splice(0, 3); // remove the oldest point (3 values for x, y, z)
  }
}

function animate() {
  requestAnimationFrame(animate);
  attractorLine.rotation.y += 0.00004 * Math.cos(Date.now() * 0.0008);
  attractorLine.rotation.x += 0.00008 * Math.sin(Date.now() * 0.0005);
  attractorLine.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  attractorLine.geometry.attributes.position.needsUpdate = true;
  for (let i = 0; i < 1; i++) {
    updateAttractor();
  }
  renderer.render(scene, camera);
}

for (let i = 1; i <= MAX_POINTS; i++) {
  updateAttractor();
}
attractorLine.rotation.z += 2.05

animate();

window.addEventListener('resize', function () {
  const attractorElem = document.getElementById('attractor');
  const height = attractorElem.offsetHeight;
  const width = window.innerWidth;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

