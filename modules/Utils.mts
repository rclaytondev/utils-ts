type DuplicateMode = "all-distinct" | "allow-duplicates" | "unlimited-duplicates";
type OrderMode = "tuples" | "sets";

type CartesianProductType<T extends unknown[][]> = {
	[P in keyof T]: T[P] extends Array<infer U>? U: never
};

type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;

export class Utils {
	static randomItem<T>(items: readonly T[]) {
		if(items.length === 0) {
			throw new Error("Cannot choose a random index from an empty array.");
		}
		const index = Math.floor(Math.random() * items.length);
		return items[index];
	}
	static randomIndex<T>(items: readonly T[]) {
		if(items.length === 0) {
			throw new Error("Cannot choose a random item from an empty array.");
		}
		const index = Math.floor(Math.random() * items.length);
		return index;
	}
	static range(min: number, max: number, startMode: "inclusive" | "exclusive" = "inclusive", endMode: "inclusive" | "exclusive" = "inclusive", step: number = 1) {
		[min, max] = [Math.min(min, max), Math.max(min, max)];
		step = Math.abs(step);

		if(step === 0) {
			throw new Error("Cannot create a range with a step of 0.");
		}

		const result = [];
		const startValue = (startMode === "inclusive") ? min : min + step;
		for(let value = startValue; (value < max && endMode === "exclusive") || (value <= max && endMode === "inclusive"); value += step) {
			result.push(value);
		}
		return result;
	}
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
	static binaryIndexOf(value: number, sortedArray: readonly number[], mode: "first" | "last") {
		return Utils.binarySearch(0, sortedArray.length - 1, i => sortedArray[i] - value, mode);
	}
	static arrayEquals<T>(array1: readonly T[], array2: readonly T[], equals?: (v1: T, v2: T) => boolean) {
		if(array1.length !== array2.length) {
			return false;
		}
		if(equals) {
			return array1.every((v, i) => equals(v, array2[i]));
		}
		return array1.every((v, i) => v === array2[i]);
	}
	static mapEquals<K, V>(map1: ReadonlyMap<K, V>, map2: ReadonlyMap<K, V>, equals?: (v1: V, v2: V) => boolean) {
		if(map1.size !== map2.size) {
			return false;
		}
		for(const [key, value] of map1) {
			if(
				!map2.has(key) || 
				(!equals && map1.get(key) !== map2.get(key)) ||
				(equals && !equals(value, map2.get(key)!))
			) { return false; }
		}
		return true;
	}

	static minEntry(items: readonly number[]): [number, number, number];
	static minEntry<T>(items: readonly T[], callback: ((item: T, index: number) => number)): [number, T, number];
	static minEntry<T>(items: readonly T[], callback?: (item: T, index: number) => number) {
		let minEntry: [number, T, number] = [0, items[0], callback ? callback(items[0] as T, 0) : items[0] as number];
		for(let i = 1; i < items.length; i ++) {
			const output = callback ? callback(items[i], i) : (items[i] as number);
			if(output < minEntry[2]) {
				minEntry = [i, items[i], output];
			}
		}
		return minEntry;
	}
	static maxEntry(items: number[]): [number, number, number];
	static maxEntry<T>(items: readonly T[], callback: ((item: T, index: number) => number)): [number, T, number];
	static maxEntry<T>(items: readonly T[], callback?: (item: T, index: number) => number) {
		let minEntry: [number, T, number] = [0, items[0], callback ? callback(items[0] as T, 0) : items[0] as number];
		for(let i = 1; i < items.length; i ++) {
			const output = callback ? callback(items[i], i) : (items[i] as number);
			if(output > minEntry[2]) {
				minEntry = [i, items[i], output];
			}
		}
		return minEntry;
	}

	static minIndex(items: number[]): number;
	static minIndex<T>(items: readonly T[], callback: ((item: T, index: number) => number)): number;
	static minIndex<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return Utils.minEntry(items as any, callback as any)[0];
	}
	static minValue(items: number[]): number;
	static minValue<T>(items: readonly T[], callback: ((item: T, index: number) => number)): T;
	static minValue<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return Utils.minEntry(items as any, callback as any)[1];
	}
	static minOutput(items: number[]): number;
	static minOutput<T>(items: readonly T[], callback: ((item: T, index: number) => number)): number;
	static minOutput<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return Utils.minEntry(items as any, callback as any)[2];
	}
	static maxIndex(items: number[]): number;
	static maxIndex<T>(items: readonly T[], callback: ((item: T, index: number) => number)): number;
	static maxIndex<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return Utils.maxEntry(items as any, callback as any)[0];
	}
	static maxValue(items: number[]): number;
	static maxValue<T>(items: readonly T[], callback: ((item: T, index: number) => number)): T;
	static maxValue<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return Utils.maxEntry(items as any, callback as any)[1];
	}
	static maxOutput(items: number[]): number;
	static maxOutput<T>(items: readonly T[], callback: ((item: T, index: number) => number)): number;
	static maxOutput<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return Utils.maxEntry(items as any, callback as any)[2];
	}

	static toggleSetElement<T>(set: Set<T>, element: T) {
		if(set.has(element)) {
			set.delete(element);
		}
		else {
			set.add(element);
		}
	}
	static *cartesianProduct<T extends unknown[][]>(...sets: T): Generator<CartesianProductType<T>> {
		if(sets.length > 0) {
			for(const firstItem of sets[0]) {
				const otherSets = sets.slice(1);
				for(const tuple of Utils.cartesianProduct(...otherSets)) {
					yield [firstItem, ...tuple] as CartesianProductType<T>;
				}
			}
		}
		else {
			yield [] as CartesianProductType<T>;
		}
	}
	static *cartesianPower<T, N extends number>(set: Iterable<T>, power: N) {
		const combinations = new Array(power).fill(null).map(_ => [...set]);
		yield* Utils.cartesianProduct(...combinations) as Generator<Tuple<T, N>>;
	}
	static *subsets<T>(items: Set<T> | T[], size?: number): Generator<Set<T>> {
		if(typeof size !== "number") {
			const setSize = (items instanceof Set) ? items.size : items.length;
			for(let subsetSize = 0; subsetSize <= setSize; subsetSize ++) {
				yield* Utils.subsets(items, subsetSize);
			}
			return;
		}
		if(size < 0) { return; }
		if(size === 0) {
			yield new Set([]);
			return;
		}
		items = [...items];
		for(const [firstIndex, firstItem] of items.slice(0, items.length - (size - 1)).entries()) {
			const after = items.slice(firstIndex + 1);
			for(const subset of Utils.subsets(after, size - 1)) {
				yield new Set([firstItem, ...subset]);
			}
		}
	}
	static union<T>(set1: Iterable<T>, set2: Iterable<T>) {
		const result = new Set([...set1]);
		for(const value of set2) {
			result.add(value);
		}
		return result;
	}
	static intersection<T, S>(iterable1: Iterable<T>, iterable2: Iterable<S>) {
		const set2 = iterable2 instanceof Set ? (iterable2 as Set<S>) : new Set(iterable2);
		const result = new Set<T | S>();
		for(const value of iterable1) {
			if(set2.has(value as any)) {
				result.add(value);
			}
		}
		return result;
	}
	static setEquals<T>(iterable1: Iterable<T>, iterable2: Iterable<T>) {
		const set1 = iterable1 instanceof Set ? iterable1 : new Set(iterable1);
		const set2 = iterable2 instanceof Set ? iterable2 : new Set(iterable2);
		if(set1.size !== set2.size) { return false; }
		for(const value of set1) {
			if(!set2.has(value)) {
				return false;
			}
		}
		return true;
	}
	static setPartitions<T>(values: Iterable<T>, numSets?: number): Set<Set<T>>[] {
		const size = [...values].length;
		if(typeof numSets !== "number") {
			let result: Set<Set<T>>[] = [];
			for(let sets = 0; sets <= size; sets ++) {
				result = result.concat(Utils.setPartitions(values, sets));
			}
			return result;
		}

		if(numSets === 0) {
			const EMPTY_PARTITION = new Set([]);
			return size === 0 ? [EMPTY_PARTITION] : [];
		}
		else if(size === 0) {
			return [];
		}
		const [first, ...others] = values;
		const result: Set<Set<T>>[] = [];
		for(const partition of Utils.setPartitions(others, numSets - 1)) {
			result.push(new Set([new Set([first]), ...partition]));
		}
		for(const partition of Utils.setPartitions(others, numSets)) {
			const partitionArray = [...partition];
			for(let i = 0; i < partitionArray.length; i ++) {
				const setsBefore = partitionArray.slice(0, i).map(s => new Set(s));
				const set = new Set(partitionArray[i]);
				const setsAfter = partitionArray.slice(i + 1).map(s => new Set(s));
				set.add(first);
				result.push(new Set([...setsBefore, set, ...setsAfter]));
			}
		}
		return result;
	}
	static areDisjoint<T>(iterable1: Iterable<T>, iterable2: Iterable<T>) {
		const set1 = new Set(iterable1);
		for(const value of iterable2) {
			if(set1.has(value)) {
				return false;
			}
		}
		return true;
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
		items: T[] | Set<T>,
		size: number,
		allowRepetition: DuplicateMode,
		orderMode: OrderMode
	): Generator<T[]>;
	static combinations<T>(
		items: T[] | Set<T>,
		minSize: number,
		maxSize: number,
		allowRepetition: DuplicateMode,
		orderMode: OrderMode
	): Generator<T[]>;
	static *combinations<T>(
		arg0: T[] | Set<T>,
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
