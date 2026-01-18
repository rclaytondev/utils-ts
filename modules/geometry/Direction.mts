export type Direction = (typeof Directions.DIRECTIONS)[number];
export type Diagonal = (typeof Directions.DIAGONALS)[number];

export class Directions {
	static DIRECTIONS = ["left", "right", "up", "down"] as const;
	static DIAGONALS = ["up-left", "up-right", "down-left", "down-right"] as const;

	static isDirection(value: unknown): value is Direction {
		return (Directions.DIRECTIONS as readonly unknown[]).includes(value);
	}
	static isDiagonal(value: unknown): value is Diagonal {
		return (Directions.DIAGONALS as readonly unknown[]).includes(value);
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
		"down": "up",
		"up-left": "down-right",
		"up-right": "down-left",
		"down-left": "up-right",
		"down-right": "up-left",
	} as const;
	static rotateClockwise = {
		"left": "up",
		"up": "right",
		"right": "down",
		"down": "left",
		"up-left": "up-right",
		"up-right": "down-right",
		"down-right": "down-left",
		"down-left": "up-left",
	} as const;
	static rotateCounterclockwise = {
		"left": "down",
		"down": "right",
		"right": "up",
		"up": "left",
		"up-left": "down-left",
		"down-left": "down-right",
		"down-right": "up-right",
		"up-right": "up-left",
	} as const;
	static rotateClockwise45 = {
		"right": "down-right",
		"down-right": "down",
		"down": "down-left",
		"down-left": "left",
		"left": "up-left",
		"up-left": "up",
		"up": "up-right",
		"up-right": "right",
	} as const;
	static rotateCounterclockwise45 = {
		"right": "up-right",
		"up-right": "up",
		"up": "up-left",
		"up-left": "left",
		"left": "down-left",
		"down-left": "down",
		"down": "down-right",
		"down-right": "right",
	} as const;
	static rotate45 = {
		"clockwise": Directions.rotateClockwise45,
		"counterclockwise": Directions.rotateCounterclockwise45,
	} as const;
	static rotate = {
		"clockwise": Directions.rotateClockwise,
		"counterclockwise": Directions.rotateCounterclockwise,
	} as const;
	static reflectX = {
		"left": "right",
		"right": "left",
		"up": "up",
		"down": "down",
		"up-left": "up-right",
		"up-right": "up-left",
		"down-left": "down-right",
		"down-right": "down-left",
	} as const;
	static angle = {
		"right": 0,
		"up-right": Math.PI / 4,
		"up": Math.PI / 2,
		"up-left": 3 * Math.PI / 4,
		"left": Math.PI,
		"down-left": 5 * Math.PI / 4,
		"down": 3 * Math.PI / 2,
		"down-right": 7 * Math.PI / 4,
	} as const;

	static allByAngle(start: Direction | Diagonal, direction: "clockwise" | "counterclockwise") {
		const result: (Direction | Diagonal)[] = [];
		let current = start;
		for(let i = 0; i < 8; i ++) {
			result.push(current);
			current = Directions.rotate45[direction][current];
		}
		return result;
	}
	static nextIn(directions: (Direction | Diagonal)[], start: Direction | Diagonal, angularDirection: "clockwise" | "counterclockwise") {
		for(const direction of Directions.allByAngle(start, angularDirection)) {
			if(directions.includes(direction)) {
				return direction;
			}
		}
		throw new Error("Cannot get the next direction in an empty list.");
	}
};
