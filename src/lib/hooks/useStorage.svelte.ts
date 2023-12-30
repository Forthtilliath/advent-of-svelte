import { z, type ZodType } from 'zod';

type Options<Output = unknown> = {
	storage?: 'local' | 'session';
	schema?: ZodType<Output>;
};

export function useStorage<T = unknown>(key: string, initialValue: T, options?: Options<T>) {
	let value = $state(initialValue);

	if (globalThis.window) {
		const storage = options?.storage === 'session' ? sessionStorage : localStorage;
		const schema = options?.schema ?? z.custom<T>();

		const storedValue = storage.getItem(key);
		const parsedValue = storedValue ? JSON.parse(storedValue) : null;
		const safeParsedValue = schema.safeParse(parsedValue);

		value = safeParsedValue.success ? safeParsedValue.data : initialValue;

		if (!safeParsedValue.success) {
			storage.setItem(key, JSON.stringify(initialValue));
		}
	}

	return {
		get value() {
			return value;
		},
		set value(newValue) {
			value = newValue;
			console.log({value, newValue})
			if (globalThis.window) {
				const storage = options?.storage === 'session' ? sessionStorage : localStorage;
				storage.setItem(key, JSON.stringify(newValue));
			}
		}
	};
}
