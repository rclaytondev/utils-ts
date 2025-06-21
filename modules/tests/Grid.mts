import { describe, it } from "mocha";
import { Grid } from "../Grid.mjs";
import { assert } from "chai";

describe("Grid.equals", () => {
	it("returns whether the grids have the same entries in every position", () => {
		const grid1 = new Grid(0);
		grid1.set(1, 2, 123);

		const grid2 = new Grid(0);
		grid2.set(1, 2, 123);

		const grid3 = new Grid(0);

		assert.isTrue(grid1.equals(grid2));
		assert.isFalse(grid2.equals(grid3));
	});
	it("works when a custom equality function has been provided for the grid entries", () => {
		const grid1 = new Grid({ x: 0 });
		grid1.set(1, 2, { x: 123 });

		const grid2 = new Grid({ x: 0 });
		grid2.set(1, 2, { x: 123 });

		const grid3 = new Grid({ x: 0 });

		assert.isTrue(grid1.equals(grid2, (a, b) => a.x === b.x));
		assert.isFalse(grid2.equals(grid3, (a, b) => a.x === b.x));
	});
	it("works when a custom equality function has been provided and some values have been set to the default value", () => {
		const grid1 = new Grid({ x: 0 });
		grid1.set(1, 2, { x: 0 });
		const grid2 = new Grid({ x: 0 });
		assert.isTrue(grid1.equals(grid2, (a, b) => a.x === b.x));
	});
});
