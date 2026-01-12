import { addAbortListener } from 'events';
import { useEffect, useState } from 'react';

type sizeProps = {
	mobileSize: number;
	initialSize: boolean;
};

const MOBILE_DEVICE_BREAKE_POINT = 750;

const useMobile = (): boolean => {
	const getInitialSize = (): boolean => {
		return typeof window.innerWidth !== 'undefined'
			? window.innerWidth < MOBILE_DEVICE_BREAKE_POINT
			: false;
	};

	const [isMobile, setIsMobile] = useState<boolean>(getInitialSize);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < MOBILE_DEVICE_BREAKE_POINT);
		};

		handleResize();

		window.addEventListener('resize', handleResize);

		return window.removeEventListener('resize', handleResize);
	}, []);

	return isMobile;
};

export { useMobile };
