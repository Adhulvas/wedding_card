import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Transpile Three.js and React Three Fiber modules to support ES imports */
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
