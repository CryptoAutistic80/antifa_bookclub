"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Background3D = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef([]);
  const booksRef = useRef([]);
  const orbitsRef = useRef([]);
  const lightningRef = useRef({
    group: null,
    strikes: [],
    lastStrikeAt: 0,
    nextStrikeDelay: 0,
    flashLight: null,
    logoRadius: 1.1, // fallback exclusion radius around the centered logo (world units)
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particle system (knowledge streams)
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x4a9eff,
      size: 0.08,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = { particles, velocities, positions };

    // Create orbiting book shapes (symbolic of knowledge)
    const createBook = (x, y, z, color) => {
      const group = new THREE.Group();
      
      // Book cover
      const bookGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05);
      const bookMaterial = new THREE.MeshPhongMaterial({ color });
      const book = new THREE.Mesh(bookGeometry, bookMaterial);
      group.add(book);

      // Pages glow
      const glowGeometry = new THREE.BoxGeometry(0.35, 0.45, 0.1);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      group.add(glow);

      group.position.set(x, y, z);
      scene.add(group);
      return group;
    };

    // Create multiple orbiting books
    const bookColors = [0xff4444, 0x4a9eff, 0xffffff, 0x888888];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const distance = 3;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const book = createBook(x, 0, z, bookColors[i]);
      booksRef.current.push({
        mesh: book,
        angle,
        distance,
        speed: 0.003 + Math.random() * 0.002,
      });
    }

    // Create geometric orbit rings
    const createOrbit = (radius, color, rotationAxis = 'y') => {
      const geometry = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        points.push(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        );
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
      
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.3,
        linewidth: 1,
      });
      
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      
      return {
        mesh: line,
        rotationAxis,
        speed: 0.0005 + Math.random() * 0.0003,
      };
    };

    // Create multiple orbits
    orbitsRef.current = [
      createOrbit(2, 0x4a9eff, 'y'),
      createOrbit(3.5, 0xff4444, 'x'),
      createOrbit(4.5, 0xffffff, 'z'),
    ];

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4a9eff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff4444, 0.8);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Lightning setup
    const lightningGroup = new THREE.Group();
    scene.add(lightningGroup);
    const flashLight = new THREE.PointLight(0x99ccff, 0, 20, 2.0);
    flashLight.position.set(0, 0, 0);
    scene.add(flashLight);
    lightningRef.current.group = lightningGroup;
    lightningRef.current.flashLight = flashLight;
    lightningRef.current.lastStrikeAt = performance.now();
    // Slightly slower default cadence
    lightningRef.current.nextStrikeDelay = 400 + Math.random() * 1000; // 0.4-1.4s

    // Compute an exclusion sphere radius from the on-screen logo size so strikes stop at its edge
    const updateLogoRadius = () => {
      try {
        const el = document.querySelector('.logo-wrapper');
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const heightPx = rect.height || 0;
        const widthPx = rect.width || 0;
        if (!heightPx || !widthPx) return;

        // Convert pixels at z=0 plane to world units based on camera
        const worldHeight = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
        const worldWidth = worldHeight * camera.aspect;
        const unitsPerPixelY = worldHeight / window.innerHeight;
        const unitsPerPixelX = worldWidth / window.innerWidth;

        const halfH = (heightPx / 2) * unitsPerPixelY;
        const halfW = (widthPx / 2) * unitsPerPixelX;
        // Sphere that fully contains the rectangle (half-diagonal)
        const radius = Math.sqrt(halfW * halfW + halfH * halfH);
        lightningRef.current.logoRadius = radius * 1.04; // small margin
      } catch {
        // ignore errors when computing logo radius
      }
    };
    updateLogoRadius();

    // Utility to create a jagged lightning line between start and end
    const createLightningLine = (start, end, segments = 28, sway = 0.6, jaggedness = 1.5) => {
      const points = [];
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      const normal = direction.clone().normalize();

      // Create a perpendicular basis for random offsets
      const arbitrary = Math.abs(normal.y) < 0.99 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const perp1 = new THREE.Vector3().crossVectors(normal, arbitrary).normalize();
      const perp2 = new THREE.Vector3().crossVectors(normal, perp1).normalize();

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const basePoint = new THREE.Vector3().copy(start).addScaledVector(normal, t * length);

        // Offset decreases towards the target to sharpen near impact
        const falloff = Math.pow(1.0 - t, 2);
        const r1 = (Math.random() - 0.5) * sway * falloff * jaggedness;
        const r2 = (Math.random() - 0.5) * sway * falloff * jaggedness;
        basePoint.addScaledVector(perp1, r1).addScaledVector(perp2, r2);
        points.push(basePoint.x, basePoint.y, basePoint.z);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
      const material = new THREE.LineBasicMaterial({
        color: 0x4a9eff, // match particle color
        transparent: true,
        opacity: 1.0,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        linewidth: 3.2, // tiny bit thicker
      });
      const line = new THREE.Line(geometry, material);
      line.renderOrder = 9999;
      return line;
    };

    // Intersect the segment start->end with a sphere of radius R at origin; return point on surface
    const segmentSphereClamp = (start, end, R) => {
      const d = new THREE.Vector3().subVectors(end, start);
      const a = d.dot(d);
      const b = 2 * start.dot(d);
      const c = start.dot(start) - R * R;
      const disc = b * b - 4 * a * c;
      if (disc < 0 || a === 0) return end.clone();
      const tEnter = (-b - Math.sqrt(disc)) / (2 * a);
      if (tEnter >= 0 && tEnter <= 1) {
        return new THREE.Vector3().copy(start).addScaledVector(d, tEnter);
      }
      return end.clone();
    };

    const spawnLightningStrike = () => {
      // Keep aim at center with tiny jitter for variation
      const target = new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
      );
      const radius = 6 + Math.random() * 6; // 6-12
      // Spawn from any direction for full 3D coverage
      const phi = Math.random() * Math.PI; // 0..pi (full sphere)
      const theta = Math.random() * Math.PI * 2;
      const start = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi) * radius,
        Math.cos(phi) * radius,
        Math.sin(theta) * Math.sin(phi) * radius,
      );

      // Clamp main strike to stop at logo sphere edge
      const clampedEnd = segmentSphereClamp(start, target, lightningRef.current.logoRadius || 1.1);
      const main = createLightningLine(start, clampedEnd);
      lightningGroup.add(main);

      // Optional small branch near the end
      let branch = null;
      if (Math.random() < 0.6) {
        // start branching along the main segment but remain outside the exclusion sphere
        const tAlong = 0.6 + Math.random() * 0.25;
        const branchStart = new THREE.Vector3().lerpVectors(start, clampedEnd, tAlong);
        // bias branch direction away from origin to avoid entering the logo region
        const away = branchStart.clone().normalize();
        const rand = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.5, Math.random() - 0.5).normalize();
        const branchDir = new THREE.Vector3().addVectors(away.multiplyScalar(0.7), rand.multiplyScalar(0.3)).normalize();
        const branchEndRaw = new THREE.Vector3().copy(branchStart).addScaledVector(branchDir, 1.0 + Math.random() * 1.2);
        // Ensure branch does not cross into the logo sphere
        const branchEnd = segmentSphereClamp(branchStart, branchEndRaw, lightningRef.current.logoRadius || 1.1);
        branch = createLightningLine(branchStart, branchEnd, 12, 0.4, 1.2);
        lightningGroup.add(branch);
      }

      // Impact ring at termination point (glow)
      const impactNormal = clampedEnd.length() > 1e-6 ? clampedEnd.clone().normalize() : new THREE.Vector3(0, 0, 1);
      const R = lightningRef.current.logoRadius || 1.1;
      const ringInner = Math.max(0.02, R * 0.06);
      const ringOuter = Math.max(ringInner + 0.01, R * 0.10);
      const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x66aaff,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(clampedEnd);
      // Orient ring so its normal points away from the logo center
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), impactNormal);
      ring.renderOrder = 10000;
      ring.userData.isImpactRing = true;
      // subtle initial pop
      ring.scale.setScalar(0.9 + Math.random() * 0.2);
      lightningGroup.add(ring);

      // Kick flash light
      flashLight.intensity = Math.min(10, flashLight.intensity + 5.5);
      flashLight.distance = 14;

      lightningRef.current.strikes.push({
        meshes: [main, ...(branch ? [branch] : []), ring],
        bornAt: performance.now(),
        // Slightly longer life for a slower feel
        life: 260 + Math.random() * 200, // ms
      });

      // Schedule next strike
      lightningRef.current.lastStrikeAt = performance.now();
      // Short delays between bursts, slightly slower cadence
      lightningRef.current.nextStrikeDelay = 320 + Math.random() * 720; // 0.32-1.04s
    };

    const spawnLightningBurst = () => {
      // Vary burst size for intensity; occasional big bursts
      const roll = Math.random();
      const count = roll < 0.12 ? 5 + Math.floor(Math.random() * 4) : 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        // Slightly increased stagger for a slower perceived propagation
        setTimeout(spawnLightningStrike, i * 20);
      }
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update particles
      const posAttr = particleGeometry.getAttribute('position');
      const velAttr = particleGeometry.getAttribute('velocity');
      const pos = posAttr.array;
      const vel = velAttr.array;

      for (let i = 0; i < particleCount * 3; i += 3) {
        pos[i] += vel[i];
        pos[i + 1] += vel[i + 1];
        pos[i + 2] += vel[i + 2];

        // Bounce particles
        if (Math.abs(pos[i]) > 10) vel[i] *= -1;
        if (Math.abs(pos[i + 1]) > 10) vel[i + 1] *= -1;
        if (Math.abs(pos[i + 2]) > 10) vel[i + 2] *= -1;
      }
      posAttr.needsUpdate = true;

      // Rotate orbits
      orbitsRef.current.forEach((orbit) => {
        if (orbit.rotationAxis === 'y') {
          orbit.mesh.rotation.y += orbit.speed;
        } else if (orbit.rotationAxis === 'x') {
          orbit.mesh.rotation.x += orbit.speed;
        } else {
          orbit.mesh.rotation.z += orbit.speed;
        }
      });

      // Animate books in orbit
      booksRef.current.forEach((book) => {
        book.angle += book.speed;
        book.mesh.position.x = Math.cos(book.angle) * book.distance;
        book.mesh.position.z = Math.sin(book.angle) * book.distance;
        book.mesh.rotation.x += 0.005;
        book.mesh.rotation.y += 0.008;
      });

      // Gentle camera movement
      camera.position.x = Math.sin(Date.now() * 0.0001) * 0.5;
      camera.position.y = Math.cos(Date.now() * 0.00008) * 0.3;
      camera.lookAt(0, 0, 0);

      // Lightning lifecycle and scheduling
      const now = performance.now();
      // Schedule new strike
      if (now - lightningRef.current.lastStrikeAt > lightningRef.current.nextStrikeDelay) {
        spawnLightningBurst();
      }
      // Update existing strikes (fade + cleanup)
      const active = [];
      for (const strike of lightningRef.current.strikes) {
        const age = now - strike.bornAt;
        const t = age / strike.life;
        const fade = Math.max(0, 1.0 - t);
        for (const m of strike.meshes) {
          if (m.material && m.material.opacity !== undefined) {
            m.material.opacity = fade;
          }
        }
        // Animate impact ring scale for a brief luminous pulse
        for (const m of strike.meshes) {
          if (m.userData && m.userData.isImpactRing) {
            const pulse = 1.0 + 0.25 * Math.sin(Math.min(1, t) * Math.PI);
            m.scale.setScalar(pulse);
          }
        }
        if (age < strike.life) {
          active.push(strike);
        } else {
          // remove from scene and dispose
          for (const m of strike.meshes) {
            lightningRef.current.group.remove(m);
            if (m.geometry) m.geometry.dispose();
            if (m.material) m.material.dispose();
          }
        }
      }
      // Keep memory/perf bounded at high frequency
      lightningRef.current.strikes = active.slice(-120);
      // Flash light decay
      if (lightningRef.current.flashLight.intensity > 0) {
        lightningRef.current.flashLight.intensity *= 0.85;
        if (lightningRef.current.flashLight.intensity < 0.02) {
          lightningRef.current.flashLight.intensity = 0;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      // Recompute exclusion radius for the logo on resize
      try {
        const worldHeight = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
        const worldWidth = worldHeight * camera.aspect;
        const el = document.querySelector('.logo-wrapper');
        if (el) {
          const rect = el.getBoundingClientRect();
          const unitsPerPixelY = worldHeight / height;
          const unitsPerPixelX = worldWidth / width;
          const halfH = (rect.height / 2) * unitsPerPixelY;
          const halfW = (rect.width / 2) * unitsPerPixelX;
          const radius = Math.sqrt(halfW * halfW + halfH * halfH);
          lightningRef.current.logoRadius = radius * 1.04;
        }
      } catch {
        // ignore errors when computing logo radius
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
};

export default Background3D;
