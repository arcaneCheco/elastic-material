import * as THREE from "three";
import { Pane } from "tweakpane";
import Piplup from "./Piplup";
import Snorlax from "./Snorlax";

export class World {
  constructor() {
    this.time = 0;
    this.container = document.querySelector("#canvas");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.mouse = new THREE.Vector2();
    this.isDragging = false;
    this.threeSetup();
    this.setTouchTarget();
    this.setDemos();
    this.addListeners();
    this.render();
    location.hash.includes("#config") && this.setConfig();
  }

  threeSetup() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      65,
      this.width / this.height,
      0.1,
      200
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    this.camera.position.z = 3;
    this.raycaster = new THREE.Raycaster();
  }

  setTouchTarget() {
    this.touchTarget = new THREE.Mesh(
      new THREE.PlaneGeometry(5000, 5000),
      new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true,
        depthWrite: false,
      })
    );
  }

  setDemos() {
    this.demos = {
      piplup: new Piplup(),
      snorlax: new Snorlax(),
    };
    this.switchTo("piplup");

    this.config && this.config.refresh();
  }

  setConfig() {
    this.config = new Pane();
    this.config
      .addBlade({
        view: "list",
        label: "Demo",
        options: [
          { text: "Piplup", value: "piplup" },
          { text: "snorlax", value: "snorlax" },
        ],
        value: "piplup",
      })
      .on("change", ({ value }) => {
        this.switchTo(value);
      });
    Object.entries(this.demos).map(([title, demo]) => {
      const folder = this.config.addFolder({ title });
      demo.setConfig(folder);
    });
  }

  switchTo(demo) {
    this.active && this.scene.remove(this.active.shape);
    this.active = this.demos[demo];
    this.scene.add(this.active.shape);
    gsap.to(".demos-container", {
      duration: 1,
      background: this.active.backgroundColor,
    });
  }

  onMouseDown(event) {
    this.mouse.x = 2 * (event.clientX / this.width) - 1;
    this.mouse.y = -2 * (event.clientY / this.height) + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersect = this.raycaster.intersectObject(this.active.shape);
    if (intersect.length) {
      this.isDragging = true;
      const startPosition = intersect[0].point;
      this.active.onMouseDown(startPosition);
    }
  }

  onMouseMove(event) {
    this.mouse.x = 2 * (event.clientX / this.width) - 1;
    this.mouse.y = -2 * (event.clientY / this.height) + 1;
    this.active.shape.rotation.y = this.mouse.x * 0.15;
    this.active.shape.rotation.x = this.mouse.y * 0.15;
    if (!this.isDragging) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersect = this.raycaster.intersectObject(this.touchTarget);
    if (intersect.length) {
      const target = intersect[0].point;
      this.active.onMouseMove(target);
    }
  }

  onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.active.onMouseUp(this.time);
  }

  onResize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  onHashChange() {
    if (location.hash.includes("#config")) {
      !this.config && this.setConfig();
    } else {
      if (this.config) {
        this.config.dispose();
        this.config = null;
      }
    }
  }

  addListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("hashchange", this.onHashChange.bind(this));

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    window.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);

    const demos = document.querySelectorAll(".demo");
    demos.forEach((demoElement) => {
      demoElement.addEventListener("click", () => {
        this.switchTo(demoElement.id);
      });
    });
  }

  render() {
    this.time += 0.01633;
    this.active.update(this.time);
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new World();
