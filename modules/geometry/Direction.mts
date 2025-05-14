export type Direction = (typeof Directions.DIRECTIONS)[number];
export type Diagonal = (typeof Directions.DIAGONALS)[number];

export class Directions {
	static DIRECTIONS = ["left", "right", "up", "down"] as const;
	static DIAGONALS = ["up-left", "up-right", "down-left", "down-right"] as const;

	static opposite(direction: Direction) {
		if(direction === "left") { return "right"; }
		else if(direction === "right") { return "left"; }
		else if(direction === "up") { return "down"; }
		else if(direction === "down") { return "up"; }
		else { const _: never = direction; throw new Error(); }
	}
	static isHorizontal(direction: Direction) {
		return direction === "left" || direction === "right";
	}
	static isVertical(direction: Direction) {
		return direction === "up" || direction === "down";
	}
	static isDirection(value: unknown): value is Direction {
		return Directions.DIRECTIONS.some(v => v === value);
	}
	static rotateClockwise(direction: Direction) {
		if(direction === "left") { return "up"; }
		else if(direction === "up") { return "right"; }
		else if(direction === "right") { return "down"; }
		else if(direction === "down") { return "left"; }
		else { const _: never = direction; throw new Error(); }
	}
	static rotateCounterclockwise(direction: Direction) {
		if(direction === "left") { return "down"; }
		else if(direction === "down") { return "right"; }
		else if(direction === "right") { return "up"; }
		else if(direction === "up") { return "left"; }
		else { const _: never = direction; throw new Error(); }
	}
	static reflectX(direction: Direction) {
		if(direction === "left") { return "right"; }
		if(direction === "right") { return "left"; }
		return direction;
	}
	static angle(direction: Direction | Diagonal) {
		if(direction === "right") { return 0; }
		else if(direction === "up-right") { return Math.PI / 4; }
		else if(direction === "up") { return Math.PI / 2; }
		else if(direction === "up-left") { return 3 * Math.PI / 4; }
		else if(direction === "left") { return Math.PI; }
		else if(direction === "down-left") { return 5 * Math.PI / 4; }
		else if(direction === "down") { return Math.PI * 3/2; }
		else { return 7 * Math.PI / 4; }
	}
};
