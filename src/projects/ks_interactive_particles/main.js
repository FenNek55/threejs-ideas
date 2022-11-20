import '../../style.css'
import * as THREE from 'three'
import { scene, camera, renderer, updateCameraRotation } from './sceneSetup'

const SEPARATION = 60, AMOUNTX = 100, AMOUNTY = 100;
let particles, count = 0;

renderer.render(scene, camera)

const numParticles = AMOUNTX * AMOUNTY;
const positions = new Float32Array( numParticles * 3 );
const scales = new Float32Array( numParticles );

let i = 0, j = 0;

for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

  for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

    positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
    positions[ i + 1 ] = 0; // y
    positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z

    scales[ j ] = 1;

    i += 3;
    j ++;
  }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

const material = new THREE.ShaderMaterial( {

  uniforms: {
    color: { value: new THREE.Color( 0x42B883 ) },
  },
  vertexShader: document.getElementById( 'vertexshader' ).textContent,
  fragmentShader: document.getElementById( 'fragmentshader' ).textContent
} );

particles = new THREE.Points( geometry, material );
scene.add( particles );

const render = () => {
  const positions = particles.geometry.attributes.position.array;
  const scales = particles.geometry.attributes.scale.array;

  let i = 0, j = 0;

  for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

    for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

      positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
              ( Math.sin( ( iy + count ) * 0.5 ) * 50 );

      scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 20 +
              ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 20;

      i += 3;
      j ++;

    }

  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;

  renderer.render( scene, camera );

  count += 0.04;
}

updateCameraRotation()

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize( window.innerWidth, window.innerHeight );
}

const onMouseMove = (e) => {
  let xPos, yPos = 0
  xPos = e.x / window.innerWidth
  yPos = e.y / window.innerHeight

  updateCameraRotation(xPos * -1, yPos)
}

window.addEventListener('resize', onResize)
window.addEventListener('mousemove', onMouseMove)

const animate = () => {
  requestAnimationFrame( animate );
  render();
}

animate();