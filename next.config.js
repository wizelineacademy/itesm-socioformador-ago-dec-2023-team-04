const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	poweredByHeader: false,
	headers: () => [
		{
			source: '/',
			headers: [
				{
					key: 'X-Content-Type-Options',
					value: 'nosniff'
				}
			]
		}
	],
	webpack: (config) => {
		// append the CopyPlugin to copy the file to your public dir
		config.plugins.push(
			new CopyPlugin({
				patterns: [
					{ from: "node_modules/@stock17944/human/models", to: "../public/models/" },
				],
			}),
		)

		// Important: return the modified config
		return config
	}
};

module.exports = nextConfig;
