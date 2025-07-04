import { Rectangle } from "./geometry/Rectangle.mjs";
import { Vector } from "./geometry/Vector.mjs";
import { Utils } from "./Utils.mjs";

export class Grid<T> {
	defaultValue: T;
	valuesMap: Map<string, T>;

	constructor(defaultValue: T) {
		this.defaultValue = defaultValue;
		this.valuesMap = new Map();
	}
	static fromPositions<T>(defaultValue: T, nondefaultValue: T, positions: Vector[]) {
		const grid = new Grid<T>(defaultValue);
		for(const position of positions) {
			grid.set(position, nondefaultValue);
		}
		return grid;
	}

	get(position: Vector): T;
	get(x: number, y: number): T;
	get(arg1: Vector | number, arg2?: number) {
		if(typeof arg1 === "number") {
			const [x, y] = [arg1, arg2] as [number, number];
			return this.get(new Vector(x, y));
		}
		const [position] = [arg1];
		const string = position.toString();
		if(position.x % 1 !== 0 || position.y % 1 !== 0) {
			throw new Error(`Cannot get value from grid; expected the coordinates to be integers, but instead got ${position.toString()}`);
		}
		if(this.valuesMap.has(string)) {
			return this.valuesMap.get(string);
		}
		else { return this.defaultValue; }
	}
	set(position: Vector, value: T): Grid<T>;
	set(x: number, y: number, value: T): Grid<T>;
	set(arg1: number | Vector, arg2: number | T, arg3?: T) {
		if(typeof arg1 === "number") {
			const [x, y, value] = [arg1, arg2, arg3] as [number, number, T];
			this.set(new Vector(x, y), value);
		}
		else {
			const [position, value] = [arg1, arg2] as [Vector, T];
			if(position.x % 1 !== 0 || position.y % 1 !== 0) {
				throw new Error(`Cannot set value in grid; expected the coordinates to be integers, but instead got ${position.toString()}`);
			}
			if(value === this.defaultValue) {
				this.valuesMap.delete(position.toString());
			}
			else {
				this.valuesMap.set(position.toString(), value);
			}
		}
		return this;
	}
	has(position: Vector) {
		return this.valuesMap.has(position.toString());
	}

	*entries(): Generator<[T, Vector]> {
		for(const [key, value] of this.valuesMap.entries()) {
			yield [value, Vector.parse(key)];
		}
	}
	*positions() {
		for(const key of this.valuesMap.keys()) {
			yield Vector.parse(key);
		}
	}
	*values() {
		yield* this.valuesMap.values();
	}
	numValues() {
		return this.valuesMap.size;
	}
	map<S>(callback: (value: T, position?: Vector) => S) {
		const grid = new Grid(callback(this.defaultValue));
		for(const [value, position] of this.entries()) {
			grid.set(position, callback(value, position));
		}
		return grid;
	}
	equals(grid: Grid<T>, equals: (v1: T, v2: T) => boolean = (v1, v2) => v1 === v2) {
		if(!equals(this.defaultValue, grid.defaultValue)) {
			return false;
		}
		const thisValues = Utils.filterMap(this.valuesMap, (k, v) => !equals(v, this.defaultValue));
		const gridValues = Utils.filterMap(grid.valuesMap, (k, v) => !equals(v, grid.defaultValue));
		return Utils.mapEquals(thisValues, gridValues, equals);
	}

	fillRect(rect: Rectangle, value: T) {
		for(let x = Math.floor(rect.x); x < Math.ceil(rect.x + rect.width); x ++) {
			for(let y = Math.floor(rect.y); y < Math.ceil(rect.y + rect.height); y ++) {
				this.set(x, y, value);
			}
		}
	}
	translate(offset: Vector) {
		const grid = new Grid(this.defaultValue);
		for(const [entry, position] of this.entries()) {
			grid.set(position.add(offset), entry);
		}
		return grid;
	}

	boundingBox() {
		const positions = [...this.entries()]
			.filter(([value, position]) => value !== this.defaultValue)
			.map(([value, position]) => position);
		const left = Math.min(...positions.map(v => v.x));
		const right = Math.max(...positions.map(v => v.x)) + 1;
		const top = Math.min(...positions.map(v => v.y));
		const bottom = Math.max(...positions.map(v => v.y)) + 1;
		return Rectangle.fromBounds(left, right, top, bottom);
	}
}
