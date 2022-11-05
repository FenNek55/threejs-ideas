import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerWidth / 2), 0.1, 1000)
const bgElement = document.querySelector('#bg') as HTMLElement

const renderer = new THREE.WebGLRenderer({
  canvas: bgElement,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerWidth / 2)
camera.position.setZ(48);
camera.position.setY(25);
camera.position.setX(45);
camera.rotateX(-0.5)
camera.rotateY(0.5)
camera.rotateZ(0.3)

renderer.render(scene, camera)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(25,55,25)
const pointLight2 = new THREE.PointLight(0xffffff, 1)
pointLight2.position.set(-25,55,-25)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

export {
    scene,
    camera,
    bgElement,
    renderer
}