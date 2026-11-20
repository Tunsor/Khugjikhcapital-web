
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
    agentUpgrade: "security",
  },

  cacheComponents: true,
  partialPrefetching: true,

  // Монголбанкны мэдээний preview зураг
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "www.mongolbank.mn",
      pathname: "/file/**",
    },
    {
      protocol: "https",
      hostname: "www.mongolbank.mn",
      pathname: "/mn/images/**",
    },
  ],
},

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
