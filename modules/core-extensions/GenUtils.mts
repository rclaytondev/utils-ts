type CartesianProductType<T extends Array<Iterable<unknown>>> = {
	[P in keyof T]: T[P] extends Iterable<infer U>? U: never
};

type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;

export class GenUtils {
	static *cartesianProduct<T extends Array<Iterable<unknown>>>(...sets: T): Generator<CartesianProductType<T>> {
		if(sets.length > 0) {
			for(const firstItem of sets[0]) {
				const otherSets = sets.slice(1);
				for(const tuple of GenUtils.cartesianProduct(...otherSets)) {
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
		yield* GenUtils.cartesianProduct(...combinations) as Generator<Tuple<T, N>>;
	}
	static *subsets<T>(items: Iterable<T>, size?: number): Generator<Set<T>> {
		if(!Array.isArray(items)) { items = [...items]; }
		if(typeof size !== "number") {
			for(let subsetSize = 0; subsetSize <= (items as T[]).length; subsetSize ++) {
				yield* GenUtils.subsets(items, subsetSize);
			}
			return;
		}
		if(size < 0) { return; }
		if(size === 0) {
			yield new Set([]);
			return;
		}
		for(const [firstIndex, firstItem] of (items as T[]).slice(0, (items as T[]).length - (size - 1)).entries()) {
			const after = (items as T[]).slice(firstIndex + 1);
			for(const subset of GenUtils.subsets(after, size - 1)) {
				yield new Set([firstItem, ...subset]);
			}
		}
	}

	static *slice<T>(items: Iterable<T>, start: number, end: number = Infinity) {
		let index = 0;
		for(const item of items) {
			if(index >= start && index < end) {
				yield item;
			}
			index ++;
			if(index >= end) { return; }
		}
	}
}
