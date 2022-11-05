import '../../style.css'
import * as THREE from 'three'
import {scene, renderer, camera, bgElement} from './sceneSetup'

const setUpGeometry = (arraySize: number, geometrySize: number, spacing: number) => {
  const meshArray = []
  const totalSideLength = arraySize * geometrySize + (arraySize - 1) * spacing
  const boxGeometry = new THREE.BoxGeometry(geometrySize,100,geometrySize)

  for (let j = 0; j <= arraySize; j++) {
    meshArray.push([])

    for (let i = 0; i <= arraySize; i++) {
      const material = new THREE.MeshStandardMaterial({color: 0x06b800, metalness: 0.2})
      const newMesh = new THREE.Mesh(boxGeometry, material)
      newMesh.position.x = (j * geometrySize + j * spacing) - totalSideLength / 2
      newMesh.position.z = (i * geometrySize + i * spacing) - totalSideLength / 2
      newMesh.position.y = -50
      newMesh.distanceFromCenter = Math.sqrt(Math.pow(newMesh.position.x,2) + Math.pow(newMesh.position.z,2))
      newMesh.vectorY = 0
      
      if(newMesh.distanceFromCenter < geometrySize * arraySize / 2) {
          meshArray[j].unshift(newMesh)
      }
    }
  }

  return meshArray.flat()
}

const plainGeometry = new THREE.PlaneGeometry(100,100 ).rotateX(-Math.PI * 0.5);
const plainMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( plainGeometry, plainMaterial );
// scene.add(plane)

const geometry = setUpGeometry(60, 2, 0.3);

scene.add(...geometry)

let x = 0

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

interface RaycasterCurrent2dOrigin {
  x: null | number,
  z: null | number
}

let raycasterCurrent2dOrigin: RaycasterCurrent2dOrigin = {
  x: null,
  z: null
}

const onPointerMove = ( e: MouseEvent ) => {
	pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / (window.innerWidth / 2)) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    raycasterCurrent2dOrigin.x = intersects[0].object.position.x
    raycasterCurrent2dOrigin.z = intersects[0].object.position.z
  } else {
    raycasterCurrent2dOrigin.x = null;
    raycasterCurrent2dOrigin.z = null;
  }

  console.log(raycasterCurrent2dOrigin)
}

window.setTimeout(() => {
  bgElement.addEventListener('pointermove', onPointerMove)
}, 500)

const yOrigin = -50

const animate = () => {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(pointer,camera)

  geometry.forEach((mesh) => {
    const cursorSize = 30

    if (raycasterCurrent2dOrigin.x && raycasterCurrent2dOrigin.z) {
        const distanceFromCurrentOrigin = Math.sqrt( Math.pow((mesh.position.x-raycasterCurrent2dOrigin.x), 2) + Math.pow((mesh.position.z-raycasterCurrent2dOrigin.z), 2) );

        if (distanceFromCurrentOrigin < cursorSize) {
          mesh.vectorY += 0.05 * (1 - distanceFromCurrentOrigin / cursorSize)
        }
    }

    const distanceFromOriginY =  Math.abs(yOrigin - mesh.position.y)

    if(mesh.position.y < yOrigin) {
      mesh.vectorY += 0.02 * (distanceFromOriginY / 5)
    }
    if(mesh.position.y > yOrigin) {
      mesh.vectorY -= 0.02 * (distanceFromOriginY / 5)
    }

    mesh.position.y += mesh.vectorY

    const damp = 0.002
    if (mesh.vectorY > 0) {
      mesh.vectorY -= damp
    }
    if (mesh.vectorY < 0) {
      mesh.vectorY += damp
    }
  })

  x -= 0.01

  renderer.render(scene, camera);
}

animate();