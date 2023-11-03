import type React from 'react';

declare module 'react' {
	function forwardRef<T, P = Record<string, unknown>>(
		render: (props: P, ref: Ref<T>) => ReactNode | undefined
	): (props: P & RefAttributes<T>) => ReactNode | undefined;
}
