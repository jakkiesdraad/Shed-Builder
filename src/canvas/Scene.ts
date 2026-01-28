import * as THREE from 'three';
import { createCameraRig } from './Camera';
import { createEnvironment } from './Environment';
import { registerInteractions } from './interactions';
import { createShedGroup, updateShedGroup } from './ShedGroup';
import { useShedStore } from '../store/shedStore';

export const initScene = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();

  const cameraRig = createCameraRig(canvas.clientWidth, canvas.clientHeight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 10, 7);
  scene.add(ambientLight, directionalLight);

  const environment = createEnvironment();
  scene.add(environment);

  const shedNodes = createShedGroup();
  scene.add(shedNodes.group);

  let selectableMeshes: THREE.Object3D[] = [];
  let layoutSignature = '';

  const updateHighlights = () => {
    const { hoveredId, selectedId } = useShedStore.getState();
    const highlightColor = new THREE.Color(0xf59e0b);
    const hoverColor = new THREE.Color(0x38bdf8);

    selectableMeshes.forEach((mesh) => {
      const material = mesh instanceof THREE.Mesh ? mesh.material : null;
      if (!material || Array.isArray(material)) {
        return;
      }
      const baseColor = mesh.userData.baseColor ?? 0xffffff;
      material.color.setHex(baseColor);

      if (selectedId && (mesh.userData.panelId === selectedId || mesh.userData.openingId === selectedId)) {
        material.color.copy(highlightColor);
      } else if (hoveredId && (mesh.userData.panelId === hoveredId || mesh.userData.openingId === hoveredId)) {
        material.color.copy(hoverColor);
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

    if (shadedCount === 0) {
      shedNodes.wireframeLayer.visible = true;
      useShedStore.getState().setWireframeVisible(true);
      cameraRig.frameShed(shedNodes.group);
    }

    const nextSignature = JSON.stringify({
      dimensions: state.dimensions,
      panels: state.panels.map((panel) => ({ id: panel.id, visibility: panel.visibility })),
      openings: state.openings.length,
    });
    if (nextSignature !== layoutSignature) {
      layoutSignature = nextSignature;
      cameraRig.frameShed(shedNodes.group);
    }
  };

  rebuildShed();
  const unsubscribeStructure = useShedStore.subscribe((state) => state, rebuildShed, {
    equalityFn: (a, b) =>
      a.dimensions === b.dimensions &&
      a.panels === b.panels &&
      a.openings === b.openings &&
      a.shadedVisible === b.shadedVisible &&
      a.wireframeVisible === b.wireframeVisible,
  });

  const unsubscribeHighlight = useShedStore.subscribe(
    (state) => ({ hoveredId: state.hoveredId, selectedId: state.selectedId }),
    updateHighlights
  );

  const cleanupInteractions = registerInteractions({
    canvas,
    cameraRig,
    shedGroup: shedNodes.group,
    getSelectableMeshes: () => selectableMeshes,
  });

  const handleResize = () => {
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight, false);
    cameraRig.resize(clientWidth, clientHeight);
  };

  handleResize();
  window.addEventListener('resize', handleResize);

  let isMounted = true;
  const renderLoop = () => {
    if (!isMounted) {
      return;
    }
    renderer.render(scene, cameraRig.camera);
    requestAnimationFrame(renderLoop);
  };

  requestAnimationFrame(renderLoop);

  return () => {
    isMounted = false;
    window.removeEventListener('resize', handleResize);
    cleanupInteractions();
    unsubscribeStructure();
    unsubscribeHighlight();
    renderer.dispose();
  };
};
