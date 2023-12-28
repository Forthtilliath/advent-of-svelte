import { z, type ZodType } from 'zod';

type Options<Output = unknown> = {
	storage?: 'local' | 'session';
	schema?: ZodType<Output>;
};

export function useStorage<T = unknown>(key: string, initialValue: T, options?: Options<T>) {
	if (!globalThis.window) return initialValue;

	const storage = options?.storage === 'session' ? sessionStorage : localStorage;
	const schema = options?.schema ?? z.custom<T>();

	const storedValue = storage.getItem(key);
	const parsedValue = storedValue ? JSON.parse(storedValue) : null;
	const safeParsedValue = schema.safeParse(parsedValue);

	if (safeParsedValue.success) {
		return safeParsedValue.data;
	}

	storage.setItem(key, JSON.stringify(initialValue));
	return initialValue;
}
