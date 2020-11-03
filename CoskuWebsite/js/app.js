//import { NURBSCurve } from "jsm/curves/NURBSCurve.js";
import { OBJLoader } from "../jsm/loaders/OBJLoader.js";
var renderer, scene, camera, composer, circle, skelet, particle, mountain, analyser;
var bufferGeometry;
var positions;
var normals;
var oldPos;
var initPos;
var indexB;
var mat;
var mountainGrp = false;
var mouseX = 0, mouseY = 0, count = 0;
var SEPARATION = 30, AMOUNTX = 50, AMOUNTY = 50;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mousedelta = 0.0;
var counter = 0;

function init()
{

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById('canvas').appendChild(renderer.domElement);
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );

  //SCENE
  scene = new THREE.Scene();
  //---CAMERA
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 10000);
  camera.position.z = 400;
  scene.add(camera);
  //---CAMERA

  //---FOG
  //scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0015 );
  //---FOG

  //---AUDIO
  var listener = new THREE.AudioListener();
  camera.add(listener);
  var sound = new THREE.Audio(listener);
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load("01_Mountain_Ash.mp3", function(buffer) {
  sound.setBuffer( buffer )});

  function playSound()
  {

    sound.play();
    var source = listener.context.createBufferSource();
    source.connect(listener.context.destination);
    source.start();
  }

  window.addEventListener('touchstart', playSound);
  document.addEventListener('click', playSound);

  // create an AudioAnalyser, passing in the sound and desired fftSize
  analyser = new THREE.AudioAnalyser( sound, 512 );
  // get the average frequency of the sound

  //---AUDIO

  //GEOMETRY

  mountainGrp = new THREE.Group();


  var loader = new OBJLoader();


  loader.load( 'geo/heightfield.obj', function ( mountain )
  {
    mountain.children[0].material = mat;
    mountainGrp.add(mountain.children[0]);
  } );
  //PARTICLES
  // create the particle variables
  // var particleCount = 1800;
  // var particleGeo = new THREE.BufferGeometry();
  // const particleMaterial = new THREE.PointsMaterial( { size: 15, vertexColors: true } );
  // var points = new THREE.Points( particleGeo, particleMaterial );
  // scene.add( points );



  //CREATE MATERIALS

  mat = new THREE.MeshStandardMaterial({
    color: 0xb4b4b4,
    emissive: 0xb4b4b4,
    //side: THREE.DoubleSide,
    //flatShading: true,
    wireframe: true,
  });


  scene.add(mountainGrp);

  mountainGrp.scale.x =   mountainGrp.scale.y =   mountainGrp.scale.z = 2;

  //LIGHTS

  // var ambientLight = new THREE.AmbientLight(0x999999,0.25 );
  // scene.add(ambientLight);
  //
  // var lights = [];
  // lights[0] = new THREE.DirectionalLight( 0xffffff, 0.5 );
  // lights[0].position.set( 1, 0, 0 );
  // lights[1] = new THREE.DirectionalLight( 0xefd1b5, 1.0 );
  // lights[1].position.set( 0.75, 1, 0.5 );
  // lights[2] = new THREE.DirectionalLight( 0x1B002A, 1.0 );
  // lights[2].position.set( -0.75, 1, 0.5 );
  // scene.add( lights[0] );
  // scene.add( lights[1] );
  // scene.add( lights[2] );


  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function animateParticles() {
  if (geo instanceof mountainGrp.children[0].geometry)
  {

    // let positions: Float32Array = geo.attributes["position"].array;
    // let ptCout = positions.length / 3;
    // for (let i = 0; i < ptCout; i++)
    // {
    //     let p = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    // }
    //test = mountainGrp.children[0].geometry.getIndex();
    //console.log(test);
    //positions = mountainGrp.children[0].geometry.getAttribute("position");
    //initPos = mountainGrp.children[0].geometry.getAttribute("position");
    //initPos = new THREE.Float32BufferAttribute(mountainGrp.children[0].geometry.attributes.position.array,3);
    //normals = mountainGrp.children[0].geometry.getAttribute("normal");
    //indexB = mountainGrp.children[0].geometry.getIndex();
    //console.log(indexB);


    // var interleavedBuffer = new THREE.InterleavedBuffer(positions,3);
    //positions.setUsage(THREE.DynamicDrawUsage);
    //normals.setUsage(THREE.DynamicDrawUsage);
    //bufferGeometry.setAttribute('normal', normals);
    //bufferGeometry.setAttribute('position', positions);
  }

  else {
    for ( var i = 0; i < positions.count; i += 1 ) {
        let shuffle = Math.floor((i/(128))%128);

        let newPos = initPos.getY(i)+(data[shuffle]/50);
        positions.setY(i,newPos);
        bufferGeometry.setIndex(indexB);
        bufferGeometry.setAttribute('position', positions);

    }
  }
  mountainGrp.children[0].geometry.getAttribute("position").needsUpdate = true;
  //counter += 1;



}

function animate() {
  var data = new Uint8Array(analyser.getFrequencyData());
  //console.log(data.length);
  var texture = new THREE.DataTexture( data, 16, 16, THREE.LuminanceFormat );
  texture.needsUpdate = true;
  texture.magFilter = THREE.LinearFilter;
  mat.displacementMap = texture;
  mat.displacementScale = 10;

  requestAnimationFrame(animate);
  camera.position.x += ( mouseX/3 - camera.position.x ) * .05;
	camera.position.y += ( - (mouseY/6) - camera.position.y ) * .05;

	camera.lookAt( scene.position );

  mountainGrp.rotation.y -= 0.0010;

  renderer.clear();

  renderer.render( scene, camera )
}

init();
animate();
