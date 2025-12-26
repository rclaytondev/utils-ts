import { BigRational } from "./BigRational.mjs";
import { MathUtils } from "./MathUtils.mjs";
import { Rational } from "./Rational.mjs";

export class Field<ElementType> {
	zero: ElementType;
	one: ElementType;
	add: (element1: ElementType, element2: ElementType) => ElementType;
	multiply: (element1: ElementType, element2: ElementType) => ElementType;
	opposite: (element: ElementType) => ElementType;
	inverse: (element: ElementType) => ElementType;
	areEqual: (element1: ElementType, element2: ElementType) => boolean;

	constructor(
		zero: ElementType,
		one: ElementType,
		add: (element1: ElementType, element2: ElementType) => ElementType,
		multiply: (element1: ElementType, element2: ElementType) => ElementType,
		opposite: (element: ElementType) => ElementType,
		inverse: (element: ElementType) => ElementType,
		areEqual: (element1: ElementType, element2: ElementType) => boolean = (a, b) => a === b,
	) {
		this.zero = zero;
		this.one = one;
		this.add = add;
		this.multiply = multiply;
		this.opposite = opposite;
		this.inverse = inverse;
		this.areEqual = areEqual;
	}

	subtract(element1: ElementType, element2: ElementType) {
		return this.add(element1, this.opposite(element2));
	}
	divide(element1: ElementType, element2: ElementType) {
		return this.multiply(element1, this.inverse(element2));
	}
	exponentiate(element: ElementType, exponent: number) {
		let result = this.one;
		for(let i = 0; i < Math.abs(exponent); i ++) {
			result = this.multiply(result, exponent > 0 ? element : this.inverse(element));
		}
		return result;
	}
	sum(...elements: ElementType[]) {
		let result = this.zero;
		for(const element of elements) {
			result = this.add(result, element);
		}
		return result;
	}
	product(...elements: ElementType[]) {
		let result = this.one;
		for(const element of elements) {
			result = this.multiply(result, element);
		}
		return result;
	}

	static integersModulo(modulo: number) {
		if(!MathUtils.isPrime(modulo)) {
			throw new Error(`Cannot construct the field of integers modulo ${modulo}: the result will not be a field since ${modulo} is not prime.`);
		}
		return new Field<number>(
			0, 1,
			(a, b) => (a + b) % modulo,
			(a, b) => (a * b) % modulo,
			num => (num === 0) ? num : modulo - num,
			num => MathUtils.modularInverse(num, modulo),
		);
	}
	static REALS = new Field<number>(
		0, 1,
		(a, b) => a + b,
		(a, b) => a * b,
		x => -x,
		x => 1/x,
	);
	static RATIONALS = new Field<Rational>(
		new Rational(0, 1),
		new Rational(1, 1),
		(a, b) => a.add(b),
		(a, b) => a.multiply(b),
		x => x.opposite(),
		x => x.inverse(),
		(a, b) => a.equals(b),
	);
	static BIG_RATIONALS = new Field<BigRational>(
		new BigRational(0, 1),
		new BigRational(1, 1),
		(a, b) => a.add(b),
		(a, b) => a.multiply(b),
		x => x.opposite(),
		x => x.inverse(),
		(a, b) => a.equals(b),
	);
}
