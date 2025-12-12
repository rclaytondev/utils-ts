type DuplicateMode = "all-distinct" | "allow-duplicates" | "unlimited-duplicates";
type OrderMode = "tuples" | "sets";

export class Utils {
	static binarySearch(min: number, max: number, increasingFunction: (value: number) => number, mode: "first" | "last" = "first"): number {
		while(max - min > 1) {
			const mid = Math.floor((min + max) / 2);
			const result = increasingFunction(mid);
			if(result < 0) {
				min = mid;
			}
			else if(result > 0) {
				max = mid;
			}
			else {
				if(mode === "first") { max = mid; }
				else if(mode === "last") { min = mid; }
				else { min = max = mid; break; }
			}
		}
		if(max === min) { return min; }
		const minValue = increasingFunction(min);
		const maxValue = increasingFunction(max);
		if(minValue > 0 && maxValue > 0) {
			return min;
		}
		if(minValue < 0 && maxValue < 0) {
			return max;
		}
		if(minValue === 0 && maxValue !== 0) {
			return min;
		}
		if(minValue !== 0 && maxValue === 0) {
			return max;
		}
		return mode === "first" ? min : max;
	}

	private static remainingValidItems<T>(items: T[], index: number, allowRepetition: DuplicateMode, orderMode: OrderMode) {
		if(orderMode === "tuples") {
			if(allowRepetition === "all-distinct") {
				return items.filter(item => item !== items[index]);
			}
			else if(allowRepetition === "allow-duplicates") {
				return items.filter((item, i) => i !== index);
			}
			else {
				return items;
			}
		}
		else {
			if(allowRepetition === "all-distinct") {
				return items.slice(index + 1).filter(item => item !== items[index]);
			}
			else if(allowRepetition === "allow-duplicates") {
				return items.slice(index + 1);
			}
			else {
				return items.slice(index);
			}
		}
	}
	static combinations<T>(
		items: Iterable<T>,
		size: number,
		allowRepetition: DuplicateMode,
		orderMode: OrderMode
	): Generator<T[]>;
	static combinations<T>(
		items: Iterable<T>,
		minSize: number,
		maxSize: number,
		allowRepetition: DuplicateMode,
		orderMode: OrderMode
	): Generator<T[]>;
	static *combinations<T>(
		arg0: Iterable<T>,
		arg1: number,
		arg2: number | DuplicateMode,
		arg3: OrderMode | DuplicateMode,
		arg4?: OrderMode,
	): Generator<T[]> {
		if(typeof arg2 === "number") {
			const [items, minSize, maxSize, allowRepetition, orderMode] = [[...arg0], arg1, arg2, arg3, arg4] as [T[], number, number, DuplicateMode, OrderMode];
			for(let size = minSize; size <= maxSize; size ++) {
				yield* Utils.combinations(items, size, allowRepetition, orderMode);
			}
		}
		else {
			const [items, size, allowRepetition, orderMode] = [[...arg0], arg1, arg2, arg3] as [T[], number, DuplicateMode, OrderMode];
			if(size === 1) {
				const uniqueItems = [...new Set(items)];
				for(const item of uniqueItems) {
					yield [item];
				}
				return;
			}
			for(const [index, firstItem] of items.entries()) {
				if(items.slice(0, index).includes(firstItem)) {
					continue;
				}
				const remainingItems = Utils.remainingValidItems(items, index, allowRepetition, orderMode);
				for(const tupleOrSet of Utils.combinations(remainingItems, size - 1, allowRepetition, orderMode)) {
					yield [firstItem, ...tupleOrSet];
				}
			}
		}
	}

	static memoize<ArgsType extends Array<unknown>, ReturnType, ThisType>(
		func: (...args: ArgsType) => ReturnType,
		standardizeArgs: ((...args: ArgsType) => ArgsType) = (...args) => args,
	) {
		const cachedResults = new Map<string, ReturnType>();
		return function(this: ThisType, ...args: ArgsType) {
			args = standardizeArgs(...args);
			const argsString = args.join(", ");
			if(cachedResults.has(argsString)) {
				return cachedResults.get(argsString) as ReturnType;
			}
			const result = func.apply(this, args);
			cachedResults.set(argsString, result);
			return result;
		};
	}

	static injections<T, S>(domain: Iterable<T>, range: Iterable<S>): Map<T, S>[] {
		if([...domain].length === 0) {
			return [new Map()];
		}
		const [first, ...others] = domain;
		const result = [];
		for(const image of range) {
			for(const injection of Utils.injections(others, [...range].filter(v => v !== image))) {
				const newInjection = new Map(injection);
				newInjection.set(first, image);
				result.push(newInjection);
			}
		}
		return result;
	}
}
