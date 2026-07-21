import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // TS 7 has no JS compiler API — Next must shell out to local tsc
  experimental: {
    useTypeScriptCli: true,
  },
};

export default nextConfig;
