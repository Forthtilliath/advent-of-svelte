type Options = {
	initialValue: number;
	max: number;
	min: number;
	updater: (v: number) => void;
};

/**
 * Creates a counter
 *
 * @example
 * let counter = createCounter();
 *
 * console.log(counter()); // 1
 * counter.increment();
 * console.log(counter()); // 2
 * counter.decrement();
 * console.log(counter()); // 1
 * counter.reset();
 * console.log(counter()); // 0
 */
export function createCounter(options: Partial<Options> = {}) {
	const { initialValue, max, min, updater }: Options = {
		initialValue: 0,
		max: Infinity,
		min: -Infinity,
		updater: (v) => v,
		...options
	};
	let value = $state(initialValue);

	return {
		get value() {
			return value;
		},
		set value(newValue) {
			value = newValue;
			updater(value);
		},
		increment() {
			if (value >= max) {
				return;
			}
			value++;
			updater(value);
		},
		decrement() {
			if (value <= min) {
				return;
			}
			value--;
			updater(value);
		},
		reset() {
			value = 0;
			updater(value);
		}
	};
}
