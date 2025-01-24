import { assert } from "chai";
import { describe, it } from "mocha";
import { HashSet } from "../HashSet.mjs";

describe("HashSet.has", () => {
	it("can return whether the set has a value whose hash is equal to the given value", () => {
		const set = new HashSet([[1, 2]]);
		assert.isTrue(set.has([1, 2]));
		assert.isFalse(set.has([2, 3]));
	});
});
describe("HashSet.size", () => {
	it("returns the number of elements in the set", () => {
		const set = new HashSet([[1, 2], [3, 4], [5]]);
		assert.equal(set.size, 3);
	});
});
describe("HashSet.add", () => {
	it("can add elements to the set", () => {
		const set = new HashSet();
		set.add([1, 2]);
		assert.isTrue(set.has([1, 2]));
		assert.isFalse(set.has([2, 3]));
	});
	it("does not add duplicate elements to the set", () => {
		const set = new HashSet();
		set.add([1, 2]);
		set.add([1, 2]);
		set.add([1, 2]);
		assert.equal(set.size, 1);
	});
	it("keeps the previous value if a duplicate is added", () => {
		const obj1 = { foo: "a", bar: "b" };
		const obj2 = { foo: "a", bar: "c" };
		const set = new HashSet<{ foo: string, bar: string }>([], obj => obj.foo);
		set.add(obj1);
		assert.isTrue(set.has(obj1));
		assert.isTrue(set.has(obj2));
		set.add(obj2);
		assert.isTrue(set.has(obj1));
		assert.isTrue(set.has(obj2));
		assert.equal(set.size, 1);
		assert.sameOrderedMembers([...set], [obj1]);
	});
});
describe("HashSet.delete", () => {
	it("can delete elements from the set", () => {
		const set = new HashSet([[1, 2], [3, 4]]);
		set.delete([1, 2]);
		assert.isFalse(set.has([1, 2]));
		assert.equal(set.size, 1);
	});
});
describe("HashSet iterator", () => {
	it("can iterate over the elements of the set", () => {
		const set = new HashSet();
		set.add([1, 2]);
		set.add([3]);
		const values = [...set];
		assert.sameDeepOrderedMembers(values, [[1, 2], [3]]);
	});
});
describe("HashSet.map", () => {
	it("returns a new HashSet containing the values obtained after applying the function", () => {
		const set = new HashSet([[1, 2], [3, 4]]);
		const mapped = set.map(arr => [...arr, 0]);
		assert.sameDeepMembers([...mapped], [
			[1, 2, 0],
			[3, 4, 0]
		]);
	});
});
describe("HashSet.union", () => {
	it("can compute the union of two sets", () => {
		const result = HashSet.union(
			new HashSet([[1, 2], [3, 4]]),
			new HashSet([[3, 4], [5, 6]])
		);
		assert.deepEqual([...result], [
			[1, 2],
			[3, 4],
			[5, 6]
		]);
	});
	it("can compute the union of no sets, returning an empty set with the default hash function", () => {
		const result = HashSet.union();
		assert.deepEqual([...result], []);
	});
});
describe("HashSet.difference", () => {
	it("returns the set consisting of all elements of the first set that are not in the second", () => {
		const set1 = new HashSet([[1, 2], [3, 4]]);
		const set2 = new HashSet([[3, 4], [5, 6]]);
		const difference = set1.difference(set2);
		assert.deepEqual([...difference], [ [1, 2] ]);
	});
});
describe("HashSet.equals", () => {
	it("returns true if the sets contain the same elements, ignoring order", () => {
		const set1 = new HashSet([[1, 2], [3, 4]]);
		const set2 = new HashSet([[3, 4], [1, 2]]);
		assert.isTrue(set1.equals(set1));
		assert.isTrue(set2.equals(set2));
		assert.isTrue(set1.equals(set2));
		assert.isTrue(set2.equals(set1));
	});
	it("returns false if one of the sets contains an element that the other set does not", () => {
		const set1 = new HashSet([[1, 2]]);
		const set2 = new HashSet([[1, 2], [3, 4]]);
		assert.isFalse(set1.equals(set2));
		assert.isFalse(set2.equals(set1));
	});
});
