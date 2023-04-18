import React, { Component } from "react";
import { keyframes, styled } from "goober";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import globePoints from "@/feature-china-web/globe-points.json";
import globals from "@/util/global-whitelist.mjs";

Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};
const Pulse = keyframes`
	0% { -webkit-transform: scale(1); }
	50% { opacity: 0.5; }
	100% { opacity: 0; -webkit-transform: scale(3); }
`;

const Container = styled("div")`
  position: absolute;
  right: -512px;
  top: 0;
  height: 536px;

  @media screen and (max-width: 500px) {
    top: auto;
    bottom: var(--sp-10);
  }
`;

const Canvas = styled("canvas", React.forwardRef)`
  z-index: 11;
  position: relative;
  border: none;
  outline: none;
`;

const ElementsList = styled("ul", React.forwardRef)`
  z-index: 10;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  height: 560px;
  list-style: none;
  overflow: hidden;
  margin: 0;
  padding: 0;

  .child {
    position: absolute;
    margin-top: 6px;
    width: var(--sp-4);
    height: var(--sp-4);
    border-radius: 50%;
    background: var(--primary);
    :before {
      content: "";
      pointer-events: none;
      position: absolute;
      left: -12px;
      top: 50%;
      margin-left: -8px;
      margin-top: -8px;
      width: var(--sp-4);
      height: var(--sp-4);
      border-radius: 50%;
      background: var(--primary);
      animation: ${Pulse} 2s infinite linear;
    }
    .child-div {
      background-color: rgba(47, 60, 89, 0.2);
      padding: 15px;
      position: absolute;
      transform: translateY(-50%);
      left: var(--sp-5);
      top: 50%;
      .child-span {
        font-size: 0.875rem;
        line-height: var(--sp-3);
        font-weight: 700;
        text-align: right;
        color: var(--white);
        white-space: nowrap;
      }
    }
  }
`;

class GlobeRenderer extends Component {
  constructor(props) {
    super(props);
    this.groups = {};
    this.elements = {};
    this.countryPos = {};
    this.state = {
      data: null,
      props: {
        mapSize: {
          width: 2048 / 2,
          height: 1024 / 2,
        },
        globeRadius: 350,
        colours: {
          globeDots: "rgb(80, 100, 134)",
          lineDots: new Three.Color("#18FFFF"),
        },
      },
    };
  }

  getRenderer(element) {
    const renderer = new Three.WebGLRenderer({
      canvas: element,
      antialias: true,
      alpha: true,
      shadowMapEnabled: false,
    });
    renderer.setPixelRatio(globals.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    return renderer;
  }

  setupScene() {
    const element = this.canvasElement;
    const scene = new Three.Scene();
    const renderer = this.getRenderer(element);

    const mainGroup = new Three.Group();
    const dotsGroup = new Three.Group();
    mainGroup.name = "Main";
    dotsGroup.name = "Dots";
    mainGroup.add(dotsGroup);
    const camera = this.getCamera(element);
    camera.position.set(16, 350, 600);
    const controls = this.getControls(camera, element);
    controls.minDistance = 500;
    controls.maxDistance = 850;
    controls.autoRotate = true;
    controls.enableZoom = false;
    renderer.setSize(1024, 512);
    camera.aspect = 1024 / 512;
    camera.updateProjectionMatrix();
    this.groups = { mainGroup, dotsGroup };
    this.instances = { camera, controls, renderer, scene };
    const pts = this.getGlobeDots();
    pts.rotateY(Math.radians(210));
    scene.add(pts);
    this.createListElements();
    const animate = () => {
      requestAnimationFrame(animate);
      this.positionElements();
      controls.update();
      renderer.render(scene, camera);
    };

    renderer.render(scene, camera);
    animate();
  }

  getCamera(element) {
    return new Three.PerspectiveCamera(
      62,
      element.clientWidth / element.clientHeight,
      1,
      1000
    );
  }

  getControls(camera, element) {
    return new OrbitControls(camera, element);
  }

  getGlobeDots() {
    const { props, data } = this.state;
    const geometry = new Three.BufferGeometry();
    const canvasSize = 16;
    const halfSize = canvasSize / 2;
    const textureCanvas = globals.document.createElement("canvas");
    textureCanvas.width = canvasSize;
    textureCanvas.height = canvasSize;
    const canvasContext = textureCanvas.getContext("2d");
    canvasContext.beginPath();
    canvasContext.arc(halfSize, halfSize, halfSize, 0, 2 * Math.PI);
    canvasContext.fillStyle = props.colours.globeDots;
    canvasContext.fill();

    const texture = new Three.Texture(textureCanvas);
    texture.needsUpdate = true;

    const material = new Three.PointsMaterial({
      map: texture,
      size: props.globeRadius / 120,
    });

    const points = [];

    const addDot = (targetX, targetY, name = null) => {
      const result = this.returnSphericalCoordinates(targetX, targetY);
      const point = new Three.Vector3(result.x, result.y, result.z);
      points.push(point);
      if (name !== null) {
        this.countryPos[name] = point;
      }
    };
    for (let i = 0; i < data.points.length; i++) {
      addDot(data.points[i].x, data.points[i].y);
    }
    for (const country in data.countries) {
      addDot(data.countries[country].x, data.countries[country].y, country);
    }
    geometry.setFromPoints(points);
    return new Three.Points(geometry, material);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.data && this.state.data && this.canvasElement) {
      this.setupScene();
    }
  }

  createListElements() {
    const list = this.listElement;
    const finalThis = this;
    const pushObject = function (coordinates, target) {
      const element = globals.document.createElement("li");
      element.classList.add("child");
      const targetCountry = finalThis.state.data.countries[target];
      element.innerHTML = `<div class="child-div"><span class="child-span">${targetCountry.country}</span></div>`;
      const object = {
        position: coordinates,
        element: element,
      };
      list?.appendChild(element);
      finalThis.elements[target] = object;
    };
    const { data } = this.state;
    for (const country in data.countries) {
      pushObject(this.countryPos[country], country);
    }
  }

  opacity(val, max, min) {
    const normalized = (val - min) / (max - min);
    if (normalized < 0.1) return 0.1;
    if (normalized > 1) return 1;
    return normalized;
  }
  positionElements() {
    const canvas = this.canvasElement;
    const widthHalf = canvas.clientWidth / 2;
    const heightHalf = canvas.clientHeight / 2;
    const camPos = this.instances.camera.position;

    for (const key in this.elements) {
      const targetElement = this.elements[key];
      const distance = camPos.distanceTo(targetElement.position);
      const position = this.getProjectedPosition(
        widthHalf,
        heightHalf,
        targetElement.position
      );

      const positionX = `${position.x}px`;
      const positionY = `${position.y}px`;

      const elementStyle = targetElement.element.style;

      elementStyle.opacity = this.opacity(distance, 300, 500);

      elementStyle.webkitTransform = `translate3D(${positionX}, ${positionY}, 0)`;
      elementStyle.WebkitTransform = `translate3D(${positionX}, ${positionY}, 0)`;
      elementStyle.mozTransform = `translate3D(${positionX}, ${positionY}, 0)`;
      elementStyle.msTransform = `translate3D(${positionX}, ${positionY}, 0)`;
      elementStyle.oTransform = `translate3D(${positionX}, ${positionY}, 0)`;
      elementStyle.transform = `translate3D(${positionX}, ${positionY}, 0)`;
    }
  }

  getProjectedPosition(width, height, position) {
    position = position.clone();
    const projected = position.project(this.instances.camera);
    return {
      x: projected.x * width + width,
      y: -(projected.y * height) + height,
    };
  }

  returnSphericalCoordinates(latitude, longitude) {
    const { props } = this.state;
    latitude = ((latitude - props.mapSize.width) / props.mapSize.width) * -180;
    longitude =
      ((longitude - props.mapSize.height) / props.mapSize.height) * -90;
    const radius = Math.cos((longitude / 180) * Math.PI) * props.globeRadius;
    const targetX = Math.cos((latitude / 180) * Math.PI) * radius;
    const targetY = Math.sin((longitude / 180) * Math.PI) * props.globeRadius;
    const targetZ = Math.sin((latitude / 180) * Math.PI) * radius;
    return {
      x: targetX,
      y: targetY,
      z: targetZ,
    };
  }

  componentDidMount() {
    this.setState({
      data: {
        points: globePoints.points,
        countries: {
          la: {
            x: 344,
            y: 263,
            name: "",
            country: "Los Angeles, CA",
          },
          ca1: {
            x: 370,
            y: 170,
            name: "",
            country: "Vancouver, B.C., Canada",
          },
          v1: {
            x: 560,
            y: 246,
            name: "",
            country: "Virginia Beach, Virginia",
          },
          ham: {
            x: 565,
            y: 204,
            name: "",
            country: "Hamilton, Ontario, Canada",
          },
          brazil: {
            x: 690,
            y: 635,
            name: "",
            country: "Porto Alegre, Brazil",
          },
          uk: {
            x: -760,
            y: 162,
            name: "",
            country: "London, UK",
          },
          uk2: {
            x: -760,
            y: 148,
            name: "",
            country: "Staffordshire, UK",
          },
          poland: {
            x: -615,
            y: 161,
            name: "",
            country: "Warsaw, Poland ",
          },
          g1: {
            x: -658,
            y: 171,
            name: "",
            country: "Berlin, Germany",
          },
          g2: {
            x: -707,
            y: 188,
            name: "",
            country: "Offenburg, Germany",
          },
          vietnam1: {
            x: -139,
            y: 351,
            name: "",
            country: "Hanoi, Vietnam",
          },
          india: {
            x: -238,
            y: 330,
            name: "",
            country: "Kolkata, India",
          },
        },
      },
    });
  }

  render() {
    return (
      <Container>
        <ElementsList
          ref={(ref) => {
            if (!this.listElement) this.listElement = ref;
          }}
        />
        <Canvas
          ref={(ref) => {
            if (!this.canvasElement) this.canvasElement = ref;
          }}
        />
      </Container>
    );
  }
}

export default GlobeRenderer;
