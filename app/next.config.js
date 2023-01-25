/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: "http://localhost:3680/api/:slug*"
      }
    ]
  }
}

module.exports = nextConfig
