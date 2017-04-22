class Blob extends THREE.Object3D {

	constructor ( x, y ) {
		super();

		this.position.x = Math.floor(Math.random() * window.innerWidth);
		this.position.y = Math.floor(Math.random() * window.innerHeight);

		this.velocity = new THREE.Vector3(Math.random(), Math.random(), 0);

		const scalar = Math.floor(Math.random() * 3) + 2;
		this.velocity.multiplyScalar(scalar);

		this.radius = Math.floor(Math.random() * 40) + 30;
	}

	update ( time ) {
		this.position.add(this.velocity);

		if ( this.position.x < 0 || this.position.x > window.innerWidth ) {
			this.velocity.x *= -1;
		}

		if ( this.position.y < 0 || this.position.y > window.innerHeight ) {
			this.velocity.y *= -1;
		}

		const distorsion = Math.sin(time) * 0.05;

		this.radius += distorsion;
	}

}

export default Blob;