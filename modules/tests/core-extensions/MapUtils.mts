import { describe, it } from "mocha";
import { assert } from "chai";
import { MapUtils } from "../../core-extensions/MapUtils.mjs";

describe("MapUtils.equals", () => {
	it("returns true if the maps have the same set of key-value pairs", () => {
		const map1 = new Map([[1, 2], [3, 4]]);
		const map2 = new Map([[1, 2], [3, 4]]);
		assert.isTrue(MapUtils.equals(map1, map2));
	});
	it("returns false if there are keys that are in one map but not the other", () => {
		const map1 = new Map([[1, 2], [3, 4]]);
		const map2 = new Map([[1, 2]]);
		assert.isFalse(MapUtils.equals(map1, map2));
		assert.isFalse(MapUtils.equals(map2, map1));
	});
	it("returns false if some of the keys have a different value in the two maps", () => {
		const map1 = new Map([[1, 2]]);
		const map2 = new Map([[1, 3]]);
		assert.isFalse(MapUtils.equals(map1, map2));
		assert.isFalse(MapUtils.equals(map2, map1));
	});
	it("can use a function to compare the values for equality", () => {
		const map1 = new Map([[1, { x: 2 }]]);
		const map2 = new Map([[1, { x: 2 }]]);
		assert.isTrue(MapUtils.equals(map1, map2, (a, b) => a.x === b.x));

		const map3 = new Map([[1, { x: 3 }]]);
		assert.isFalse(MapUtils.equals(map1, map3, (a, b) => a.x === b.x));
	});
});
describe("MapUtils.groupBy", () => {
	it("returns a map with the array elements grouped by the callback's value", () => {
		const array = [1, 2, 3, 4, 5, 6, 7, 8];
		const groups = MapUtils.groupBy(array, n => n % 2);
		assert.deepEqual(groups, new Map([
			[0, [2, 4, 6, 8]],
			[1, [1, 3, 5, 7]],
		]));
	});
});
