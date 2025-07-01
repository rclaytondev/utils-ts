import { describe, it } from "mocha";
import { Utils } from "../Utils.mjs";
import { assert } from "chai";

describe("Utils.cartesianProduct", () => {
	it("returns the set of all ordered tuples that can be obtained by choosing one element from each set", () => {
		const pairs = [...Utils.cartesianProduct([1, 2], ["a", "b"])];
		assert.sameDeepMembers(pairs, [
			[1, "a"],
			[1, "b"],
			[2, "a"],
			[2, "b"],
		]);
	});
});
describe("Utils.cartesianPower", () => {
	it("returns the set of all tuples of the given size with elements chosen from the given set", () => {
		const values = [...Utils.cartesianPower(["a", "b"], 3)];
		assert.sameDeepMembers(values, [
			["a", "a", "a"],
			["a", "a", "b"],
			["a", "b", "a"],
			["a", "b", "b"],
			["b", "a", "a"],
			["b", "a", "b"],
			["b", "b", "a"],
			["b", "b", "b"],
		]);
	});
});
describe("Utils.combinations", () => {
	it("can return all the tuples of distinct items", () => {
		const items = [1, 2, 2, 3, 4];
		const tuples = [...Utils.combinations(items, 2, "all-distinct", "tuples")];
		assert.sameDeepOrderedMembers(tuples, [
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 1],
			[2, 3],
			[2, 4],

			[3, 1],
			[3, 2],
			[3, 4],

			[4, 1],
			[4, 2],
			[4, 3],
		]);
	});
	it("can return all the tuples of items, limited by the number of copies in the given list", () => {
		const items = [1, 2, 2, 3, 4];
		const tuples = [...Utils.combinations(items, 2, "allow-duplicates", "tuples")];
		assert.sameDeepOrderedMembers(tuples, [
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 1],
			[2, 2],
			[2, 3],
			[2, 4],

			[3, 1],
			[3, 2],
			[3, 4],

			[4, 1],
			[4, 2],
			[4, 3],
		]);
	});
	it("can return all the tuples of items, not limited by the number of copies in the given list", () => {
		const items = [1, 2, 2, 3, 4];
		const tuples = [...Utils.combinations(items, 2, "unlimited-duplicates", "tuples")];
		assert.sameDeepOrderedMembers(tuples, [
			[1, 1],
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 1],
			[2, 2],
			[2, 3],
			[2, 4],

			[3, 1],
			[3, 2],
			[3, 3],
			[3, 4],

			[4, 1],
			[4, 2],
			[4, 3],
			[4, 4],
		]);
	});

	it("can return all the sets of distinct items", () => {
		const items = [1, 2, 2, 3, 4];
		const sets = [...Utils.combinations(items, 2, "all-distinct", "sets")];
		assert.sameDeepOrderedMembers(sets, [
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 3],
			[2, 4],

			[3, 4],
		]);
	});
	it("can return all the multisets of items, limited by the number of copies in the given list", () => {
		const items = [1, 2, 2, 3, 4];
		const sets = [...Utils.combinations(items, 2, "allow-duplicates", "sets")];
		assert.sameDeepOrderedMembers(sets, [
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 2],
			[2, 3],
			[2, 4],

			[3, 4],
		]);
	});
	it("can return all the multisets of items, not limited by the number of copies in the given list", () => {
		const items = [1, 2, 2, 3, 4];
		const sets = [...Utils.combinations(items, 2, "unlimited-duplicates", "sets")];
		assert.sameDeepOrderedMembers(sets, [
			[1, 1],
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 2],
			[2, 3],
			[2, 4],

			[3, 3],
			[3, 4],

			[4, 4],
		]);
	});
	it("can return all the sets of distinct items with size in a given range", () => {
		const items = [1, 2, 2, 3, 4];
		const sets = [...Utils.combinations(items, 1, 2, "all-distinct", "sets")];
		assert.sameDeepOrderedMembers(sets, [
			[1],
			[2],
			[3],
			[4],

			[1, 2],
			[1, 3],
			[1, 4],

			[2, 3],
			[2, 4],

			[3, 4],
		]);
	});
});
describe("Utils.range", () => {
	it("can return a range of numbers with a given step, including both endpoints", () => {
		const range = Utils.range(3, 9, "inclusive", "inclusive", 2);
		assert.sameOrderedMembers(range, [3, 5, 7, 9]);
	});
	it("can return a range of numbers with a given step, excluding both endpoints", () => {
		const range = Utils.range(3, 9, "exclusive", "exclusive", 2);
		assert.sameOrderedMembers(range, [5, 7]);
	});
	it("can return a range of numbers with a given step, including the start but excluding the end", () => {
		const range = Utils.range(3, 9, "inclusive", "exclusive", 2);
		assert.sameOrderedMembers(range, [3, 5, 7]);
	});
	it("can return a range of numbers with a given step, excluding the start but including the end", () => {
		const range = Utils.range(3, 9, "exclusive", "inclusive", 2);
		assert.sameOrderedMembers(range, [5, 7, 9]);
	});
});
describe("Utils.memoize", () => {
	it("returns a memoized version of the given function", () => {
		let timesRun = 0;
		const add = (a: number, b: number) => {
			timesRun ++;
			return a + b;
		};
		const memoizedAdd = Utils.memoize(add);
		assert.equal(memoizedAdd(1, 2), 3);
		assert.equal(memoizedAdd(1, 2), 3);
		assert.equal(memoizedAdd(1, 2), 3);
		assert.equal(timesRun, 1);
	});
	it("can first convert the arguments to a standard form", () => {
		let timesRun = 0;
		const modularAdd = (a: number, b: number) => {
			timesRun ++;
			return (a + b) % 10;
		};
		const standardizeArgs = (a: number, b: number) => [a % 10, b % 10] as [number, number];

		const memoized = Utils.memoize(modularAdd, standardizeArgs);
		assert.equal(memoized(1, 2), 3);
		assert.equal(memoized(1001, 2), 3);
		assert.equal(memoized(1, 1002), 3);
		assert.equal(memoized(3001, 4002), 3);
		assert.equal(timesRun, 1);
	});
	it("should stringify arguments in a way that doesn't cause collisions due to concatenation", () => {
		let timesRun = 0;
		const add = (a: number, b: number) => {
			timesRun ++;
			return a + b;
		};
		const memoizedAdd = Utils.memoize(add);

		assert.equal(memoizedAdd(1, 23), 24);
		assert.equal(memoizedAdd(12, 3), 15);
		assert.equal(timesRun, 2);
	});
	it("calls the function with the correct this value", () => {
		const obj = {
			func: function() { return this; },
		};
		obj.func = Utils.memoize(obj.func);
		assert.equal(obj.func(), obj);
	});
});
describe("Utils.minEntry", () => {
	it("can return the triple [index, value, output] at which the minimum value of the callback is attained", () => {
		const array = ["abc", "ab", "abcd"];
		const minEntry = Utils.minEntry(array, str => str.length);
		assert.sameOrderedMembers(minEntry, [1, "ab", 2]);
	});
	it("can return the triple [index, value, output] for the minimum entry of a list of numbers without being given a callback", () => {
		const array = [300, 20, 4000];
		const minEntry = Utils.minEntry(array);
		assert.sameOrderedMembers(minEntry, [1, 20, 20]);
	});
});
describe("Utils.maxEntry", () => {
	it("can return the triple [index, value, output] at which the maximum value of the callback is attained", () => {
		const array = ["abc", "ab", "abcd"];
		const maxEntry = Utils.maxEntry(array, str => str.length);
		assert.sameOrderedMembers(maxEntry, [2, "abcd", 4]);
	});
	it("can return the triple [index, value, value] for the maximum entry of a list of numbers without being given a callback", () => {
		const array = [300, 20, 4000];
		const maxEntry = Utils.maxEntry(array);
		assert.sameOrderedMembers(maxEntry, [2, 4000, 4000]);
	});
});
describe("Utils.subsets", () => {
	it("can yield all the subsets of the given set that have the given size", () => {
		const result = [...Utils.subsets(["a", "b", "c", "d"], 2)];
		assert.sameDeepMembers(result, [
			new Set(["a", "b"]),
			new Set(["a", "c"]),
			new Set(["a", "d"]),
			new Set(["b", "c"]),
			new Set(["b", "d"]),
			new Set(["c", "d"]),
		]);
	});
	it("can yield a list of all the subsets when the size parameter is omitted", () => {
		const result = [...Utils.subsets(["a", "b", "c"])];
		assert.sameDeepMembers(result, [
			new Set([]),
			new Set(["a"]),
			new Set(["b"]),
			new Set(["c"]),
			new Set(["a", "b"]),
			new Set(["a", "c"]),
			new Set(["b", "c"]),
			new Set(["a", "b", "c"]),
		]);
	});
});
describe("Utils.union", () => {
	it("returns all the items that are in at least one of the iterables", () => {
		const result = Utils.union(
			[1, 2],
			new Set([2, 3, 4, 5]),
			[6, 7],
		);
		assert.deepEqual(result, new Set([1, 2, 3, 4, 5, 6, 7]));
	});
});
describe("Utils.binarySearch", () => {
	const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
	it("works when there is a value for which the callback returns zero", () => {
		const callback = ((n: number) => array[n] - 3);
		const result = Utils.binarySearch(0, 8, callback);
		assert.equal(result, 5);
	});
	it("can return the first value when there are multiple values", () => {
		const callback = ((n: number) => array[n] - 2);
		const result = Utils.binarySearch(0, 8, callback, "first");
		assert.equal(result, 2);
	});
	it("can return the last value when there are multiple values", () => {
		const callback = ((n: number) => array[n] - 2);
		const result = Utils.binarySearch(0, 8, callback, "last");
		assert.equal(result, 4);
	});
	it("can return the value before when there are no values for which the callback returns zero", () => {
		const callback = ((n: number) => array[n] - 6);
		const result = Utils.binarySearch(0, 8, callback, "first");
		assert.equal(result, 7);
	});
	it("can return the value after when there are no values for which the callback returns zero", () => {
		const callback = ((n: number) => array[n] - 6);
		const result = Utils.binarySearch(0, 8, callback, "last");
		assert.equal(result, 8);
	});
	it("returns the minimum if the callback returns positive for all values in the range", () => {
		const callback = ((n: number) => array[n]);
		const result = Utils.binarySearch(0, 8, callback, "last");
		assert.equal(result, 0);
	});
	it("returns the maximum if the callback returns negative for all values in the range", () => {
		const callback = ((n: number) => array[n] - 100);
		const result = Utils.binarySearch(0, 8, callback, "last");
		assert.equal(result, 8);
	});
});
describe("Utils.binaryIndexOf", () => {
	it("returns the index before/after where the value should be if the value is not in the array", () => {
		const array = [10, 20];
		assert.equal(Utils.binaryIndexOf(15, array, "first"), 0);
		assert.equal(Utils.binaryIndexOf(15, array, "last"), 1);
	});
	it("works when the value is the first in the array", () => {
		const result = Utils.binaryIndexOf(2, [2, 3, 6], "first");
		assert.equal(result, 0);
	});
	it("returns the first index when the value is less than all the values in the array", () => {
		const array = [10, 20];
		assert.equal(Utils.binaryIndexOf(5, array, "last"), 0);
		assert.equal(Utils.binaryIndexOf(5, array, "first"), 0);
	});
	it("returns the last index when the value is greater than all the values in the array", () => {
		const array = [10, 20];
		assert.equal(Utils.binaryIndexOf(25, array, "last"), 1);
		assert.equal(Utils.binaryIndexOf(25, array, "first"), 1);
	});
});
describe("Utils.setEquals", () => {
	it("returns true if the iterables have the same items, without taking order into account", () => {
		assert.isTrue(Utils.setEquals([1, 2], [2, 1]));
	});
	it("does not consider duplicates when determining equality", () => {
		assert.isTrue(Utils.setEquals([1, 1, 1, 1], [1]));
		assert.isTrue(Utils.setEquals([1], [1, 1, 1, 1]));
	});
	it("returns false if there is an item in one set but not the other", () => {
		assert.isFalse(Utils.setEquals([1, 2], [2]));
		assert.isFalse(Utils.setEquals([2], [1, 2]));
	});
});
describe("Utils.setPartitions", () => {
	it("can generate a list of all the partitions of a set into a given number of nonempty subsets", () => {
		const result = Utils.setPartitions([1, 2, 3], 2);
		assert.sameDeepMembers(result, [
			new Set([new Set([1]), new Set([3, 2])]),
			new Set([new Set([2, 1]), new Set([3])]),
			new Set([new Set([2]), new Set([3, 1])]),
		]);
	});
});
describe("Utils.arrayEquals", () => {
	it("returns whether the arrays contain the same elements in the same order", () => {
		assert.isTrue(Utils.arrayEquals([1, 2], [1, 2]));

		assert.isFalse(Utils.arrayEquals([1, 2], [2, 1]));
		assert.isFalse(Utils.arrayEquals([1], [1, 2]));
		assert.isFalse(Utils.arrayEquals([1, 2], [1]));
	});
	it("can use a function to compare the values in the arrays for equality", () => {
		const equals = (a: { x: number }, b: { x: number }) => (a.x === b.x);
		assert.isTrue(Utils.arrayEquals([{x:1}, {x:2}], [{x:1}, {x:2}], equals));

		assert.isFalse(Utils.arrayEquals([{x:1}, {x:2}], [{x:2}, {x:1}], equals));
		assert.isFalse(Utils.arrayEquals([{x:1}], [{x:1}, {x:2}], equals));
		assert.isFalse(Utils.arrayEquals([{x:1}, {x:2}], [{x:1}], equals));
	});
});
describe("Utils.mapEquals", () => {
	it("returns true if the maps have the same set of key-value pairs", () => {
		const map1 = new Map([[1, 2], [3, 4]]);
		const map2 = new Map([[1, 2], [3, 4]]);
		assert.isTrue(Utils.mapEquals(map1, map2));
	});
	it("returns false if there are keys that are in one map but not the other", () => {
		const map1 = new Map([[1, 2], [3, 4]]);
		const map2 = new Map([[1, 2]]);
		assert.isFalse(Utils.mapEquals(map1, map2));
		assert.isFalse(Utils.mapEquals(map2, map1));
	});
	it("returns false if some of the keys have a different value in the two maps", () => {
		const map1 = new Map([[1, 2]]);
		const map2 = new Map([[1, 3]]);
		assert.isFalse(Utils.mapEquals(map1, map2));
		assert.isFalse(Utils.mapEquals(map2, map1));
	});
	it("can use a function to compare the values for equality", () => {
		const map1 = new Map([[1, { x: 2 }]]);
		const map2 = new Map([[1, { x: 2 }]]);
		assert.isTrue(Utils.mapEquals(map1, map2, (a, b) => a.x === b.x));

		const map3 = new Map([[1, { x: 3 }]]);
		assert.isFalse(Utils.mapEquals(map1, map3, (a, b) => a.x === b.x));
	});
});
describe("Utils.areDisjoint", () => {
	it("returns true if the iterables have no element in common", () => {
		assert.isTrue(Utils.areDisjoint([1, 2], [3, 4, 5]));
	});
	it("returns false if the iterables have an element in common", () => {
		assert.isFalse(Utils.areDisjoint([1, 2], [3, 4, 1]));
	});
});
describe("Utils.intersection", () => {
	it("can compute the intersection of two set-like objects", () => {
		const result = Utils.intersection([1, 2], [2, 3]);
		assert.deepEqual(result, new Set([2]));
	});
});
describe("Utils.groupBy", () => {
	it("returns a map with the array elements grouped by the callback's value", () => {
		const array = [1, 2, 3, 4, 5, 6, 7, 8];
		const groups = Utils.groupBy(array, n => n % 2);
		assert.deepEqual(groups, new Map([
			[0, [2, 4, 6, 8]],
			[1, [1, 3, 5, 7]],
		]));
	});
});
