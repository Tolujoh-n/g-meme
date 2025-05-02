/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "example.com"], // Add any other domains here
  },
};

module.exports = nextConfig;
