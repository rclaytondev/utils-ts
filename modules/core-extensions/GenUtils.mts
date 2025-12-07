type CartesianProductType<T extends unknown[][]> = {
	[P in keyof T]: T[P] extends Array<infer U>? U: never
};

type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;

export class GenUtils {
	static *cartesianProduct<T extends unknown[][]>(...sets: T): Generator<CartesianProductType<T>> {
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
	static *subsets<T>(items: Set<T> | T[], size?: number): Generator<Set<T>> {
		if(typeof size !== "number") {
			const setSize = (items instanceof Set) ? items.size : items.length;
			for(let subsetSize = 0; subsetSize <= setSize; subsetSize ++) {
				yield* GenUtils.subsets(items, subsetSize);
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
			for(const subset of GenUtils.subsets(after, size - 1)) {
				yield new Set([firstItem, ...subset]);
			}
		}
	}
}
