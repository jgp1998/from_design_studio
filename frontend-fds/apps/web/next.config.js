/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ['lucide-react', '@repo/ui']
    }
};

export default nextConfig;
