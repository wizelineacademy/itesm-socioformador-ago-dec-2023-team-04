import type {Config} from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-source-sans)']
            },
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
                }
            }
        },
    },
    plugins: [],
}
export default config
