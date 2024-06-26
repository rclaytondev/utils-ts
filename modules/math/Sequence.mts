import { MathUtils } from "./MathUtils.mjs";

export class Sequence {
	/*
	Represents an increasing infinite sequence of numbers, indexed starting at 0.
	Some methods may not work properly or may loop forever if the sequence is not ascending, or if the sequence is eventually constant.
	*/

	private readonly unmemoizedTerms: (Generator<number, never>) | null;
	private readonly unmemoizedGetTerm: ((index: number) => number) | null;
	private readonly cachedTerms: Map<number, number> = new Map();

	constructor(func: (() => Generator<number, never>) | ((index: number) => number)) {
		const GeneratorFunction = Object.getPrototypeOf(function*() {}).constructor;
		if(func instanceof GeneratorFunction) {
			this.unmemoizedTerms = (func as () => Generator<number, never>)();
			this.unmemoizedGetTerm = null;
		}
		else {
			this.unmemoizedTerms = null;
			this.unmemoizedGetTerm = func as ((index: number) => number);
		}
	}

	getTerm(index: number) {
		if(this.cachedTerms.has(index)) {
			return this.cachedTerms.get(index)!;
		}
		else if(this.unmemoizedGetTerm) {
			const result = this.unmemoizedGetTerm(index);
			this.cachedTerms.set(index, result);
			return result;
		}
		else {
			while(!this.cachedTerms.has(index)) {
				const nextTerm = this.unmemoizedTerms!.next().value;
				this.cachedTerms.set(this.cachedTerms.size, nextTerm);
			}
			return this.cachedTerms.get(index)!;
		}
	}
	*entries() {
		for(let index = 0; index < Infinity; index ++) {
			yield [index, this.getTerm(index)];
		}
	}
	slice(startIndex: number, endIndex: number, startMode: "inclusive" | "exclusive" = "inclusive", endMode: "inclusive" | "exclusive" = "exclusive") {
		let result = [];
		for(let index = (startMode === "inclusive") ? startIndex : startIndex + 1; (endMode === "inclusive") ? (index <= endIndex) : (index < endIndex); index ++) {
			result.push(this.getTerm(index));
		}
		return result;
	}

	
	static POSITIVE_INTEGERS = new Sequence(n => n + 1);
	static PRIMES = new Sequence(function*() {
		let num = 2;
		while(true) {
			if(MathUtils.isPrime(num)) {
				yield num;
			}
			num ++;
		}
	});


	/* 
	-----------------------------------------------
	Methods that assume the sequence is increasing:
	-----------------------------------------------
	*/
	*termsBelow(upperBound: number, mode: "inclusive" | "exclusive" = "inclusive") {
		for(const [index, term] of this.entriesBelow(upperBound, mode)) {
			yield term;
		}
	}
	*entriesBelow(upperBound: number, mode: "inclusive" | "exclusive") {
		yield* this.entriesBetween(-Infinity, upperBound, "inclusive", mode);
	}
	*termsBetween(lowerBound: number, upperBound: number, lowerMode: "inclusive" | "exclusive" = "inclusive", upperMode: "inclusive" | "exclusive" = "exclusive") {
		for(const [index, term] of this.entriesBetween(lowerBound, upperBound, lowerMode, upperMode)) {
			yield term;
		}
	}
	*entriesBetween(lowerBound: number, upperBound: number, lowerMode: "inclusive" | "exclusive" = "inclusive", upperMode: "inclusive" | "exclusive" = "exclusive") {
		for(const [index, term] of this.entries()) {
			if((upperMode === "inclusive" && term > upperBound) || (upperMode === "exclusive" && term >= upperBound)) {
				return;
			}
			if((lowerMode === "inclusive" && term >= lowerBound) || (lowerMode === "exclusive" && term > lowerBound)) {
				yield [index, term];
			}
		}
	}

	/* 
	------------------------------------------------------------
	Methods that assume the sequence is positive and increasing:
	------------------------------------------------------------
	*/
	*setsWithSum(setSize: number, sum: number): Generator<number[]> {
		if(setSize === 0 && sum === 0) {
			yield [];
		}
		else if(setSize !== 0) {
			for(const [index, firstTerm] of this.entriesBelow(sum, "inclusive")) {
				for(const set of new Sequence(n => this.getTerm(n + index + 1)).setsWithSum(setSize - 1, sum - firstTerm)) {
					yield [firstTerm, ...set];
				}
			}
		}
	}
	*multisetsWithSum(setSize: number, sum: number): Generator<number[]> {
		if(setSize === 0 && sum === 0) {
			yield [];
		}
		else if(setSize !== 0) {
			for(const [index, firstTerm] of this.entriesBelow(sum, "inclusive")) {
				for(const set of new Sequence(n => this.getTerm(n + index)).multisetsWithSum(setSize - 1, sum - firstTerm)) {
					yield [firstTerm, ...set];
				}
			}
		}
	}
}
