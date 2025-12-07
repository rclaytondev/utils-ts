import { describe, it } from "mocha";
import { Utils } from "../Utils.mjs";
import { assert } from "chai";

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
