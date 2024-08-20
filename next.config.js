/** @type {import('next').NextConfig} */
const webpack = require("webpack");
module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  webpack: (config, options) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: { esmExternals: true },
};
