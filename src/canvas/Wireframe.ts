import * as THREE from 'three';
import type { PanelState, ShedDimensions } from '../store/shedStore';
import { createPanelMesh } from './Panel';

export const createWireframeForPanel = (
  panel: PanelState,
  dimensions: ShedDimensions,
  opacity: number
): THREE.LineSegments => {
  const tempMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const panelMesh = createPanelMesh(panel, dimensions, tempMaterial);
  const edges = new THREE.EdgesGeometry(panelMesh.geometry);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity,
  });
  const lines = new THREE.LineSegments(edges, lineMaterial);
  lines.position.copy(panelMesh.position);
  lines.rotation.copy(panelMesh.rotation);
  lines.name = `Wireframe-${panel.type}`;
  return lines;
};
