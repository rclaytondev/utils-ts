import { assert } from "chai";
import { describe } from "mocha";
import { Table } from "../Table.mjs";

describe("Table.slice", () => {
	it("extracts a rectangular subregion into a Table", () => {
		const table = new Table([
			["a", "b", "c"],
			["d", "e", "f"]
		]);
		const subtable = table.slice(1, 0, 2, 1);
		assert.deepEqual(subtable, new Table([["b", "c"]]));
	});
	it("reduces the width and/or height of the subregion if they are too big", () => {
		const table = new Table([
			["a", "b", "c"],
			["d", "e", "f"]
		]);
		assert.deepEqual(
			table.slice(1, 0, 100, 200), 
			new Table([
				["b", "c"],
				["e", "f"]
			])
		);
	});
	it("works when the y-value of the top-left corner of the rectangle is nonzero", () => {
		const table = new Table([
			["a", "b", "c"],
			["d", "e", "f"]
		]);
		const subtable = table.slice(1, 1, 2, 1);
		assert.deepEqual(subtable, new Table([["e", "f"]]));
	});
});
describe("Table.findEntry", () => {
	it("returns the first entry for which the callback returns true, when iterating from left-to-right and top-to-bottom", () => {
		const table = new Table([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);
		const entry = table.findEntry((v, x, y) => y > 0 && x > 0 && v !== 5);
		assert.deepEqual(entry, [2, 1, 6]);
	});
	it("returns null if there is no entry for which the callback returns true", () => {
		const table = new Table([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);
		const entry = table.findEntry(v => v > 1000);
		assert.isNull(entry);
	});
});
