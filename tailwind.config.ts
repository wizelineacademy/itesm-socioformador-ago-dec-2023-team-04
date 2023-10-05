import type {Config} from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		fontFamily: {
			sans: ['var(--font-source-sans)'],
		},
		extend: {
			colors: {
				wRed: {
					900: '#491315',
					800: '#781C1F',
					700: '#BC2127',
					600: '#E93D44',
					500: '#D45459',
					400: '#EF6C71',
					300: '#F68E92',
					200: '#FDAAAE',
					100: '#FECDCF',
					50: '#FEE6E7',
				},
				wBlue: {
					900: '#111823',
					800: '#172130',
					700: '#203449',
					600: '#324C67',
					500: '#426080',
					400: '#4D5D6D',
					300: '#798CA0',
					200: '#A5B2C0',
					100: '#C3CCD5',
					50: '#D4D9DD',
				}
			},
		},
	},
	plugins: [],
};
export default config;
