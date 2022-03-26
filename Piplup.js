import * as THREE from "three";
import fragmentShaderPiplup from "./shaders/piplup/fragment.glsl";
import vertexShaderPiplup from "./shaders/piplup/vertex.glsl";

export default class Piplup {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.backgroundColor =
      "linear-gradient(0deg,rgb(44, 205, 207) 0%, rgb(255, 243, 218) 100%)";
    this.setGeometry();
    this.setMaterial();
    this.setShape();
  }

  setGeometry() {
    this.frontG = new THREE.PlaneGeometry(1.4327485, 2, 143, 200);
    this.backG = this.frontG.clone();
    this.backG.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI));
  }

  setMaterial() {
    this.frontM = new THREE.ShaderMaterial({
      vertexShader: vertexShaderPiplup,
      fragmentShader: fragmentShaderPiplup,
      uniforms: {
        uTime: { value: 0 },
        uDragStart: { value: new THREE.Vector3() },
        uDragTarget: { value: new THREE.Vector3() },
        uDragReleaseTime: { value: 0 },
        uDragRelease: { value: 1 },
        uReleaseDecay: { value: 3 },
        uReleaseFrequency: { value: 12 },
        uMap: { value: this.textureLoader.load("./assets/piplup.png") },
      },
      transparent: true,
    });

    this.backM = this.frontM.clone();
    this.backM.uniforms.uMap.value = this.textureLoader.load(
      "./assets/poke_back.png"
    );
  }

  setShape() {
    const frontSide = new THREE.Mesh(this.frontG, this.frontM);
    const backSide = new THREE.Mesh(this.backG, this.backM);
    // backSide.renderOrder = -100;

    this.shape = new THREE.Group();
    this.shape.add(frontSide);
    this.shape.add(backSide);
  }

  onMouseDown(position) {
    this.frontM.uniforms.uDragStart.value.copy(position);
    this.frontM.uniforms.uDragTarget.value.copy(position);
    this.frontM.uniforms.uDragRelease.value = false;
    this.backM.uniforms.uDragStart.value.copy(position);
    this.backM.uniforms.uDragTarget.value.copy(position);
    this.backM.uniforms.uDragRelease.value = false;
  }

  onMouseMove(position) {
    this.frontM.uniforms.uDragTarget.value.copy(position);
    this.backM.uniforms.uDragTarget.value.copy(position);
  }

  onMouseUp(time) {
    this.frontM.uniforms.uDragReleaseTime.value = time;
    this.frontM.uniforms.uDragRelease.value = true;
    this.backM.uniforms.uDragReleaseTime.value = time;
    this.backM.uniforms.uDragRelease.value = true;
  }

  update(time) {
    this.frontM.uniforms.uTime.value = time;
    this.backM.uniforms.uTime.value = time;
  }

  setConfig() {}
}
