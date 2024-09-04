import { Vector } from "./geometry/Vector.mjs";

export class Table<T> {
	rows: T[][];
	constructor(rows: T[][]) {
		this.rows = rows;
	}

	get width() {
		return this.rows[0].length;
	}
	get height() {
		return this.rows.length;
	}


	*entries() {
		for(let y = 0; y < this.height; y ++) {
			for(let x = 0; x < this.width; x ++) {
				yield [x, y, this.rows[y][x]];
			}
		}
	}
	*[Symbol.iterator]() {
		for(let y = 0; y < this.height; y ++) {
			for(let x = 0; x < this.width; x ++) {
				yield this.rows[y][x];
			}
		}
	}
	slice(x: number, y: number, width: number, height: number) {
		width = Math.min(width, this.width - x);
		height = Math.min(height, this.height - y);
		const result: T[][] = [];
		for(let y2 = y; y2 < y + height; y2 ++) {
			result[y2 - y] = [];
			for(let x2 = x; x2 < x + width; x2 ++) {
				result[y2 - y][x2 - x] = this.rows[y2][x2];
			}
		}
		return new Table(result);
	}
	findEntry(callback: (value: T, x: number, y: number) => boolean): [number, number, T] | null {
		for(let y = 0; y < this.height; y ++) {
			for(let x = 0; x < this.width; x ++) {
				if(callback(this.rows[y][x], x, y)) {
					return [x, y, this.rows[y][x]];
				}
			}
		}
		return null;
	}
	findPosition(callback: (value: T, x: number, y: number) => boolean) {
		const entry = this.findEntry(callback);
		if(!entry) { return null; }
		return new Vector(entry[0], entry[1]);
	}
	includes(value: T) {
		for(const row of this.rows) {
			if(row.includes(value)) { return true; }
		}
		return false;
	}
	map<S>(callback: (value: T, x: number, y: number) => S) {
		return new Table(this.rows.map((row, y) => row.map((value, x) => callback(value, x, y))));
	}

	getRow(y: number) {
		return this.rows[y];
	}
	getColumn(x: number) {
		let column = [];
		const height = this.height;
		for(let y = 0; y < height; y ++) {
			column.push(this.rows[y][x]);
		}
		return column;
	}
	columns() {
		const columns = [];
		for(let x = 0; x < this.width; x ++) {
			columns.push(this.getColumn(x));
		}
		return columns;
	}

	copy() {
		return new Table(this.rows.map(r => [...r]));
	}
	copyAndSet(x: number, y: number, value: T) {
		const result = this.copy();
		result.rows[y][x] = value;
		return result;
	}
	equals(table: Table<T>) {
		if(this.rows.length !== table.rows.length) { return false; }
		return this.rows.every((row, y) => row.length === table.rows[y].length && row.every((value, x) => value === table.rows[y][x]));
	}
}
