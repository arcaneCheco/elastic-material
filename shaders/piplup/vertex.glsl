uniform float uTime;
uniform vec3 uDragStart;
uniform vec3 uDragTarget;
uniform float uDragReleaseTime;
uniform float uDragRelease;

varying vec2 vUv;


void main() {
    float startToTarget = distance(uDragTarget, uDragStart);
    float distanceToStart = distance(position, uDragStart);
    float influence = distanceToStart / (0.2 + 0.4 * startToTarget);
    float distortion = exp(pow(clamp(influence, 0.,1.), 4.2) * -3.);

    if (uDragRelease > 0.) {
        float timeSinceRelease = uTime - uDragReleaseTime;
        distortion *= exp(pow(timeSinceRelease, 2.7) * -3.) * sin(clamp(timeSinceRelease, 0., 1.) * 12. * 6.28);
    }

    vec3 stretch = (uDragTarget - uDragStart) * distortion;
    stretch += (uDragStart - position) * distortion * 0.72;

    vec3 pos = position;
    pos += stretch;
    pos.z += abs(distortion) * 0.1;

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.);

    gl_Position = projectionMatrix * viewPosition;

    vUv = uv;
}