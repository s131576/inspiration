/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['fakestoreapi.com'], // Add the domain(s) from which you are fetching images
  },
};

export default nextConfig;

