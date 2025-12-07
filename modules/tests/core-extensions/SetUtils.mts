import { describe, it } from "mocha";
import { assert } from "chai";
import { SetUtils } from "../../core-extensions/SetUtils.mjs";

describe("SetUtils.union", () => {
	it("returns all the items that are in at least one of the iterables", () => {
		const result = SetUtils.union(
			[1, 2],
			new Set([2, 3, 4, 5]),
			[6, 7],
		);
		assert.deepEqual(result, new Set([1, 2, 3, 4, 5, 6, 7]));
	});
});
describe("SetUtils.equals", () => {
	it("returns true if the iterables have the same items, without taking order into account", () => {
		assert.isTrue(SetUtils.equals([1, 2], [2, 1]));
	});
	it("does not consider duplicates when determining equality", () => {
		assert.isTrue(SetUtils.equals([1, 1, 1, 1], [1]));
		assert.isTrue(SetUtils.equals([1], [1, 1, 1, 1]));
	});
	it("returns false if there is an item in one set but not the other", () => {
		assert.isFalse(SetUtils.equals([1, 2], [2]));
		assert.isFalse(SetUtils.equals([2], [1, 2]));
	});
});
describe("SetUtils.partitions", () => {
	it("can generate a list of all the partitions of a set into a given number of nonempty subsets", () => {
		const result = SetUtils.partitions([1, 2, 3], 2);
		assert.sameDeepMembers(result, [
			new Set([new Set([1]), new Set([3, 2])]),
			new Set([new Set([2, 1]), new Set([3])]),
			new Set([new Set([2]), new Set([3, 1])]),
		]);
	});
});
describe("SetUtils.areDisjoint", () => {
	it("returns true if the iterables have no element in common", () => {
		assert.isTrue(SetUtils.areDisjoint([1, 2], [3, 4, 5]));
	});
	it("returns false if the iterables have an element in common", () => {
		assert.isFalse(SetUtils.areDisjoint([1, 2], [3, 4, 1]));
	});
});
describe("SetUtils.intersection", () => {
	it("can compute the intersection of two set-like objects", () => {
		const result = SetUtils.intersection([1, 2], [2, 3]);
		assert.deepEqual(result, new Set([2]));
	});
});
