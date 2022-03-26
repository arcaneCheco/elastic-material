uniform sampler2D uMap;

varying vec2 vUv;

void main() {
	gl_FragColor = texture2D(uMap, vUv);
}