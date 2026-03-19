/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        optimizePackageImports: ['lucide-react', '@repo/ui']
    }
};

export default nextConfig;
