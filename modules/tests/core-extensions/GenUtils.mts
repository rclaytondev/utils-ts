import { describe, it } from "mocha";
import { assert } from "chai";
import { GenUtils } from "../../core-extensions/GenUtils.mjs";

describe("GenUtils.cartesianProduct", () => {
	it("returns the set of all ordered tuples that can be obtained by choosing one element from each set", () => {
		const pairs = [...GenUtils.cartesianProduct([1, 2], ["a", "b"])];
		assert.sameDeepMembers(pairs, [
			[1, "a"],
			[1, "b"],
			[2, "a"],
			[2, "b"],
		]);
	});
});
describe("GenUtils.cartesianPower", () => {
	it("returns the set of all tuples of the given size with elements chosen from the given set", () => {
		const values = [...GenUtils.cartesianPower(["a", "b"], 3)];
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
describe("GenUtils.subsets", () => {
	it("can yield all the subsets of the given set that have the given size", () => {
		const result = [...GenUtils.subsets(["a", "b", "c", "d"], 2)];
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
		const result = [...GenUtils.subsets(["a", "b", "c"])];
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
