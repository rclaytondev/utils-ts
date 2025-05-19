import { Direction } from "./Direction.mjs";
import { MathUtils } from "../math/MathUtils.mjs";

export class Vector {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	toString() {
		return `(${this.x},${this.y})`;
	}
	static parse(str: unknown) {
		if(!(typeof str === "string")) {
			throw new Error("Cannot parse vector; input was not a string.");
		}
		const PARSE_ORDERED_PAIR = /\((-?\d+(?:.\d+)?), ?(-?\d+(?:.\d+)?)\)/;
		const results = str.match(PARSE_ORDERED_PAIR);
		if(results == null || results.length !== 3) {
			throw new Error(`Cannot parse vector from string "${str}"`);
		}
		const [_, num1, num2] = results;
		return new Vector(Number.parseFloat(num1), Number.parseFloat(num2));
	}
	static unit(direction: Direction) {
		if(direction === "left") {
			return new Vector(-1, 0);
		}
		else if(direction === "right") {
			return new Vector(1, 0);
		}
		else if(direction === "up") {
			return new Vector(0, -1);
		}
		else { return new Vector(0, 1); }
	}

	equals(vector: Vector): boolean;
	equals(x: number, y: number): boolean;
	equals(vectorOrX: Vector | number, optionalY?: number) {
		if(vectorOrX instanceof Vector) {
			const vector = vectorOrX;
			return this.x === vector.x && this.y === vector.y;
		}
		else {
			const [x, y] = [vectorOrX, optionalY] as [number, number];
			return this.x === x && this.y === y;
		}
	}
	clone() {
		return new Vector(this.x, this.y);
	}

	add(vector: Vector): Vector;
	add(x: number, y: number): Vector;
	add(vectorOrX: Vector | number, optionalY?: number) {
		if(vectorOrX instanceof Vector) {
			const vector = vectorOrX;
			return new Vector(this.x + vector.x, this.y + vector.y);
		}
		else {
			const [x, y] = [vectorOrX, optionalY] as [number, number];
			return new Vector(this.x + x, this.y + y);
		}
	}
	subtract(vector: Vector): Vector;
	subtract(x: number, y: number): Vector;
	subtract(vectorOrX: Vector | number, optionalY?: number) {
		if(vectorOrX instanceof Vector) {
			const vector = vectorOrX;
			return new Vector(this.x - vector.x, this.y - vector.y);
		}
		else {
			const [x, y] = [vectorOrX, optionalY] as [number, number];
			return new Vector(this.x - x, this.y - y);
		}
	}
	multiply(num: number) {
		return new Vector(this.x * num, this.y * num);
	}
	divide(num: number) {
		return this.multiply(1 / num);
	}
	adjacentVectors() {
		return [
			new Vector(this.x - 1, this.y - 1),
			new Vector(this.x, this.y - 1),
			new Vector(this.x + 1, this.y - 1),
			new Vector(this.x - 1, this.y),
			new Vector(this.x + 1, this.y),
			new Vector(this.x - 1, this.y + 1),
			new Vector(this.x, this.y + 1),
			new Vector(this.x + 1, this.y + 1),
		];
	}
	isOrthogonallyAdjacentTo(vector: Vector) {
		return (
			(vector.x === this.x && Math.abs(vector.y - this.y) === 1) ||
			(vector.y === this.y && Math.abs(vector.x - this.x) === 1)
		);
	}
	static dist(vector1: Vector, vector2: Vector) {
		return Math.sqrt((vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2);
	}
	magnitude() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
	normalize() {
		return this.divide(this.magnitude());
	}
	rotate(angle: number) {
		angle = MathUtils.toRadians(angle);
		const currentAngle = Math.atan2(this.y, this.x);
		const newAngle = currentAngle + angle;
		return new Vector(Math.cos(newAngle) * this.magnitude(), Math.sin(newAngle) * this.magnitude());
	}
	angle() {
		return Math.atan2(this.y, this.x);
	}
	floor() {
		return new Vector(Math.floor(this.x), Math.floor(this.y));
	}
	ceil() {
		return new Vector(Math.ceil(this.x), Math.ceil(this.y));
	}
	round() {
		return new Vector(Math.round(this.x), Math.round(this.y));
	}
}
