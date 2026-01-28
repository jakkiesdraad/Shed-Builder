// src/canvas/Opening.ts
import * as THREE from "three";

export function createOpeningMesh() {
  const geometry = new THREE.BoxGeometry(1, 1, 0.1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x444444,
    opacity: 0.6,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
