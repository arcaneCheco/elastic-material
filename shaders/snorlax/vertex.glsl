uniform float uTime;
uniform vec3 uDragStart;
uniform vec3 uDragTarget;
uniform float uReleaseDecay;
uniform float uReleaseFrequency;
uniform float uDragReleaseTime;
uniform float uDragRelease;

varying vec2 vUv;
varying float vDiff;


void main() {
    float startToTarget = distance(uDragTarget, uDragStart);
    float distanceToStart = distance(position, uDragStart);
    float influence = distanceToStart / (0.2 + 0.4 * startToTarget);
    float distortion = exp(pow(clamp(influence, 0.,1.), 3.2) * -6.);

    if (uDragRelease > 0.) {
        float timeSinceRelease = uTime - uDragReleaseTime;
        distortion *= exp(-uReleaseDecay * timeSinceRelease * max(distortion, 1.) / ( 6.));
        distortion *= cos(timeSinceRelease * uReleaseFrequency / ( 6.28));
    }

    vec3 stretch = (uDragTarget - uDragStart) * distortion;
    stretch += (uDragStart - position) * distortion * 0.72;

    vec3 pos = position;
    pos += stretch;
    pos.z += abs(distortion) * 0.2;

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.);

    gl_Position = projectionMatrix * viewPosition;

    vUv = uv;
    vDiff = length(pos - position) * uDragRelease;
}