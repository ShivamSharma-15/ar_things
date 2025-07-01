import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight";
import { useNavigate } from "react-router-dom";

export default function Canvas() {
  const canvasRef = useRef();
  const containerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    let scene, camera, renderer;
    let reticle;
    let hitTestSource = null;
    let hitTestSourceRequested = false;
    let controller;
    const models = ["./armchair1.glb"];
    const items = [];

    init();
    setupFurnitureSelection();
    animate();

    function init() {
      // Scene & camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );

      // Default light
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      // Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;

      // XR light estimation
      const xrLight = new XREstimatedLight(renderer);
      xrLight.addEventListener("estimationstart", () => {
        scene.add(xrLight);
        scene.remove(light);
        if (xrLight.environment) scene.environment = xrLight.environment;
      });
      xrLight.addEventListener("estimationend", () => {
        scene.add(light);
        scene.remove(xrLight);
      });

      // AR button / start
      const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay", "light-estimation"],
        domOverlay: { root: containerRef.current },
      });
      containerRef.current.appendChild(arButton);

      // When XR session ends, go back to product page
      renderer.xr.addEventListener("sessionend", () => {
        navigate("/");
      });

      // Load models
      models.forEach((src, idx) => {
        new GLTFLoader().load(src, (glb) => {
          items[idx] = glb.scene;
        });
      });

      // Controller for tap-to-place
      controller = renderer.xr.getController(0);
      controller.addEventListener("select", onSelect);
      scene.add(controller);

      // Reticle for hit-testing
      reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial()
      );
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);
    }

    function onSelect() {
      if (!reticle.visible) return;
      const model = items[0].clone();
      model.position.setFromMatrixPosition(reticle.matrix);
      model.scale.set(0.01, 0.01, 0.01);
      scene.add(model);
    }

    function setupFurnitureSelection() {
      // Your existing UI hookup for switching items…
    }

    function animate() {
      renderer.setAnimationLoop(render);
    }

    function render(time, frame) {
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (!hitTestSourceRequested) {
          session.requestReferenceSpace("viewer").then((ref) => {
            session.requestHitTestSource({ space: ref }).then((source) => {
              hitTestSource = source;
            });
          });
          session.addEventListener("end", () => {
            hitTestSourceRequested = false;
            hitTestSource = null;
          });
          hitTestSourceRequested = true;
        }

        if (hitTestSource) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length) {
            const hit = hitTestResults[0];
            reticle.visible = true;
            reticle.matrix.fromArray(
              hit.getPose(referenceSpace).transform.matrix
            );
          } else {
            reticle.visible = false;
          }
        }
      }

      renderer.render(scene, camera);
    }

    // Intercept hardware/browser back button
    function onPopState() {
      const session = renderer.xr.getSession();
      if (session) {
        session.end(); // triggers our sessionend → navigate("/")
      } else {
        navigate("/");
      }
    }
    window.addEventListener("popstate", onPopState);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (renderer && renderer.xr.getSession()) {
        renderer.xr.getSession().end();
      }
    };
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh", position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{ width: "100%", height: "100%" }}
      />
      {/* Optional model selectors UI */}
      <div className="navbar">
        <img
          className="button-image"
          id="item0"
          src="/couch-front.png"
          alt=""
        />
      </div>
    </div>
  );
}
