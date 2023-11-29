import {useEffect, useRef, useState} from 'react';

export default function useStaticContent() {
	const ref = useRef<HTMLDivElement>();
	const [isHydrating, setIsHydrating] = useState(typeof window === 'undefined');

	useEffect(() => {
		// Check if the innerHTML is empty as client side navigation
		// need to isHydrating the component without server-side backup
		if (ref.current && ref.current.innerHTML === '') {
			setIsHydrating(true);
		}
	}, []);

	return [isHydrating && ref.current === undefined, ref] as const;
}
