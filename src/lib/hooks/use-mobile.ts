'use client';

import { useEffect, useState } from 'react';

const MOBILE_DEVICE_BREAKPOINT = 750;

const useMobile = (): boolean => {
	const getInitialSize = () =>
		typeof window !== 'undefined'
			? window.innerWidth < MOBILE_DEVICE_BREAKPOINT
			: false;

	const [isMobile, setIsMobile] = useState(getInitialSize);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < MOBILE_DEVICE_BREAKPOINT);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return isMobile;
};

export { useMobile };
