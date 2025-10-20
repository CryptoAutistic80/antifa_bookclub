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

  useEffect(() => {
    if (!containerRef.current) return;

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
    containerRef.current.appendChild(renderer.domElement);
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
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      const container = containerRef.current;
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
};

export default Background3D;

