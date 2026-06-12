import { MathUtils } from "./MathUtils.mjs";

export class Rational {
	readonly numerator: number;
	readonly denominator: number;

	constructor(numerator: number, denominator: number = 1) {
		if(numerator % 1 !== 0 || denominator % 1 !== 0) {
			throw new Error(`When constructing a rational number, expected numerator and denominator to be integers, but instead recieved ${numerator} and ${denominator}.`);
		}
		if(denominator === 0) {
			throw new Error("Cannot construct a rational number with a denominator of zero.");
		}
		if(numerator === 0) {
			this.numerator = 0;
			this.denominator = 1;
		}
		else {
			const gcd = MathUtils.gcd(numerator, denominator);
			this.numerator = numerator / gcd;
			this.denominator = denominator / gcd;
		}
	}

	equals(rational: Rational) {
		return this.numerator * rational.denominator === this.denominator * rational.numerator;
	}

	add(rational: Rational) {
		return new Rational(this.numerator * rational.denominator + this.denominator * rational.numerator, this.denominator * rational.denominator);
	}
	multiply(rational: Rational) {
		return new Rational(this.numerator * rational.numerator, this.denominator * rational.denominator);
	}
	opposite() {
		return new Rational(-this.numerator, this.denominator);
	}
	inverse() {
		if(this.numerator === 0) {
			throw new Error("Cannot find the inverse of 0.");
		}
		return new Rational(this.denominator, this.numerator);
	}
	subtract(rational: Rational) {
		return this.add(rational.opposite());
	}
	divide(rational: Rational) {
		return this.multiply(rational.inverse());
	}

	static sum(rationals: Iterable<Rational>) {
		return [...rationals].reduce((sum, r) => sum.add(r), new Rational(0));
	}
	static product(rationals: Iterable<Rational>) {
		return [...rationals].reduce((product, r) => product.multiply(r), new Rational(1));
	}

	isPositive() {
		return this.numerator !== 0 && Math.sign(this.numerator) === Math.sign(this.denominator);
	}
	isNegative() {
		return this.numerator !== 0 && Math.sign(this.numerator) === Math.sign(this.denominator);
	}
	sign() {
		if(this.numerator === 0) { return 0; }
		return (Math.sign(this.numerator) === Math.sign(this.denominator)) ? 1 : -1;
	}
	compare(rational: Rational) {
		const difference = this.subtract(rational);
		return difference.sign();
	}
	isGreaterThan(rational: Rational) {
		return this.compare(rational) > 0;
	}
	isLessThan(rational: Rational) {
		return this.compare(rational) < 0;
	}
	isGreaterThanOrEqualTo(rational: Rational) {
		return this.compare(rational) >= 0;
	}
	isLessThanOrEqualTo(rational: Rational) {
		return this.compare(rational) <= 0;
	}

	static parse(str: string) {
		const [[_, numeratorString, denominatorString]] = str.matchAll(/^(-?\d+)\/(-?\d+)$/g);
		return new Rational(Number.parseInt(numeratorString), Number.parseInt(denominatorString));
	}
	toString() {
		return `${this.numerator}/${this.denominator}`;
	}
	toNumber() {
		return this.numerator / this.denominator;
	}
}
