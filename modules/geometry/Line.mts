import { Vector } from "./Vector.mjs";

export class Line {
	endpoint1: Vector;
	endpoint2: Vector;

	constructor(endpoint1: Vector, endpoint2: Vector) {
		this.endpoint1 = endpoint1;
		this.endpoint2 = endpoint2;
	}

	getX(y: number) {
		return this.endpoint1.x + ((y - this.endpoint1.y) / (this.endpoint2.y - this.endpoint1.y) * (this.endpoint2.x - this.endpoint1.x));
	}
	getY(x: number) {
		return this.endpoint1.y + ((x - this.endpoint1.x) / (this.endpoint2.x - this.endpoint1.x) * (this.endpoint2.y - this.endpoint1.y));
	}

	scale(num: number) {
		return new Line(this.endpoint1.multiply(num), this.endpoint2.multiply(num));
	}

	isHorizontal() {
		return this.endpoint1.y === this.endpoint2.y;
	}
	isVertical() {
		return this.endpoint1.x === this.endpoint2.x;
	}

	lineIntersection(line: Line) {
		if(this.isVertical() && line.isVertical()) {
			return null;
		}
		else if(this.isVertical() || line.isVertical()) {
			const verticalLine = [this, line].find(v => v.isVertical())!;
			const otherLine = [this, line].find(v => !v.isVertical())!;
			return new Vector(
				verticalLine.endpoint1.x,
				otherLine.slope() * (verticalLine.endpoint1.x - otherLine.endpoint1.x) + otherLine.endpoint1.y,
			);
		}

		const slope1 = this.slope();
		const slope2 = line.slope();
		if(slope1 === slope2) {
			return null;
		}
		const yIntercept1 = this.yIntercept();
		const yIntercept2 = line.yIntercept();
		const xIntersection = (yIntercept2 - yIntercept1) / (slope1 - slope2);
		const yIntersection = xIntersection * slope1 + yIntercept1;
		return new Vector(xIntersection, yIntersection);
	}
	intersection(line: Line, line1Mode: "line" | "ray" | "segment" = "line", line2Mode: "line" | "ray" | "segment" = "line") {
		const intersection = this.lineIntersection(line);
		if(intersection === null) { return null; }
		const onSameSide = (value: number, value1: number, value2: number) => {
			if(value1 === value) { return true; }
			return (value1 > value) === (value2 > value);
		};
		const contains = (l: Line, mode: "line" | "ray" | "segment") => (
			!(
				mode !== "line"
				&& (!onSameSide(l.endpoint1.x, l.endpoint2.x, intersection.x) || !onSameSide(l.endpoint1.y, l.endpoint2.y, intersection.y))
			)
			&& !(
				mode === "segment"
				&& (!onSameSide(l.endpoint1.x, l.endpoint2.x, intersection.x) || !onSameSide(l.endpoint1.y, l.endpoint2.y, intersection.y))
			)
		);
		if(!contains(this, line1Mode) || !contains(line, line2Mode)) {
			return null;
		}
		return intersection;
	}

	contains(point: Vector) {
		if(this.isVertical()) {
			return point.x === this.endpoint1.x;
		}
		return this.getY(point.x) === point.y;
	}

	slope() {
		return (this.endpoint1.y - this.endpoint2.y) / (this.endpoint1.x - this.endpoint2.x);
	}
	yIntercept() {
		return (-this.slope() * this.endpoint1.x) + this.endpoint1.y;
	}

	isPerpendicularTo(line: Line) {
		if(this.isVertical()) { return line.isHorizontal(); }
		if(this.isHorizontal()) { return line.isVertical(); }
		if(line.isHorizontal() || line.isVertical()) { return false; }
		return this.slope() === -1 / line.slope();
	}

	static areCollinear(points: Vector[]) {
		if(points.length <= 2) { return true; }
		const [p1, p2, ...others] = points;
		const line = new Line(p1, p2);
		return others.every(p => line.contains(p));
	}
}
