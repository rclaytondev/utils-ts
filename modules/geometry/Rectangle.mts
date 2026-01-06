import { Direction } from "./Direction.mjs";
import { Vector } from "./Vector.mjs";

export class Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	static fromBounds(left: number, right: number, top: number, bottom: number) {
		return new Rectangle(Math.min(left, right), Math.min(top, bottom), Math.abs(right - left), Math.abs(bottom - top));
	}
	static fromOppositeCorners(corner1: Vector, corner2: Vector) {
		return Rectangle.fromBounds(corner1.x, corner2.x, corner1.y, corner2.y);
	}
	static fromCenter(centerX: number, centerY: number, width: number, height: number) {
		return new Rectangle(centerX - width / 2, centerY - height / 2, width, height);
	}
	static square(x: number, y: number, size: number) {
		return new Rectangle(x, y, size, size);
	}
	static boundingBox(points: Vector[]) {
		const left = Math.min(...points.map(p => p.x));
		const right = Math.max(...points.map(p => p.x));
		const top = Math.min(...points.map(p => p.y));
		const bottom = Math.max(...points.map(p => p.y));
		return Rectangle.fromBounds(left, right, top, bottom);
	}

	left() {
		return this.x;
	}
	right() {
		return this.x + this.width;
	}
	top() {
		return this.y;
	}
	bottom() {
		return this.y + this.height;
	}

	translate(offset: Vector) {
		return new Rectangle(this.x + offset.x, this.y + offset.y, this.width, this.height);
	}
	scale(amountX: number, amountY: number = amountX) {
		return new Rectangle(this.x * amountX, this.y * amountY, this.width * amountX, this.height * amountY);
	}
	intersects(rectangle: Rectangle) {
		return (
			this.x + this.width >= rectangle.x && this.x <= rectangle.x + rectangle.width &&
			this.y + this.height >= rectangle.y && this.y <= rectangle.y + rectangle.height
		);
	}
	contains(point: Vector) {
		return point.x >= this.x && point.x <= this.right() && point.y >= this.y && point.y <= this.bottom();
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
		const distX = (point.x < this.x) ? this.x - point.x : (point.x > this.right() ? point.x - this.right() : 0);
		const distY = (point.y < this.y) ? this.y - point.y : (point.y > this.bottom() ? point.y - this.bottom() : 0);
		return Math.hypot(distX, distY);
	}
	extend(direction: Direction | "all", amount: number) {
		if(direction === "left") {
			return Rectangle.fromBounds(
				Math.min(this.left() - amount, this.right()), this.right(),
				this.top(), this.bottom(),
			);
		}
		else if(direction === "right") {
			return Rectangle.fromBounds(
				this.left(), Math.max(this.right() + amount, this.left()),
				this.top(), this.bottom(),
			);
		}
		else if(direction === "up") {
			return Rectangle.fromBounds(
				this.left(), this.right(),
				Math.min(this.top() - amount, this.bottom()), this.bottom(),
			);
		}
		else if(direction === "down") {
			return Rectangle.fromBounds(
				this.left(), this.right(),
				this.top(), Math.max(this.bottom() + amount, this.top()),
			);
		}
		else {
			return Rectangle.fromBounds(
				Math.min(this.right() + amount, this.left() - amount),
				Math.max(this.right() + amount, this.left() - amount),
				Math.min(this.bottom() + amount, this.top() - amount),
				Math.max(this.bottom() + amount, this.top() - amount),
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
	getCorner(corner: "top-left" | "top-right" | "bottom-left" | "bottom-right") {
		return new Vector(
			(corner === "top-left" || corner === "bottom-left") ? this.x : this.x + this.width,
			(corner === "top-left" || corner === "top-right") ? this.y : this.y + this.height,
		);
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
		const leftOverlap = collidingRect.right() - this.left();
		const rightOverlap = this.right() - collidingRect.left();
		const topOverlap = collidingRect.bottom() - this.top();
		const bottomOverlap = this.bottom() - collidingRect.top();

		const minOverlap = Math.min(leftOverlap, rightOverlap, topOverlap, bottomOverlap);
		if(minOverlap === leftOverlap) { return "left"; }
		else if(minOverlap === rightOverlap) { return "right"; }
		else if(minOverlap === topOverlap) { return "up"; }
		else { return "down"; }
	}
}
