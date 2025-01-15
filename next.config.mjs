import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/**',
            },
        ],
<<<<<<< HEAD
       
=======
        domains: ['example.com'],
>>>>>>> ede13b35deb730fba2f93ad0e48fded8cf0fa73e
    },
};

export default nextConfig;