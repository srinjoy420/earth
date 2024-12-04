import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getFresnelMat } from "./src/getFresnelMat.js";

import getStarfield from "./src/getStarfield.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let textureLoader = new THREE.TextureLoader();
let tex = textureLoader.load("./earthmap1k.jpg");
let tex2=textureLoader.load("/textures/03_earthlights1k.jpg")
let cloud=textureLoader.load("/textures/05_earthcloudmaptrans.jpg")

const earthgroup=new THREE.Group();
earthgroup.rotation.z=  -23.4 * Math.PI / 180;
scene.add(earthgroup)

const geometry = new THREE.IcosahedronGeometry( 2, 12 );
const material = new THREE.MeshStandardMaterial( { map:tex
  /*flatShading:true*/ } );
const cube = new THREE.Mesh( geometry, material );
earthgroup.add( cube );

const lightmat=new THREE.MeshBasicMaterial({
  // color:"green",
  // transparent:true,
  // opacity:0.3,
  map:tex2,
  transparent: true, // Enable transparency
  blending: THREE.AdditiveBlending,
  opacity:0
  })
  const cloudmat=new THREE.MeshBasicMaterial({
    map:cloud,
    //  transparent:true,
    blending: THREE.AdditiveBlending,
    opacity:0.01
    


  })
  
const lightmesh=new THREE.Mesh(geometry,lightmat)
const cloudmesh=new THREE.Mesh(geometry,cloudmat);
earthgroup.add(cloudmesh)

cube.add(lightmesh)


const finalmat=getFresnelMat();
const glowmesh=new THREE.Mesh(geometry,finalmat);
glowmesh.scale.setScalar(1.001);
earthgroup.add(glowmesh);


camera.position.z = 5;


// add star
const stars=getStarfield({numStars:2000});
scene.add(stars)


// light
// const hemlight= new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
// scene.add(hemlight)
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
directionalLight.position.set(2,-0.5,2)
scene.add( directionalLight );

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// orbitcontroles
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping=true;
renderer.render(scene,camera)

window.addEventListener("resize", function(e) {
  camera.aspect=window.innerWidth/this.window.innerHeight;
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.updateProjectionMatrix();
})

function animate(){
  window.requestAnimationFrame(animate);
  cube.rotation.y += 0.002;
  lightmesh.rotation.y += 0.001 ;
  cloudmesh.rotation.y +=0.001;
  glowmesh.rotation.y +=0.001;

  renderer.render(scene,camera)
  
}
animate()