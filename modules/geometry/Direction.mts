export type Direction = (typeof Directions.DIRECTIONS)[number];

export class Directions {
	static DIRECTIONS = ["left", "right", "up", "down"] as const;

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
};
