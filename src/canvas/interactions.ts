import * as THREE from 'three';

export interface CameraRig {
  camera: THREE.PerspectiveCamera;
  target: THREE.Vector3;
  updateLookAt: () => void;
  frameShed: (object: THREE.Object3D) => void;
  resize: (width: number, height: number) => void;
}

export const createCameraRig = (width: number, height: number): CameraRig => {
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  const target = new THREE.Vector3(0, 1, 0);

  camera.position.set(5, 3.5, 6);
  camera.lookAt(target);

  const updateLookAt = () => {
    camera.lookAt(target);
  };

  const frameShed = (object: THREE.Object3D) => {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxSize = Math.max(size.x, size.y, size.z, 1);
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const distance = (maxSize / (2 * Math.tan(fov / 2))) * 1.4;

    target.copy(center);
    camera.position.set(center.x + distance, center.y + distance * 0.6, center.z + distance);
    updateLookAt();
  };

  const resize = (newWidth: number, newHeight: number) => {
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
  };

  return { camera, target, updateLookAt, frameShed, resize };
};
