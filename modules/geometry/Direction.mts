export type Direction = (typeof Directions.DIRECTIONS)[number];
export type Diagonal = (typeof Directions.DIAGONALS)[number];

export class Directions {
	static DIRECTIONS = ["left", "right", "up", "down"] as const;
	static DIAGONALS = ["up-left", "up-right", "down-left", "down-right"] as const;

	static isDirection(value: unknown): value is Direction {
		return Directions.DIRECTIONS.some(v => v === value);
	}
	static isDiagonal(value: unknown): value is Diagonal {
		return Directions.DIAGONALS.includes(value as any);
	}
	static isHorizontal(value: unknown): value is "left" | "right" {
		return (value === "left" || value === "right");
	}
	static isVertical(value: unknown): value is "up" | "down" {
		return (value === "up" || value === "down");
	}

	static opposite = {
		"left": "right",
		"right": "left",
		"up": "down",
		"down": "up"
	} as const;
	static rotateClockwise = {
		"left": "up",
		"up": "right",
		"right": "down",
		"down": "left"
	} as const;
	static rotateCounterclockwise = {
		"left": "down",
		"down": "right",
		"right": "up",
		"up": "left"
	} as const;
	static reflectX = {
		"left": "right",
		"right": "left",
		"up": "up",
		"down": "down"
	} as const;
	static angle = {
		"right": 0,
		"up-right": Math.PI / 4,
		"up": Math.PI / 2,
		"up-left": 3 * Math.PI / 4,
		"left": Math.PI,
		"down-left": 5 * Math.PI / 4,
		"down": 3 * Math.PI / 2,
		"down-right": 7 * Math.PI / 4
	} as const;
};
