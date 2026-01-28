// src/canvas/interactions.ts
import * as THREE from "three";

type RegisterArgs = {
  element: HTMLElement | null | undefined; // <-- the element we attach listeners to
  shedGroup: THREE.Object3D;
  camera: THREE.Camera;
  onSelect?: (hit: THREE.Object3D | null) => void;
};

export function registerInteractions({ element, shedGroup, camera, onSelect }: RegisterArgs) {
  if (!element) {
    // Don’t crash the app; just no interactions until element exists
    console.warn("[registerInteractions] No element provided; skipping interactions setup.");
    return () => {};
  }

  let dragging = false;
  let lastX = 0;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onMouseDown(e: MouseEvent) {
    dragging = true;
    lastX = e.clientX;
  }

  function onMouseUp() {
    dragging = false;
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    shedGroup.rotation.y += dx * 0.005;
    lastX = e.clientX;
  }

  function onClick(e: MouseEvent) {
    const rect = element.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(shedGroup, true);
    onSelect?.(hits.length ? hits[0].object : null);
  }

  element.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
  element.addEventListener("click", onClick);

  return () => {
    element.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
    element.removeEventListener("click", onClick);
  };
}
