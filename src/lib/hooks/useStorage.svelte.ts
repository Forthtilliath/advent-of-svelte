import { z } from 'zod';

type Options<Output = unknown> = {
	storage?: 'local' | 'session';
	schema?: z.ZodType<Output>;
};

export function useStorage<T = unknown>(key: string, initialValue: T, options?: Options<T>) {
	if (!globalThis.window) {
		return createAccessor(initialValue);
	}

	const storage = options?.storage === 'session' ? sessionStorage : localStorage;
	const schema = options?.schema ?? z.custom<T>();

	const storedValue = storage.getItem(key);
	const parsedValue = storedValue ? JSON.parse(storedValue) : null;
	const safeParsedValue = schema.safeParse(parsedValue);

	if (!safeParsedValue.success) {
		storage.setItem(key, JSON.stringify(initialValue));
		return createAccessor(initialValue);
	}

	return createAccessor(safeParsedValue.data);

	function createAccessor(initialValue: T) {
		let value = $state(initialValue);
		return {
			get value() {
				return value;
			},
			set value(newValue) {
				value = newValue;
				storage.setItem(key, JSON.stringify(newValue));
			}
		};
	}
}
