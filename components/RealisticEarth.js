"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const RealisticEarth = ({cameraPosition, locationStatus}) => {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableRotate = true;
    controls.autoRotate = false;

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/8k_earth_daymap.jpg");
    const nightTexture = textureLoader.load("/8k_earth_nightmap.jpg");
    const cloudTexture = textureLoader.load("/8k_earth_clouds.jpg");
    const bumpMap = textureLoader.load("/8k_earth_normal_map.tif");
    const specularMap = textureLoader.load("/8k_earth_specular_map.tif");
    const starsTexture = textureLoader.load("/8k_stars.jpg");

    const spaceGeometry = new THREE.SphereGeometry(50, 64, 64);
    const spaceMaterial = new THREE.MeshBasicMaterial({
      map: starsTexture,
      side: THREE.BackSide,
    });
    const spaceBackground = new THREE.Mesh(spaceGeometry, spaceMaterial);
    scene.add(spaceBackground);

    const globeGeometry = new THREE.SphereGeometry(3, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.1,
      emissive: 0x002244,
      specularMap: specularMap,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    const cloudGeometry = new THREE.SphereGeometry(3.05, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.1,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    const sunlight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunlight.position.set(5, 3, 5);
    scene.add(sunlight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const nightMaterial = new THREE.MeshStandardMaterial({
      map: nightTexture,
      transparent: true,
      opacity: 0.7,
    });
    const nightLayer = new THREE.Mesh(globeGeometry, nightMaterial);
    scene.add(nightLayer);

    const animate = () => {
      requestAnimationFrame(animate);
      clouds.rotation.y += 0.0002;
      nightLayer.rotation.y += 0.001;
      spaceBackground.rotation.y += 0.0001;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z
      );
    }
  }, [cameraPosition]);
  return (
    <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
  );
};

export default RealisticEarth;
