'use client';

import { useEffect, useRef } from 'react';

type UseAutoRevalidateOptions<T> = {
	interval?: number;
	check: () => Promise<T>;
	onChange: (next: T, prev: T | null) => void;
	isEqual?: (a: T, b: T) => boolean;
};

export function useAutoRevalidate<T>({
	interval = 10_000,
	check,
	onChange,
	isEqual,
}: UseAutoRevalidateOptions<T>) {
	const previousRef = useRef<T | null>(null);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			try {
				const next = await check();

				if (cancelled) return;

				const prev = previousRef.current;

				const equal = isEqual
					? prev !== null && isEqual(prev, next)
					: prev === next;

				if (!equal) {
					previousRef.current = next;
					onChange(next, prev);
				}
			} catch (err) {
				console.error('useAutoRevalidate error:', err);
			}
		};

		run(); // initial check

		const timer = setInterval(run, interval);

		return () => {
			cancelled = true;
			clearInterval(timer);
		};
	}, [check, onChange, interval, isEqual]);
}
