import { assert } from "chai";
import { describe, it } from "mocha";
import { MathUtils } from "../../math/MathUtils.mjs";

describe("MathUtils.isPrime", () => {
	it("returns false when the number is 0", () => {
		assert.isFalse(MathUtils.isPrime(0));
	});
	it("returns false when the number is negative", () => {
		assert.isFalse(MathUtils.isPrime(-2));
	});
	it("returns false when the number is not an integer", () => {
		assert.isFalse(MathUtils.isPrime(1.2));
	});
	it("works for numbers 1-10", () => {
		assert.isFalse(MathUtils.isPrime(1));
		assert.isTrue(MathUtils.isPrime(2));
		assert.isTrue(MathUtils.isPrime(3));
		assert.isFalse(MathUtils.isPrime(4));
		assert.isTrue(MathUtils.isPrime(5));
		assert.isFalse(MathUtils.isPrime(6));
		assert.isTrue(MathUtils.isPrime(7));
		assert.isFalse(MathUtils.isPrime(8));
		assert.isFalse(MathUtils.isPrime(9));
		assert.isFalse(MathUtils.isPrime(10));
	});
});
describe("MathUtils.generalizedModulo", () => {
	it("returns the same result as the % operator when the input is nonnegative", () => {
		assert.equal(MathUtils.generalizedModulo(10, 5), 0);
		assert.equal(MathUtils.generalizedModulo(11, 5), 1);
		assert.equal(MathUtils.generalizedModulo(12, 5), 2);
	});
	it("returns the result in the range [0, modulo) even if the input is negative", () => {
		assert.equal(MathUtils.generalizedModulo(-1, 3), 2);

		assert.equal(MathUtils.generalizedModulo(-10, 3), 2);
		assert.equal(MathUtils.generalizedModulo(-11, 3), 1);
		assert.equal(MathUtils.generalizedModulo(-12, 3), 0);
	});
});
describe("MathUtils.modularExponentiate", () => {
	it("works when the exponent is 0", () => {
		const result = MathUtils.modularExponentiate(123, 0, 100);
		assert.equal(result, 1);
	});
	it("works when the exponent is 1", () => {
		const result = MathUtils.modularExponentiate(123, 1, 100);
		assert.equal(result, 23);
	});
	it("works when the exponent is a power of 2", () => {
		const result = MathUtils.modularExponentiate(3, 16, 10000);
		assert.equal(result, 6721);
	});
	it("works when the exponent is not a power of 2", () => {
		const result = MathUtils.modularExponentiate(3, 12, 10000);
		assert.equal(result, 1441);
	});
});
describe("MathUtils.bezoutCoefficients", () => {
	const testCases = [
		[5, 7],
		[2, 3],
		[4, 3],
		[10, 7],
		[5, 1],

		[5, -7],
		[-2, 3],
		[-4, -3],
	];
	for(const [num1, num2] of testCases) {
		it(`returns the coefficients (s, t) such that ${num1}s + ${num2}t = 1, when given input (${num1}, ${num2})`, () => {
			const [coef1, coef2] = MathUtils.bezoutCoefficients(num1, num2);
			assert.equal(coef1 % 1, 0);
			assert.equal(coef2 % 1, 0);
			assert.equal(coef1 * num1 + coef2 * num2, 1);
		});
	}
});
describe("MathUtils.gcd", () => {
	it("returns the greatest common divisor of the two numbers", () => {
		assert.equal(MathUtils.gcd(36, 84), 12);
	});
	it("works for another test case", () => {
		assert.equal(MathUtils.gcd(24, 14), 2);
	});
	it("returns the absolute value of the other input when one of the inputs is 0", () => {
		const result1 = MathUtils.gcd(0, -5);
		assert.equal(result1, 5);
		const result2 = MathUtils.gcd(-5, 0);
		assert.equal(result2, 5);
		const result3 = MathUtils.gcd(0, 0);
		assert.equal(result3, 0);
	});
});
describe("MathUtils.factorial", () => {
	it("correctly calculates factorials", () => {
		const result = MathUtils.factorial(4);
		assert.equal(result, 24);
	});
});
describe("MathUtils.factors", () => {
	it("returns a list of the distinct prime factors of the number, in increasing order", () => {
		const factors = MathUtils.factors(20);
		assert.deepEqual(factors, [2, 5]);
	});
	it("works for a prime number", () => {
		const factors = MathUtils.factors(7);
		assert.deepEqual(factors, [7]);
	});
});
describe("MathUtils.factorsWithMultiplicity", () => {
	it("returns the prime factors of the number, counted with multiplicity", () => {
		const factors = MathUtils.factorsWithMultiplicity(20);
		assert.deepEqual(factors, [2, 2, 5]);
	});
});
describe("MathUtils.divisors", () => {
	it("returns a list of all the divisors of the number, in increasing order", () => {
		const divisors = MathUtils.divisors(36);
		assert.deepEqual(divisors, [1, 2, 3, 4, 6, 9, 12, 18, 36]);
	});
});
describe("MathUtils.properDivisors", () => {
	it("returns a list of all the proper divisors of the number (i.e. excluding 1 and the number itself), in increasing order", () => {
		const properDivisors = MathUtils.properDivisors(36);
		assert.deepEqual(properDivisors, [2, 3, 4, 6, 9, 12, 18]);
	});
});
describe("MathUtils.factorize", () => {
	it("returns a map that gives the exponent on each prime factor", () => {
		const factorization = MathUtils.factorize(12);
		assert.deepEqual(factorization, new Map([
			[2, 2],
			[3, 1],
		]));
	});
});
describe("MathUtils.totient", () => {
	it("computes the number of numbers k less than the given number n such that gcd(n, k) = 1", () => {
		const result = MathUtils.totient(15);
		assert.equal(result, 8);
	});
});
describe("MathUtils.digits", () => {
	it("returns the digits of the given integer in order", () => {
		assert.deepEqual(MathUtils.digits(123456), [1, 2, 3, 4, 5, 6]);
	});
});
describe("MathUtils.binomial", () => {
	it("correctly calculates binomial coefficients using the formula n!/(k! * (n-k)!)", () => {
		const result = MathUtils.binomial(10, 4);
		assert.equal(result, 210);
	});
});
describe("MathUtils.fromDigits", () => {
	it("constructs a number from the given list of digits", () => {
		const num = MathUtils.fromDigits([1, 7, 2, 9]);
		assert.equal(num, 1729);
	});
});
describe("MathUtils.unfactorize", () => {
	it("can multiply out the factorization when given a Map with primes and exponents", () => {
		const result = MathUtils.unfactorize(new Map([[2, 1], [3, 4]]));
		assert.equal(result, 162); // 2^1 * 3^4
	});
	it("can multiply out the factorization when given two arrays containing primes and exponents", () => {
		const result = MathUtils.unfactorize([2, 3], [1, 4]);
		assert.equal(result, 162); // 2^1 * 3^4
	});
});
