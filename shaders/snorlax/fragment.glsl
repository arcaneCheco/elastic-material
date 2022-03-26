uniform sampler2D uMap;

varying vec2 vUv;
varying float vDiff;

void main() {
	gl_FragColor = texture2D(uMap, vUv);
	gl_FragColor.r += 3. * vDiff * texture2D(uMap, vUv + vec2(0.2, 0.)).r;
	gl_FragColor.g += 1.4 * vDiff * texture2D(uMap, vUv + vec2(0.3, 0.)).g;
	gl_FragColor.b += 2. * vDiff * texture2D(uMap, vUv + vec2(0.45, 0.)).b;
}