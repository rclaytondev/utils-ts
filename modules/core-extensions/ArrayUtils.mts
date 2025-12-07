import { Utils } from "../Utils.mjs";

export class ArrayUtils {
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

	static binaryIndexOf(value: number, sortedArray: readonly number[], mode: "first" | "last") {
		return Utils.binarySearch(0, sortedArray.length - 1, i => sortedArray[i] - value, mode);
	}

	static equals<T>(array1: readonly T[], array2: readonly T[], equals?: (v1: T, v2: T) => boolean) {
		if(array1.length !== array2.length) {
			return false;
		}
		if(equals) {
			return array1.every((v, i) => equals(v, array2[i]));
		}
		return array1.every((v, i) => v === array2[i]);
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
		return ArrayUtils.minEntry(items as any, callback as any)[0];
	}
	static minValue(items: number[]): number;
	static minValue<T>(items: readonly T[], callback: ((item: T, index: number) => number)): T;
	static minValue<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return ArrayUtils.minEntry(items as any, callback as any)[1];
	}
	static minOutput(items: number[]): number;
	static minOutput<T>(items: readonly T[], callback: ((item: T, index: number) => number)): number;
	static minOutput<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return ArrayUtils.minEntry(items as any, callback as any)[2];
	}
	static maxIndex(items: number[]): number;
	static maxIndex<T>(items: readonly T[], callback: ((item: T, index: number) => number)): number;
	static maxIndex<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return ArrayUtils.maxEntry(items as any, callback as any)[0];
	}
	static maxValue(items: number[]): number;
	static maxValue<T>(items: readonly T[], callback: ((item: T, index: number) => number)): T;
	static maxValue<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return ArrayUtils.maxEntry(items as any, callback as any)[1];
	}
	static maxOutput(items: number[]): number;
	static maxOutput<T>(items: readonly T[], callback: ((item: T, index: number) => number)): number;
	static maxOutput<T>(items: readonly T[] | number[], callback?: (item: T, index: number) => number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return ArrayUtils.maxEntry(items as any, callback as any)[2];
	}
}
