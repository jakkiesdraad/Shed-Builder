// src/canvas/Camera.ts
import * as THREE from "three";

type CameraRig = {
  camera: THREE.PerspectiveCamera;
  target: THREE.Vector3;
  frameShed: (object: THREE.Object3D, padding?: number) => void;
};

export function createCameraRig(): CameraRig {
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  const target = new THREE.Vector3(0, 1.5, 0);

  camera.position.set(8, 6, 8);
  camera.lookAt(target);

  // Frames the shed by moving the camera back far enough to fit the object's bounds.
  function frameShed(object: THREE.Object3D, padding = 1.2) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());

    // Update target to shed centre (slightly above centre feels nicer)
    target.copy(centre);
    target.y += size.y * 0.15;

    // Compute a distance that fits the largest dimension in view
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera.fov * Math.PI) / 180;
    let distance = (maxDim / (2 * Math.tan(fov / 2))) * padding;

    if (!Number.isFinite(distance) || distance <= 0) distance = 10;

    // Keep current viewing direction, just adjust distance
    const dir = new THREE.Vector3().subVectors(camera.position, target).normalize();
    if (dir.lengthSq() === 0) dir.set(1, 0.6, 1).normalize();

    camera.position.copy(target).add(dir.multiplyScalar(distance));
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }

  return { camera, target, frameShed };
}
