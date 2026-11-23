import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DX_EMBLEM_POINTS } from '../data/emblemPath';

const _sizeVec = new THREE.Vector3();
const _centerVec = new THREE.Vector3();
const _box = new THREE.Box3();

function buildEmblemShape(scale: number): THREE.Shape {
  const shape = new THREE.Shape();
  DX_EMBLEM_POINTS.forEach(([px, py], idx) => {
    const x = (px - 50) * scale;
    const y = (50 - py) * scale;
    if (idx === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

interface LogoRig {
  root: THREE.Group;
  outerOrbit: THREE.Group;
  innerOrbit: THREE.Group;
}

function buildCompositeLogoGroup(): LogoRig {
  const group = new THREE.Group();

  const mainShape = buildEmblemShape(0.042);
  const mainGeometry = new THREE.ExtrudeGeometry(mainShape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.055,
    bevelThickness: 0.065,
    curveSegments: 16,
  });
  mainGeometry.center();

  const chromeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#e2f9be'),
    metalness: 0.95,
    roughness: 0.16,
    clearcoat: 0.75,
    clearcoatRoughness: 0.12,
    emissive: new THREE.Color('#2d4a08'),
    emissiveIntensity: 0.22,
    envMapIntensity: 1.6,
  });

  const mainMesh = new THREE.Mesh(mainGeometry, chromeMaterial);
  mainMesh.position.z = 0.03;
  group.add(mainMesh);

  const backingShape = buildEmblemShape(0.0432);
  const backingGeometry = new THREE.ExtrudeGeometry(backingShape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.035,
    curveSegments: 12,
  });
  backingGeometry.center();

  const titaniumMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1d2b12'),
    metalness: 0.84,
    roughness: 0.38,
    emissive: new THREE.Color('#4d7c0f'),
    emissiveIntensity: 0.42,
    envMapIntensity: 1.2,
  });

  const backingMesh = new THREE.Mesh(backingGeometry, titaniumMaterial);
  backingMesh.position.z = -0.14;
  group.add(backingMesh);

  group.updateMatrixWorld(true);
  _box.setFromObject(group);
  _box.getCenter(_centerVec);
  group.children.forEach((child) => {
    child.position.sub(_centerVec);
  });

  const orbitRadius = 2.42;
  const ringTube = 0.022;
  const electronRadius = 0.21;

  const outerOrbit = new THREE.Group();
  const outerRingGeometry = new THREE.TorusGeometry(orbitRadius, ringTube, 16, 96);
  const outerRingMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#a3e635'),
    metalness: 0.88,
    roughness: 0.24,
    emissive: new THREE.Color('#4a7c10'),
    emissiveIntensity: 0.25,
    envMapIntensity: 1.35,
  });
  outerOrbit.add(new THREE.Mesh(outerRingGeometry, outerRingMaterial));

  const outerElectronGeo = new THREE.SphereGeometry(electronRadius, 32, 32);
  const outerElectronMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#c8ff5a'),
    metalness: 0.35,
    roughness: 0.15,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    emissive: new THREE.Color('#a3e635'),
    emissiveIntensity: 0.75,
    envMapIntensity: 1.4,
  });

  const outerElectron = new THREE.Mesh(outerElectronGeo, outerElectronMat);
  outerElectron.position.set(orbitRadius, 0, 0);
  outerOrbit.add(outerElectron);

  outerOrbit.rotation.set(0.55, -0.35, 0);
  group.add(outerOrbit);

  const innerOrbit = new THREE.Group();
  const innerRingGeometry = new THREE.TorusGeometry(orbitRadius + 0.004, ringTube, 16, 96);
  const innerRingMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#a1a1aa'),
    metalness: 0.92,
    roughness: 0.3,
    envMapIntensity: 1.15,
  });
  innerOrbit.add(new THREE.Mesh(innerRingGeometry, innerRingMaterial));

  const innerElectronGeo = new THREE.SphereGeometry(electronRadius, 32, 32);
  const innerElectronMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'),
    metalness: 0.95,
    roughness: 0.1,
    clearcoat: 0.85,
    clearcoatRoughness: 0.08,
    emissive: new THREE.Color('#e4e4e7'),
    emissiveIntensity: 0.28,
    envMapIntensity: 1.6,
  });

  const innerElectron = new THREE.Mesh(innerElectronGeo, innerElectronMat);
  innerElectron.position.set(-(orbitRadius + 0.004), 0, 0);
  innerOrbit.add(innerElectron);

  innerOrbit.rotation.set(-0.55, 0.35, 0);
  group.add(innerOrbit);

  return { root: group, outerOrbit, innerOrbit };
}

export function Logo3DScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const canvas = renderer.domElement;
    canvas.className =
      'block w-full h-full cursor-grab active:cursor-grabbing touch-pan-y';
    container.appendChild(canvas);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const limeBarGeo = new THREE.BoxGeometry(1, 1, 1);
    const limeBarMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#a3e635').multiplyScalar(4.5),
    });

    const envLimePanels: Array<{
      pos: [number, number, number];
      scale: [number, number, number];
    }> = [
      { pos: [-4.5, 2.2, 5.5], scale: [1.2, 6.5, 0.3] },
      { pos: [4.5, -1.2, 5.5], scale: [1.2, 6.5, 0.3] },
      { pos: [0, 5.2, 3.8], scale: [7.5, 1.0, 0.3] },
      { pos: [0, -3.6, 5.8], scale: [6.0, 0.9, 0.3] },
      { pos: [-2.2, 0.4, 7.2], scale: [0.85, 4.2, 0.25] },
      { pos: [2.2, -0.4, 7.2], scale: [0.85, 4.2, 0.25] },
    ];

    envLimePanels.forEach(({ pos, scale }) => {
      const panel = new THREE.Mesh(limeBarGeo, limeBarMat);
      panel.position.set(...pos);
      panel.scale.set(...scale);
      roomEnv.add(panel);
    });

    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    limeBarGeo.dispose();
    limeBarMat.dispose();
    roomEnv.dispose();
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight('#ecfccb', '#111612', 0.8);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#f8fafc', 1.7);
    keyLight.position.set(1.5, 6, 5);
    scene.add(keyLight);

    const frontHeadlight = new THREE.DirectionalLight('#f7fee7', 1.85);
    frontHeadlight.position.set(0, 0.5, 8);
    scene.add(frontHeadlight);

    const limeLeftBar = new THREE.DirectionalLight('#a3e635', 6.2);
    limeLeftBar.position.set(-3.8, 2.0, 6.0);
    scene.add(limeLeftBar);

    const limeRightBar = new THREE.DirectionalLight('#a3e635', 5.6);
    limeRightBar.position.set(3.8, -1.8, 6.0);
    scene.add(limeRightBar);

    const rimBackLight = new THREE.DirectionalLight('#bef264', 2.4);
    rimBackLight.position.set(0, 1, -6);
    scene.add(rimBackLight);

    const { root: modelGroup, outerOrbit, innerOrbit } = buildCompositeLogoGroup();
    scene.add(modelGroup);

    function fitCamera() {
      if (!container) return;
      const cw = Math.max(container.clientWidth, 1);
      const ch = Math.max(container.clientHeight, 1);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);

      _box.setFromObject(modelGroup);
      _box.getSize(_sizeVec);

      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      const isMobile = window.innerWidth < 640;
      const orbitDiameter = 5.25;
      const safeX = Math.max(_sizeVec.x, orbitDiameter) * (isMobile ? 1.25 : 1.45);
      const safeY = Math.max(_sizeVec.y, orbitDiameter) * (isMobile ? 1.28 : 1.48);

      const distY = safeY / 2 / Math.tan(fovRad / 2);
      const distX = safeX / 2 / (Math.tan(fovRad / 2) * camera.aspect);
      const camZ = Math.max(distX, distY, 6.2);

      const yOffset = isMobile ? -0.1 : -0.04;
      camera.position.set(0, yOffset, camZ);
      camera.lookAt(0, yOffset, 0);
    }

    fitCamera();
    renderer.compile(scene, camera);

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let isVisible = true;
    let disposed = false;
    let frameId = 0;

    const onPointerMoveWindow = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        modelGroup.rotation.y += dx * 0.008;
        modelGroup.rotation.x += dy * 0.008;
        targetRotY = modelGroup.rotation.y;
        targetRotX = modelGroup.rotation.x;
        currentRotY = modelGroup.rotation.y;
        currentRotX = modelGroup.rotation.x;
        prevX = e.clientX;
        prevY = e.clientY;
        return;
      }

      if (prefersReducedMotion) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = nx * 0.38;
      targetRotX = -ny * 0.26;
    };

    const onMouseLeave = () => {
      if (isDragging) return;
      targetRotX = 0;
      targetRotY = 0;
    };

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('a, button, input, textarea')) return;
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onDoubleClick = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('a, button, input, textarea')) return;
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevX;
      const dy = e.touches[0].clientY - prevY;
      if (Math.abs(dx) > Math.abs(dy)) {
        modelGroup.rotation.y += dx * 0.009;
        targetRotY = modelGroup.rotation.y;
        currentRotY = modelGroup.rotation.y;
      }
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', onPointerMoveWindow);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('dblclick', onDoubleClick);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', fitCamera);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    const clock = new THREE.Clock();

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (isVisible) {
        if (!isDragging) {
          const gentleFloatY = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.9) * 0.07;
          const gentleIdleRotY = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.45) * 0.14;

          currentRotX = THREE.MathUtils.damp(currentRotX, targetRotX, 4.5, delta);
          currentRotY = THREE.MathUtils.damp(
            currentRotY,
            targetRotY + gentleIdleRotY,
            4.5,
            delta,
          );

          modelGroup.rotation.x = currentRotX;
          modelGroup.rotation.y = currentRotY;
          modelGroup.position.y = gentleFloatY;
        }

        if (!prefersReducedMotion) {
          outerOrbit.rotation.x = 0.55 + elapsed * 0.42;
          outerOrbit.rotation.y = -0.35 + elapsed * 0.56;
          outerOrbit.rotation.z = elapsed * 1.15;

          innerOrbit.rotation.x = -0.55 - elapsed * 0.5;
          innerOrbit.rotation.y = 0.35 - elapsed * 0.66;
          innerOrbit.rotation.z = -elapsed * 1.45;
        }

        renderer.render(scene, camera);
      }

      frameId = window.requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);

      window.removeEventListener('mousemove', onPointerMoveWindow);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', fitCamera);
      observer.disconnect();

      const disposedGeos = new Set<THREE.BufferGeometry>();
      const disposedMats = new Set<THREE.Material>();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (!disposedGeos.has(obj.geometry)) {
            disposedGeos.add(obj.geometry);
            obj.geometry.dispose();
          }
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (!disposedMats.has(m)) {
              disposedMats.add(m);
              m.dispose();
            }
          });
        }
      });

      envTarget.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D DX DEV logo"
      className="relative w-full h-[clamp(220px,34vh,340px)] sm:h-[clamp(260px,38vh,380px)] select-none"
    />
  );
}
