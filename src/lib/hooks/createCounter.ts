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
export function createCounter(updater: (v: number) => void, initialValue = 0) {
	let value = initialValue;

	return {
		get value() {
			return value;
		},
		set value(newValue) {
			value = newValue;
			updater(value);
		},
		increment() {
			value++;
			updater(value);
		},
		decrement() {
			value--;
			updater(value);
		},
		reset() {
			value = initialValue;
			updater(value);
		}
	};
}
