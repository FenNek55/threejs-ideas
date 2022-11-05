import '../../style.css'
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerWidth, 0.1, 1000)
const bgElement = document.querySelector('#bg') as HTMLElement

console.log(bgElement)

const renderer = new THREE.WebGLRenderer({
  canvas: bgElement,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerHeight, window.innerWidth)
camera.position.setZ(30);

renderer.render(scene, camera)

const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({color: 0xeb6734})
const torus = new THREE.Mesh(torusGeometry, material)
scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(25,25,25)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const gridHelper = new THREE.GridHelper(100)

scene.add(gridHelper)

const animate = () => {
  requestAnimationFrame(animate);
  torus.rotateX(0.01)
  torus.rotateY(0.01)

  renderer.render(scene, camera);
}

animate();