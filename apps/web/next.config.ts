import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["beautiful-skill-tree", "tippy.js"],
};

export default nextConfig;
