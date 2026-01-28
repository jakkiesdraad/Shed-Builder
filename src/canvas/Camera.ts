import * as THREE from 'three';
import type { OpeningState, PanelState, ShedDimensions } from '../store/shedStore';
import { PANEL_THICKNESS_VALUE } from './Panel';

export const createOpeningMesh = (
  opening: OpeningState,
  panel: PanelState,
  dimensions: ShedDimensions
): THREE.Mesh => {
  const material = new THREE.MeshStandardMaterial({
    color: opening.type === 'door' ? 0x94a3b8 : 0x60a5fa,
    metalness: 0.1,
    roughness: 0.4,
  });
  const size = opening.type === 'door' ? { w: 0.8, h: 1.6 } : { w: 0.8, h: 0.6 };
  const depth = PANEL_THICKNESS_VALUE * 1.5;
  const geometry = new THREE.BoxGeometry(size.w, size.h, depth);
  const mesh = new THREE.Mesh(geometry, material);

  const y = opening.type === 'door' ? size.h / 2 : dimensions.height * 0.6;

  switch (panel.type) {
    case 'front':
      mesh.position.set(0, y, dimensions.depth / 2 + depth / 2);
      break;
    case 'back':
      mesh.position.set(0, y, -dimensions.depth / 2 - depth / 2);
      break;
    case 'left':
      mesh.position.set(-dimensions.width / 2 - depth / 2, y, 0);
      break;
    case 'right':
      mesh.position.set(dimensions.width / 2 + depth / 2, y, 0);
      break;
    default:
      mesh.position.set(0, y, 0);
  }

  mesh.userData = {
    type: 'opening',
    openingId: opening.id,
    baseColor: mesh.material.color.getHex(),
  };
  mesh.name = `Opening-${opening.type}`;
  return mesh;
};
