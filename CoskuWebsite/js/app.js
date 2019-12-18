//import { NURBSCurve } from "jsm/curves/NURBSCurve.js";
import { OBJLoader } from "../jsm/loaders/OBJLoader.js";
var renderer, scene, camera, composer, circle, skelet, particle, ear, earGrp, particles,analyser;
var mouseX = 0, mouseY = 0, count = 0;
var SEPARATION = 30, AMOUNTX = 50, AMOUNTY = 50;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mousedelta = 0.0;

function init() {

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

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;
  scene.add(camera);
  var listener = new THREE.AudioListener();
  camera.add(listener);

  var sound = new THREE.Audio(listener);
  var audioLoader = new THREE.AudioLoader();

  function playSound() {
    audioLoader.load("/CoskuWebsite/01_Mountain_Ash.mp3", function(buffer) {
      sound.setBuffer( buffer );
      sound.play();
    });

    var source = listener.context.createBufferSource();
    source.connect(listener.context.destination);
    source.start();
  }
  window.addEventListener('touchstart', playSound);
  document.addEventListener('click', playSound);
  // create an AudioAnalyser, passing in the sound and desired fftSize
  analyser = new THREE.AudioAnalyser( sound, 1024 );

  // get the average frequency of the sound


  //GEOMETRY

  earGrp = new THREE.Object3D();
  skelet = new THREE.Object3D();
  particle = new THREE.Object3D();

  scene.add(earGrp);
  //scene.add(skelet);

  var loader = new OBJLoader();
  loader.load( '/CoskuWebsite/geo/ear.obj', function ( ear )
  {
    ear.traverse( ( child ) =>
    {
      if ( child.isMesh )
      {
        //child.material.wireframe = true;
        earGrp.add(child);
      }
    }  );

  } );

  //CREATE TET GEO
  var geometryt = new THREE.TetrahedronGeometry(2, 0);
  var geom = new THREE.IcosahedronGeometry(7, 1);
  var geom2 = new THREE.IcosahedronGeometry(15, 1);


  //CREATE PARTICLES
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

	var numParticles = AMOUNTX * AMOUNTY;
	var positions = new Float32Array( numParticles * 3 );
	var scales = new Float32Array( numParticles );
	var i = 0, j = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
			positions[ i + 1 ] = 0; // y
			positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z
			scales[ j ] = 1;
			i += 3;
			j ++;
		}
	}

	var geometry = new THREE.BufferGeometry();
	geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );
	var material = new THREE.ShaderMaterial( {
		uniforms: {
			color: { value: new THREE.Color( 0x999999f ) },
		},
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent
	} );


	particles = new THREE.Points( geometry, material );
	scene.add( particles );


  //MATERIALS


  var mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  var mat2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: true,
    side: THREE.DoubleSide

  });

  //var planet = new THREE.Mesh(earGrp, mat2);
  //planet.scale.x = planet.scale.y = planet.scale.z = 16;
  earGrp.scale.x =   earGrp.scale.y =   earGrp.scale.z = 2;

  var planet2 = new THREE.Mesh(geom2, mat2);
  planet2.scale.x = planet2.scale.y = planet2.scale.z = 10;
  skelet.add(planet2);

  //LIGHTS

  var ambientLight = new THREE.AmbientLight(0x999999,0.25 );
  scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 0.5 );
  lights[0].position.set( 1, 0, 0 );
  lights[1] = new THREE.DirectionalLight( 0xf2f1bf, 1.0 );
  lights[1].position.set( 0.75, 1, 0.5 );
  lights[2] = new THREE.DirectionalLight( 0x1B002A, 1.0 );
  lights[2].position.set( -0.75, -1, 0.5 );
  scene.add( lights[0] );
  scene.add( lights[1] );
  scene.add( lights[2] );


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

// window.onload = function() {

// }

function animate() {
  var data = analyser.getAverageFrequency();
  //console.log(data);
  requestAnimationFrame(animate);
  camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );
	var positions = particles.geometry.attributes.position.array;
	var scales = particles.geometry.attributes.scale.array;
	var i = 0, j = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) * data ) +
							( Math.sin( ( iy + count ) * 0.5 ) * data );
			scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * (data/40) +
							( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * (data/40);
			i += 3;
			j ++;
		}
	}
	particles.geometry.attributes.position.needsUpdate = true;
	particles.geometry.attributes.scale.needsUpdate = true;

  count += 0.1;

  //particle.rotation.x = mousedelta;
  //particle.rotation.y = mousedelta;
  //skelet.rotation.x = mousedelta;
  //skelet.rotation.y = mousedelta;
  particles.position.y = -200.0;
  //particle.rotation.x += 0.0000;
  //particle.rotation.y -= 0.0040;
  earGrp.rotation.x -= 0.0020;
  earGrp.rotation.y -= 0.0030;
  skelet.rotation.x -= 0.0010;
  skelet.rotation.y += 0.0020;
  renderer.clear();

  renderer.render( scene, camera )
}

init();
animate();
