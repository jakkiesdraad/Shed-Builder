import * as THREE from 'three';

export const createEnvironment = (): THREE.Group => {
  const environment = new THREE.Group();
  environment.name = 'Environment';

  const groundGeometry = new THREE.PlaneGeometry(50, 50);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b7d3a,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = false;
  ground.name = 'Ground';

  const skyGeometry = new THREE.SphereGeometry(30, 32, 32);
  const skyMaterial = new THREE.MeshBasicMaterial({
    color: 0x7bb7ff,
    side: THREE.BackSide,
  });
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  sky.name = 'Sky';

  environment.add(ground, sky);
  return environment;
};
