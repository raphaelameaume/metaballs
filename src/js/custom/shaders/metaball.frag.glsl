uniform vec2 uCenters[15];
uniform float uRadiuses[15];
uniform float uTime;

uniform vec2 uResolution;
uniform vec3 uColor;

#pragma glslify: noise = require('glsl-noise/classic/4d');

void main() {
	float sum = 0.;
	float displacement = noise(vec4(gl_FragCoord.xyz, uTime));

	for (int i = 0; i < 15; ++i) {

		vec3 point = vec3(uCenters[i].x, uCenters[i].y, 0.);
		float dist = distance(point, gl_FragCoord.xyz);
		float color = uRadiuses[i] / dist;
		
		sum += color;
	}

  	gl_FragColor = vec4(sum * uColor.x, sum * uColor.y, sum * uColor.z, 1.);
}