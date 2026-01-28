import * as THREE from 'three';
import type { OpeningState, PanelState, ShedDimensions } from '../store/shedStore';
import { createOpeningMesh } from './Opening';
import { createPanelMesh } from './Panel';
import { createWireframeForPanel } from './Wireframe';

export interface ShedGroupNodes {
  group: THREE.Group;
  wireframeLayer: THREE.Group;
  panelsLayer: THREE.Group;
  roofLayer: THREE.Group;
  openingsLayer: THREE.Group;
}

export interface ShedGroupUpdateResult {
  shadedCount: number;
  selectableMeshes: THREE.Object3D[];
}

const PANEL_BASE_COLOR = 0xcbd5f5;
const ROOF_COLOR = 0x94a3b8;

export const createShedGroup = (): ShedGroupNodes => {
  const group = new THREE.Group();
  group.name = 'ShedGroup';

  const wireframeLayer = new THREE.Group();
  wireframeLayer.name = 'WireframeLayer';
  const panelsLayer = new THREE.Group();
  panelsLayer.name = 'Panels';
  const roofLayer = new THREE.Group();
  roofLayer.name = 'Roof';
  const openingsLayer = new THREE.Group();
  openingsLayer.name = 'Openings';

  group.add(wireframeLayer, panelsLayer, roofLayer, openingsLayer);

  return { group, wireframeLayer, panelsLayer, roofLayer, openingsLayer };
};

const createPanelMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: PANEL_BASE_COLOR,
    metalness: 0.1,
    roughness: 0.6,
  });

const createRoofMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: ROOF_COLOR,
    metalness: 0.1,
    roughness: 0.5,
  });

export const updateShedGroup = (
  nodes: ShedGroupNodes,
  dimensions: ShedDimensions,
  panels: PanelState[],
  openings: OpeningState[],
  shadedVisible: boolean,
  wireframeVisible: boolean
): ShedGroupUpdateResult => {
  nodes.wireframeLayer.clear();
  nodes.panelsLayer.clear();
  nodes.roofLayer.clear();
  nodes.openingsLayer.clear();

  let shadedCount = 0;
  const selectableMeshes: THREE.Object3D[] = [];

  const wireframeOpacity = wireframeVisible ? 0.9 : 0.35;
  panels.forEach((panel) => {
    const wireframe = createWireframeForPanel(panel, dimensions, wireframeOpacity);
    nodes.wireframeLayer.add(wireframe);

    const isVisible = shadedVisible && panel.visibility === 'visible';
    if (panel.type === 'roof') {
      const roofMesh = createPanelMesh(panel, dimensions, createRoofMaterial());
      roofMesh.visible = isVisible;
      if (isVisible) {
        shadedCount += 1;
        selectableMeshes.push(roofMesh);
      }
      nodes.roofLayer.add(roofMesh);
    } else {
      const panelMesh = createPanelMesh(panel, dimensions, createPanelMaterial());
      panelMesh.visible = isVisible;
      if (isVisible) {
        shadedCount += 1;
        selectableMeshes.push(panelMesh);
      }
      nodes.panelsLayer.add(panelMesh);
    }
  });

  nodes.wireframeLayer.visible = true;

  openings.forEach((opening) => {
    const panel = panels.find((item) => item.id === opening.panelId);
    if (!panel || panel.visibility === 'removed') {
      return;
    }
    const openingMesh = createOpeningMesh(opening, panel, dimensions);
    openingMesh.visible = shadedVisible && panel.visibility === 'visible';
    if (openingMesh.visible) {
      shadedCount += 1;
      selectableMeshes.push(openingMesh);
    }
    nodes.openingsLayer.add(openingMesh);
  });

  return { shadedCount, selectableMeshes };
};
