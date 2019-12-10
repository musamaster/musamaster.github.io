//import { NURBSCurve } from "jsm/curves/NURBSCurve.js";
import { FBXLoader } from "./jsm/loaders/FBXLoader.js";
var renderer, scene, camera, composer, circle, skelet, particle, ear;

window.onload = function() {
  init();
  animate();
}
window.addEventListener('wheel', onMouseWheel, false);

var mousedelta = 0.0;

function onMouseWheel(event) {

  event.preventDefault();

  mousedelta += event.deltaY * 0.001;
}



function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById('canvas').appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;
  scene.add(camera);

  //circle = new THREE.Object3D();
  var loader = new FBXLoader();
  loader.load( '/geo/ear.fbx', function ( ear )
  {
    ear.traverse( ( child ) =>
    {
      if ( child.isMesh )
      {
        child.material.wireframe = true;
      }
    }  );

    ear.scale.x = ear.scale.y = ear.scale.z = 3;
    scene.add( ear );

  } );

  skelet = new THREE.Object3D();
  particle = new THREE.Object3D();

  //scene.add(circle);
  scene.add(skelet);
  scene.add(particle);

  var geometry = new THREE.TetrahedronGeometry(2, 0);
  var geom = new THREE.IcosahedronGeometry(7, 1);
  var geom2 = new THREE.IcosahedronGeometry(15, 1);

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  for (var i = 0; i < 1000; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(90 + (Math.random() * 700));
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }

  var mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  var mat2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: true,
    side: THREE.DoubleSide

  });

  // var planet = new THREE.Mesh(ear, mat);
  // planet.scale.x = planet.scale.y = planet.scale.z = 16;
  // circle.add(planet);

  var planet2 = new THREE.Mesh(geom2, mat2);
  planet2.scale.x = planet2.scale.y = planet2.scale.z = 10;
  skelet.add(planet2);

  var ambientLight = new THREE.AmbientLight(0x999999 );
  scene.add(ambientLight);

  var lights = [];
lights[0] = new THREE.DirectionalLight( 0xffffff, 1 );
lights[0].position.set( 1, 0, 0 );
lights[1] = new THREE.DirectionalLight( 0xf2f1bf, 1 );
lights[1].position.set( 0.75, 1, 0.5 );
lights[2] = new THREE.DirectionalLight( 0x1B002A, 1 );
lights[2].position.set( -0.75, -1, 0.5 );
scene.add( lights[0] );
scene.add( lights[1] );
scene.add( lights[2] );


  window.addEventListener('resize', onWindowResize, false);

};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

function animate() {
  requestAnimationFrame(animate);

  particle.rotation.x = mousedelta;
  particle.rotation.y = mousedelta;
  skelet.rotation.x = mousedelta;
  skelet.rotation.y = mousedelta;
  //particle.rotation.x += 0.0000;
  //particle.rotation.y -= 0.0040;
  //ear.rotation.x -= 0.0020;
  //ear.rotation.y -= 0.0030;
  // skelet.rotation.x -= 0.0010;
  // skelet.rotation.y += 0.0020;
  renderer.clear();

  renderer.render( scene, camera )
};
