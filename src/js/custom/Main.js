import raf from 'raf';

import Blob from './Blob';

const glslify = require('glslify');

class App {

	constructor () {
		this.backgroundColor = 0x000000;
			
		this.resize = ::this.resize;
		this.update = ::this.update;
		
		this.init();
		this.bindListeners();
	}

	init () {
		const canvas = document.getElementById('canvas');

		this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(this.backgroundColor);

        this.scene = new THREE.Scene();

		this.camera = new THREE.OrthographicCamera( window.innerWidth * -0.5 , window.innerWidth * 0.5, window.innerHeight * 0.5, window.innerHeight * - 0.5, 1, 1000 );
		this.camera.position.z = 50;
		this.scene.add(this.camera);

		this.time = 0.0;

        this.addElements();

       	this.update();
	}

	bindListeners () {
		window.addEventListener('resize', this.resize);
	}

	addElements () {
		this.blobs = [];

		const centers = [];
		const radiuses = [];

		for ( let i = 0; i < 15; i++ ) {
			const blob = new Blob();
			centers.push( new THREE.Vector3(blob.position.x, blob.position.y, 0));
			radiuses.push(blob.radius);

			this.blobs.push(blob);
		}

		this.uniforms = [];
		this.uniforms['uRadiuses'] = { type: 'fv1', value: radiuses };
		this.uniforms['uCenters'] = { type: 'v3v', value: centers };

		this.uniforms['uColor'] = { type: 'v3', value: new THREE.Vector3(0.57, 0.28, 0)};
		this.uniforms['uTime'] = { type: 'f', value: this.time };
		this.uniforms['uResolution'] = { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)};

		this.planeGeometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight, 32 );
		this.material = new THREE.ShaderMaterial({
			vertexShader: glslify('./shaders/metaball.vert.glsl'),
            fragmentShader: glslify('./shaders/metaball.frag.glsl'),
            uniforms: this.uniforms,
		})

		this.plane = new THREE.Mesh( this.planeGeometry, this.material );
		this.scene.add(this.plane);
	}

	update () {
		this.time += 0.01;

		const centers = [];
		const radiuses = [];

		for ( let i = 0; i < this.blobs.length; i++ ) {
			const blob = this.blobs[i];
			blob.update(this.time);

			centers.push( new THREE.Vector3(blob.position.x, blob.position.y, 0));
			radiuses.push(blob.radius);
		}

		this.uniforms['uRadiuses'].value = radiuses;
		this.uniforms['uCenters'].value = centers;
		this.uniforms['uTime'].value = this.time;

		this.renderer.render(this.scene, this.camera);

		raf(this.update);
	}

	resize () {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

}

new App();