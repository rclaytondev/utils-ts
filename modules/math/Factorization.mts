import { MapUtils } from "../core-extensions/MapUtils.mjs";
import { MathUtils } from "./MathUtils.mjs";
import { Sequence } from "./Sequence.mjs";

export class Factorization {
	readonly exponents: ReadonlyMap<number, number> = new Map();
	constructor(exponents: Map<number, number>) {
		this.exponents = MapUtils.filter(exponents, (p, e) => e !== 0);
	}

	static ONE = new Factorization(new Map());

	static fromPrime(prime: number) {
		return new Factorization(new Map([[prime, 1]]));
	}
	static fromPrimePower(prime: number, exponent: number) {
		return new Factorization(new Map([[prime, exponent]]));
	}
	static fromNumber(num: number) {
		return new Factorization(MathUtils.factorize(num));
	}

	static exponentInFactorial(num: number, prime: number) {
		let exponent = 0;
		for(let i = 1; prime ** i <= num; i ++) {
			exponent += Math.floor(num / (prime ** i));
		}
		return exponent;
	}
	static factorial(num: number): Factorization {
		const primes = [...Sequence.PRIMES.termsBelow(num, "inclusive")];
		const exponents = new Map<number, number>();
		for(const prime of primes) {
			exponents.set(prime, Factorization.exponentInFactorial(num, prime));
		}
		return new Factorization(exponents);
	}
	
	toNumber() {
		return MathUtils.unfactorize(this.exponents);
	}
	toString() {
		if(this.exponents.size === 0) {
			return "1";
		}
		const primePowers = [...this.exponents.entries()].sort((a, b) => a[0] - b[0]);
		const formatPrimePower = (p: number, e: number) => (e === 1) ? `${p}` : `${p}^${e}`;
		return primePowers.map(([p, e]) => formatPrimePower(p, e)).join(" * ");
	}
	
	factors() {
		return [...this.exponents.keys()];
	}

	multiply(factorization: Factorization) {
		const primes = new Set([...this.exponents.keys(), ...factorization.exponents.keys()]);
		return new Factorization(new Map([...primes].map(p =>
			[p, (this.exponents.get(p) ?? 0) + (factorization.exponents.get(p) ?? 0)]
		)));
	}
	exponentiate(power: number) {
		const exponents = new Map<number, number>();
		for(const [prime, exponent] of this.exponents) {
			exponents.set(prime, exponent * power);
		}
		return new Factorization(exponents);
	}
}
