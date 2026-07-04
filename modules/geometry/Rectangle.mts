import { HashSet } from "../HashSet.mjs";
import { Diagonal, Direction, Directions } from "./Direction.mjs";
import { Vector } from "./Vector.mjs";

export class Rectangle {
	left: number;
	right: number;
	top: number;
	bottom: number;

	private constructor(left: number, right: number, top: number, bottom: number) {
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
	}
	static fromDimensions(x: number, y: number, width: number, height: number) {
		return new Rectangle(x, x + width, y, y + height);
	}
	static fromBounds(left: number, right: number, top: number, bottom: number) {
		return new Rectangle(Math.min(left, right), Math.max(left, right), Math.min(top, bottom), Math.max(top, bottom));
	}
	static fromOppositeCorners(corner1: Vector, corner2: Vector) {
		return Rectangle.fromBounds(corner1.x, corner2.x, corner1.y, corner2.y);
	}
	static fromCenter(centerX: number, centerY: number, width: number, height: number) {
		return Rectangle.fromDimensions(centerX - width / 2, centerY - height / 2, width, height);
	}
	static square(x: number, y: number, size: number) {
		return Rectangle.fromDimensions(x, y, size, size);
	}
	static boundingBox(objects: (Vector | Rectangle)[]) {
		const left = Math.min(...objects.map(p => p.x));
		const right = Math.max(...objects.map(p => (p instanceof Vector ? p.x : p.right)));
		const top = Math.min(...objects.map(p => p.y));
		const bottom = Math.max(...objects.map(p => (p instanceof Vector ? p.y : p.bottom)));
		return Rectangle.fromBounds(left, right, top, bottom);
	}

	get x() {
		return this.left;
	}
	set x(x: number) {
		const originalX = this.left;
		this.left = x;
		this.right += (x - originalX);
	}
	get y() {
		return this.top;
	}
	set y(y: number) {
		const originalY = this.top;
		this.top = y;
		this.bottom += (y - originalY);
	}
	get width() {
		return this.right - this.left;
	}
	set width(width: number) {
		this.right = this.left + width;
	}
	get height() {
		return this.bottom - this.top;
	}
	set height(height: number) {
		this.bottom = this.top + height;
	}

	translate(offset: Vector) {
		return Rectangle.fromDimensions(this.x + offset.x, this.y + offset.y, this.width, this.height);
	}
	scale(amountX: number, amountY: number = amountX) {
		return Rectangle.fromDimensions(this.x * amountX, this.y * amountY, this.width * amountX, this.height * amountY);
	}
	reflectX(axisX: number) {
		return Rectangle.fromDimensions(
			axisX - (this.x - axisX) - this.width, this.y,
			this.width, this.height,
		);
	}
	reflectY(axisY: number) {
		return Rectangle.fromDimensions(
			this.x, axisY - (this.y - axisY) - this.height,
			this.width, this.height,
		);
	}
	intersects(rectangle: Rectangle) {
		return (
			this.right >= rectangle.left && this.left <= rectangle.right
			&& this.bottom >= rectangle.top && this.top <= rectangle.bottom
		);
	}
	interiorIntersects(rectangle: Rectangle) {
		return (
			this.right > rectangle.left && this.left < rectangle.right
			&& this.bottom > rectangle.top && this.top < rectangle.bottom
		);
	}
	contains(point: Vector) {
		return point.x >= this.x && point.x <= this.right && point.y >= this.y && point.y <= this.bottom;
	}
	area() {
		return this.width * this.height;
	}
	squares() {
		const squares = [];
		for(let x = this.x; x < this.x + this.width; x ++) {
			for(let y = this.y; y < this.y + this.height; y ++) {
				squares.push(new Vector(x, y));
			}
		}
		return squares;
	}
	center() {
		return new Vector(this.x + (this.width / 2), this.y + (this.height / 2));
	}
	distanceTo(point: Vector) {
		const distX = (point.x < this.x) ? this.x - point.x : (point.x > this.right ? point.x - this.right : 0);
		const distY = (point.y < this.y) ? this.y - point.y : (point.y > this.bottom ? point.y - this.bottom : 0);
		return Math.hypot(distX, distY);
	}
	distanceToRect(rect: Rectangle) {
		const distX = (rect.right < this.x) ? this.x - rect.right : (rect.x > this.right ? this.right - rect.x : 0);
		const distY = (rect.bottom < this.y) ? this.y - rect.bottom : (rect.y > this.bottom ? this.bottom - rect.y : 0);
		return Math.hypot(distX, distY);
	}
	extend(direction: Direction | "all", amount: number) {
		if(direction === "left") {
			return Rectangle.fromBounds(
				Math.min(this.left - amount, this.right), this.right,
				this.top, this.bottom,
			);
		}
		else if(direction === "right") {
			return Rectangle.fromBounds(
				this.left, Math.max(this.right + amount, this.left),
				this.top, this.bottom,
			);
		}
		else if(direction === "up") {
			return Rectangle.fromBounds(
				this.left, this.right,
				Math.min(this.top - amount, this.bottom), this.bottom,
			);
		}
		else if(direction === "down") {
			return Rectangle.fromBounds(
				this.left, this.right,
				this.top, Math.max(this.bottom + amount, this.top),
			);
		}
		else {
			return Rectangle.fromBounds(
				Math.min(this.right + amount, this.left - amount),
				Math.max(this.right + amount, this.left - amount),
				Math.min(this.bottom + amount, this.top - amount),
				Math.max(this.bottom + amount, this.top - amount),
			);
		}
	}

	getEdgeSquares(direction: "left" | "right" | "top" | "bottom") {
		const squares = [];
		if(direction === "left" || direction === "right") {
			for(let y = this.y; y < this.y + this.height; y ++) {
				squares.push(new Vector(direction === "left" ? this.x : this.x + this.width - 1, y));
			}
		}
		else {
			for(let x = this.x; x < this.x + this.width; x ++) {
				squares.push(new Vector(x, direction === "top" ? this.y : this.y + this.height - 1));
			}
		}
		return squares;
	}
	getCorner(corner: Diagonal | "top-left" | "top-right" | "bottom-left" | "bottom-right") {
		const left = (corner === "top-left" || corner === "bottom-left" || corner === "up-left" || corner === "down-left");
		const top = (corner === "top-left" || corner === "top-right" || corner === "up-left" || corner === "up-right");
		return new Vector(
			left ? this.x : this.x + this.width,
			top ? this.y : this.y + this.height,
		);
	}
	getCorners() {
		return Directions.DIAGONALS.map(d => this.getCorner(d));
	}
	intersections(rect: Rectangle) {
		const intersections = [
			new Vector(this.left, rect.top),
			new Vector(this.left, rect.bottom),
			new Vector(this.right, rect.top),
			new Vector(this.right, rect.bottom),

			new Vector(rect.left, this.top),
			new Vector(rect.left, this.bottom),
			new Vector(rect.right, this.top),
			new Vector(rect.right, this.bottom),
		].filter(p => this.contains(p) && rect.contains(p));
		return [...new HashSet(intersections)];
	}
	edgeCenter(direction: Direction) {
		if(direction === "up") {
			return new Vector(this.x + this.width / 2, this.y);
		}
		if(direction === "down") {
			return new Vector(this.x + this.width / 2, this.y + this.height);
		}
		if(direction === "left") {
			return new Vector(this.x, this.y + this.height / 2);
		}
		return new Vector(this.x + this.width, this.y + this.height / 2);
	}
	collisionDirection(collidingRect: Rectangle): Direction {
		const leftOverlap = collidingRect.right - this.left;
		const rightOverlap = this.right - collidingRect.left;
		const topOverlap = collidingRect.bottom - this.top;
		const bottomOverlap = this.bottom - collidingRect.top;

		const minOverlap = Math.min(leftOverlap, rightOverlap, topOverlap, bottomOverlap);
		if(minOverlap === leftOverlap) { return "left"; }
		else if(minOverlap === rightOverlap) { return "right"; }
		else if(minOverlap === topOverlap) { return "up"; }
		else { return "down"; }
	}

	isInfinite() {
		return this.width === Infinity || this.height === Infinity;
	}
}
