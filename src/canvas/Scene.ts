import * as THREE from "three";
import { createCameraRig } from "./Camera";
import { createEnvironment } from "./Environment";
import { registerInteractions } from "./interactions";
import { createShedGroup, updateShedGroup } from "./ShedGroup";
import { useShedStore } from "../store/shedStore";

export const initScene = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();

  // Camera rig (matches our updated Camera.ts)
  const cameraRig = createCameraRig();

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 10, 7);
  scene.add(ambientLight, directionalLight);

  // Environment (grass + sky, never rotates)
  const environment = createEnvironment();
  scene.add(environment);

  // Shed nodes (group + wireframe layer, etc.)
  const shedNodes = createShedGroup();
  scene.add(shedNodes.group);

  // Track selectable meshes for hover/selection highlighting
  let selectableMeshes: THREE.Object3D[] = [];
  let layoutSignature = "";

  const updateHighlights = () => {
    const { hoveredId, selectedId } = useShedStore.getState();
    const highlightColor = new THREE.Color(0xf59e0b);
    const hoverColor = new THREE.Color(0x38bdf8);

    selectableMeshes.forEach((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      const mat = obj.material;
      if (!mat || Array.isArray(mat)) return;

      const baseColor = obj.userData.baseColor ?? 0xffffff;
      mat.color.setHex(baseColor);

      if (
        selectedId &&
        (obj.userData.panelId === selectedId || obj.userData.openingId === selectedId)
      ) {
        mat.color.copy(highlightColor);
      } else if (
        hoveredId &&
        (obj.userData.panelId === hoveredId || obj.userData.openingId === hoveredId)
      ) {
        mat.color.copy(hoverColor);
      }
    });
  };

  const rebuildShed = () => {
    const state = useShedStore.getState();

    const { shadedCount, selectableMeshes: nextSelectable } = updateShedGroup(
      shedNodes,
      state.dimensions,
      state.panels,
      state.openings,
      state.shadedVisible,
      state.wireframeVisible
    );

    selectableMeshes = nextSelectable;
    updateHighlights();

    // Always enforce: if no shaded panels, wireframe must be visible
    if (shadedCount === 0) {
      shedNodes.wireframeLayer.visible = true;
      useShedStore.getState().setWireframeVisible(true);
      cameraRig.frameShed(shedNodes.group);
    }

    // Frame camera when layout changes
    const nextSignature = JSON.stringify({
      dimensions: state.dimensions,
      panels: state.panels.map((p) => ({ id: p.id, visibility: p.visibility })),
      openings: state.openings.length,
    });

    if (nextSignature !== layoutSignature) {
      layoutSignature = nextSignature;
      cameraRig.frameShed(shedNodes.group);
    }
  };

  // Initial build + frame
  rebuildShed();
  cameraRig.frameShed(shedNodes.group);

  // Subscribe to structural changes
  const unsubscribeStructure = useShedStore.subscribe(
    (state) => state,
    rebuildShed,
    {
      equalityFn: (a, b) =>
        a.dimensions === b.dimensions &&
        a.panels === b.panels &&
        a.openings === b.openings &&
        a.shadedVisible === b.shadedVisible &&
        a.wireframeVisible === b.wireframeVisible,
    }
  );

  // Subscribe to hover/selection changes
  const unsubscribeHighlight = useShedStore.subscribe(
    (state) => ({ hoveredId: state.hoveredId, selectedId: state.selectedId }),
    updateHighlights
  );

  // Interactions: drag rotates shed, click selects, world/camera does not rotate
  const cleanupInteractions = registerInteractions({
    element: renderer.domElement,         // IMPORTANT: never undefined
    shedGroup: shedNodes.group,
    camera: cameraRig.camera,
    onSelect: (hit) => {
      // Optional: if you want click-to-select behaviour in the store
      // You can decide what ID to store based on userData
      const id = (hit?.userData?.panelId ?? hit?.userData?.openingId ?? null) as string | null;
      useShedStore.getState().setSelectedId(id);
    },
  });

  // Resize handling
  const handleResize = () => {
    const { clientWidth, clientHeight } = canvas;

    renderer.setSize(clientWidth, clientHeight, false);

    cameraRig.camera.aspect = clientWidth / Math.max(1, clientHeight);
    cameraRig.camera.updateProjectionMatrix();
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  // Render loop
  let isMounted = true;
  const renderLoop = () => {
    if (!isMounted) return;
    renderer.render(scene, cameraRig.camera);
    requestAnimationFrame(renderLoop);
  };
  requestAnimationFrame(renderLoop);

  // Cleanup
  return () => {
    isMounted = false;
    window.removeEventListener("resize", handleResize);
    cleanupInteractions();
    unsubscribeStructure();
    unsubscribeHighlight();
    renderer.dispose();
  };
};
