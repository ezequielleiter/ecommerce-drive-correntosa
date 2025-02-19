/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false;
			config.resolve.fallback.tls = false;
			config.resolve.fallback.net = false;
			config.resolve.fallback.child_process = false;
		}

		return config;
	},
	images: {
		loader: 'default',
		domains: [
			'https://lh3.googleusercontent.com',
			'lh3.googleusercontent.com',
			'https://lh3.googleusercontent.com/',
			'https://drive.google.com/',
			'drive.google.com',
			'https://scontent.cdninstagram.com',
			"scontent.cdninstagram.com"
		]
	},
	future: {
		webpack5: true
	},
	fallback: {
		fs: false,
		tls: false,
		net: false,
		child_process: false
	}
};

module.exports = nextConfig;
