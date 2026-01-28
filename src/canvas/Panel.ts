import * as THREE from 'three';
import type { PanelState, ShedDimensions } from '../store/shedStore';

const PANEL_THICKNESS = 0.1;

export const createPanelMesh = (
  panel: PanelState,
  dimensions: ShedDimensions,
  material: THREE.MeshStandardMaterial
): THREE.Mesh => {
  const { width, depth, height, roofHeight } = dimensions;
  let geometry: THREE.BoxGeometry;
  const position = new THREE.Vector3();

  switch (panel.type) {
    case 'front':
      geometry = new THREE.BoxGeometry(width, height, PANEL_THICKNESS);
      position.set(0, height / 2, depth / 2);
      break;
    case 'back':
      geometry = new THREE.BoxGeometry(width, height, PANEL_THICKNESS);
      position.set(0, height / 2, -depth / 2);
      break;
    case 'left':
      geometry = new THREE.BoxGeometry(PANEL_THICKNESS, height, depth);
      position.set(-width / 2, height / 2, 0);
      break;
    case 'right':
      geometry = new THREE.BoxGeometry(PANEL_THICKNESS, height, depth);
      position.set(width / 2, height / 2, 0);
      break;
    case 'roof':
      geometry = new THREE.BoxGeometry(width, roofHeight, depth);
      position.set(0, height + roofHeight / 2, 0);
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  const mesh = new THREE.Mesh(geometry, material.clone());
  mesh.position.copy(position);
  mesh.castShadow = false;
  mesh.userData = {
    type: 'panel',
    panelId: panel.id,
    baseColor: mesh.material.color.getHex(),
  };
  mesh.name = `Panel-${panel.type}`;
  return mesh;
};

export const PANEL_THICKNESS_VALUE = PANEL_THICKNESS;
