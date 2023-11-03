import {defineConfig} from 'cva';
import {twMerge} from 'tailwind-merge';

export {type VariantProps} from 'cva';

export const {cva, compose, cx} = defineConfig({
	hooks: {
		onComplete(className) {
			return twMerge(className);
		},
	},
});
