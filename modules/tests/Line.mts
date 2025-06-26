import { describe, it } from "mocha";
import { Line } from "../geometry/Line.mjs";
import { Vector } from "../geometry/Vector.mjs";
import { assert } from "chai";

describe("Line.getX", () => {
	it("returns the x-value such that (x, y) is on the line, where y is the given y-value", () => {
		const line = new Line(new Vector(2, 1), new Vector(3, 3));
		const x = line.getX(7);
		assert.equal(x, 5);
	});
});
describe("Line.getY", () => {
	it("returns the y-value such that (x, y) is on the line, where x is the given x-value", () => {
		const line = new Line(new Vector(1, 2), new Vector(3, 3));
		const x = line.getY(7);
		assert.equal(x, 5);
	});
});
describe("Line.contains", () => {
	it("returns whether the line contain the point", () => {
		const line = new Line(new Vector(1, 2), new Vector(3, 4));
		assert.isTrue(line.contains(new Vector(0, 1)));
		assert.isFalse(line.contains(new Vector(1, 1)));
	});
	it("works when the line is vertical", () => {
		const line = new Line(new Vector(1, 2), new Vector(1, 3));
		assert.isTrue(line.contains(new Vector(1, 4)));
		assert.isFalse(line.contains(new Vector(2, 3)));
	});
});

describe("Line.areCollinear", () => {
	it("returns true when the points are collinear", () => {
		assert.isTrue(Line.areCollinear([new Vector(1, 2), new Vector(4, 1), new Vector(7, 0)]));
	});
	it("returns false when the points are not collinear", () => {
		assert.isFalse(Line.areCollinear([new Vector(1, 2), new Vector(4, 1), new Vector(7, 1)]));
	});
});
describe("Line.isPerpendicularTo", () => {
	it("returns true when the lines are perpendicular", () => {
		const line1 = new Line(new Vector(0, 0), new Vector(1, 2));
		const line2 = new Line(new Vector(0, 0), new Vector(-2, 1));
		assert.isTrue(line1.isPerpendicularTo(line2));
		assert.isTrue(line2.isPerpendicularTo(line1));
	});
	it("returns false when the lines are not perpendicular", () => {
		const line1 = new Line(new Vector(0, 0), new Vector(1, 3));
		const line2 = new Line(new Vector(0, 0), new Vector(-2, 1));
		assert.isFalse(line1.isPerpendicularTo(line2));
		assert.isFalse(line2.isPerpendicularTo(line1));
	});
	it("works when the lines are vertical and horizontal", () => {
		const line1 = new Line(new Vector(0, 0), new Vector(1, 0));
		const line2 = new Line(new Vector(0, 0), new Vector(0, 1));
		assert.isTrue(line1.isPerpendicularTo(line2));
		assert.isTrue(line2.isPerpendicularTo(line1));
		assert.isFalse(line1.isPerpendicularTo(line1));
		assert.isFalse(line2.isPerpendicularTo(line2));
	});
	it("returns false when one of the lines is vertical/horizontal and the other is not", () => {
		const vertical = new Line(new Vector(0, 0), new Vector(0, 1));
		const horizontal = new Line(new Vector(0, 0), new Vector(1, 0));
		const otherLine = new Line(new Vector(0, 0), new Vector(1, 1));
		assert.isFalse(vertical.isPerpendicularTo(otherLine));
		assert.isFalse(otherLine.isPerpendicularTo(vertical));
		assert.isFalse(horizontal.isPerpendicularTo(otherLine));
		assert.isFalse(otherLine.isPerpendicularTo(horizontal));
	});
});
describe("Line.intersection", () => {
	it("returns the intersection point for two lines that intersect", () => {
		const line1 = new Line(new Vector(0, 0), new Vector(10, 10));
		const line2 = new Line(new Vector(0, 10), new Vector(10, 0));
		const intersection = line1.intersection(line2);
		assert.deepEqual(intersection, new Vector(5, 5));
	});
	it("returns null when the lines do not intersect", () => {
		const line1 = new Line(new Vector(0, 0), new Vector(10, 10));
		const line2 = new Line(new Vector(0, 10), new Vector(10, 20));
		const intersection = line1.intersection(line2);
		assert.equal(intersection, null);
	});
	it("returns null when there are infinitely many intersections", () => {
		const line1 = new Line(new Vector(0, 0), new Vector(5, 5));
		const line2 = new Line(new Vector(5, 5), new Vector(10, 10));
		const intersection = line1.intersection(line2);
		assert.equal(intersection, null);
	});

	it("returns null when the lines do not intersect and are vertical", () => {
		const line1 = new Line(new Vector(0, 1), new Vector(0, 2));
		const line2 = new Line(new Vector(1, 1), new Vector(1, 2));
		const intersection = line1.intersection(line2);
		assert.equal(intersection, null);
	});
	it("returns null when there are infinitely many intersections and the lines are vertical", () => {
		const line1 = new Line(new Vector(0, 1), new Vector(0, 2));
		const line2 = new Line(new Vector(0, 3), new Vector(0, 4));
		const intersection = line1.intersection(line2);
		assert.equal(intersection, null);
	});
	it("returns the intersection point when one of the lines is vertical", () => {
		const line1 = new Line(new Vector(0, 1), new Vector(0, 2));
		const line2 = new Line(new Vector(10, 20), new Vector(11, 21));
		const intersection = line1.intersection(line2);
		assert.deepEqual(intersection, new Vector(0, 10));
	});
});
