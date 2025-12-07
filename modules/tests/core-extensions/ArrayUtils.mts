import { describe, it } from "mocha";
import { assert } from "chai";
import { ArrayUtils } from "../../core-extensions/ArrayUtils.mjs";

describe("ArrayUtils.range", () => {
	it("can return a range of numbers with a given step, including both endpoints", () => {
		const range = ArrayUtils.range(3, 9, "inclusive", "inclusive", 2);
		assert.sameOrderedMembers(range, [3, 5, 7, 9]);
	});
	it("can return a range of numbers with a given step, excluding both endpoints", () => {
		const range = ArrayUtils.range(3, 9, "exclusive", "exclusive", 2);
		assert.sameOrderedMembers(range, [5, 7]);
	});
	it("can return a range of numbers with a given step, including the start but excluding the end", () => {
		const range = ArrayUtils.range(3, 9, "inclusive", "exclusive", 2);
		assert.sameOrderedMembers(range, [3, 5, 7]);
	});
	it("can return a range of numbers with a given step, excluding the start but including the end", () => {
		const range = ArrayUtils.range(3, 9, "exclusive", "inclusive", 2);
		assert.sameOrderedMembers(range, [5, 7, 9]);
	});
});
describe("ArrayUtils.minEntry", () => {
	it("can return the triple [index, value, output] at which the minimum value of the callback is attained", () => {
		const array = ["abc", "ab", "abcd"];
		const minEntry = ArrayUtils.minEntry(array, str => str.length);
		assert.sameOrderedMembers(minEntry, [1, "ab", 2]);
	});
	it("can return the triple [index, value, output] for the minimum entry of a list of numbers without being given a callback", () => {
		const array = [300, 20, 4000];
		const minEntry = ArrayUtils.minEntry(array);
		assert.sameOrderedMembers(minEntry, [1, 20, 20]);
	});
});
describe("ArrayUtils.maxEntry", () => {
	it("can return the triple [index, value, output] at which the maximum value of the callback is attained", () => {
		const array = ["abc", "ab", "abcd"];
		const maxEntry = ArrayUtils.maxEntry(array, str => str.length);
		assert.sameOrderedMembers(maxEntry, [2, "abcd", 4]);
	});
	it("can return the triple [index, value, value] for the maximum entry of a list of numbers without being given a callback", () => {
		const array = [300, 20, 4000];
		const maxEntry = ArrayUtils.maxEntry(array);
		assert.sameOrderedMembers(maxEntry, [2, 4000, 4000]);
	});
});
describe("ArrayUtils.binaryIndexOf", () => {
	it("returns the index before/after where the value should be if the value is not in the array", () => {
		const array = [10, 20];
		assert.equal(ArrayUtils.binaryIndexOf(15, array, "first"), 0);
		assert.equal(ArrayUtils.binaryIndexOf(15, array, "last"), 1);
	});
	it("works when the value is the first in the array", () => {
		const result = ArrayUtils.binaryIndexOf(2, [2, 3, 6], "first");
		assert.equal(result, 0);
	});
	it("returns the first index when the value is less than all the values in the array", () => {
		const array = [10, 20];
		assert.equal(ArrayUtils.binaryIndexOf(5, array, "last"), 0);
		assert.equal(ArrayUtils.binaryIndexOf(5, array, "first"), 0);
	});
	it("returns the last index when the value is greater than all the values in the array", () => {
		const array = [10, 20];
		assert.equal(ArrayUtils.binaryIndexOf(25, array, "last"), 1);
		assert.equal(ArrayUtils.binaryIndexOf(25, array, "first"), 1);
	});
});
describe("ArrayUtils.equals", () => {
	it("returns whether the arrays contain the same elements in the same order", () => {
		assert.isTrue(ArrayUtils.equals([1, 2], [1, 2]));

		assert.isFalse(ArrayUtils.equals([1, 2], [2, 1]));
		assert.isFalse(ArrayUtils.equals([1], [1, 2]));
		assert.isFalse(ArrayUtils.equals([1, 2], [1]));
	});
	it("can use a function to compare the values in the arrays for equality", () => {
		const equals = (a: { x: number }, b: { x: number }) => (a.x === b.x);
		assert.isTrue(ArrayUtils.equals([{x:1}, {x:2}], [{x:1}, {x:2}], equals));

		assert.isFalse(ArrayUtils.equals([{x:1}, {x:2}], [{x:2}, {x:1}], equals));
		assert.isFalse(ArrayUtils.equals([{x:1}], [{x:1}, {x:2}], equals));
		assert.isFalse(ArrayUtils.equals([{x:1}, {x:2}], [{x:1}], equals));
	});
});
