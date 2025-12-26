import { assert } from "chai";
import { describe, it } from "mocha";
import { BigintMath } from "../../math/BigintMath.mjs";
import { ArrayUtils } from "../../core-extensions/ArrayUtils.mjs";

describe("BigintMath.gcd", () => {
	it("returns the greatest common divisor of the two numbers", () => {
		assert.equal(BigintMath.gcd(36n, 84n), 12n);
	});
	it("works for another test case", () => {
		assert.equal(BigintMath.gcd(24n, 14n), 2n);
	});
});
describe("BigintMath.divideCeil", () => {
	it("works when the number is evenly divisible", () => {
		assert.equal(BigintMath.divideCeil(15n, 5n), 3n);
	});
	it("rounds up when the number is not evenly divisible", () => {
		assert.equal(BigintMath.divideCeil(16n, 5n), 4n);
	});
});
describe("BigintMath.floorSqrt", () => {
	it("correctly computes floor(sqrt(n)) and works for very big numbers", () => {
		const num = 10n ** 15n;
		assert.equal(BigintMath.floorSqrt(num ** 2n), num);
		assert.equal(BigintMath.floorSqrt(num ** 2n + 1n), num);
		assert.equal(BigintMath.floorSqrt((num + 1n) ** 2n - 1n), num);
		assert.equal(BigintMath.floorSqrt((num + 1n) ** 2n), num + 1n);
	});
});
describe("BigintMath.isPrime", () => {
	it("correctly computes the list of prime numbers below 20", () => {
		const primes = ArrayUtils.range(1, 20).filter(n => BigintMath.isPrime(BigInt(n)));
		assert.sameOrderedMembers(primes, [2, 3, 5, 7, 11, 13, 17, 19]);
	});
});
describe("BigintMath.rangeSum", () => {
	it("returns the sum of the integers between min and max, inclusive", () => {
		const result = BigintMath.rangeSum(5n, 7n);
		assert.equal(result, 5n + 6n + 7n);
	});
	it("works when min and max are equal", () => {
		const result = BigintMath.rangeSum(7n, 7n);
		assert.equal(result, 7n);
	});
	it("returns 0 when min is greater than max", () => {
		const result = BigintMath.rangeSum(9n, 7n);
		assert.equal(result, 0n);
	});
});
describe("BigintMath.modularExponentiate", () => {
	it("works when the exponent is 0", () => {
		const result = BigintMath.modularExponentiate(123n, 0n, 100n);
		assert.equal(result, 1n);
	});
	it("works when the exponent is 1", () => {
		const result = BigintMath.modularExponentiate(123n, 1n, 100n);
		assert.equal(result, 23n);
	});
	it("works when the exponent is a power of 2", () => {
		const result = BigintMath.modularExponentiate(3n, 16n, 10000n);
		assert.equal(result, 6721n);
	});
	it("works when the exponent is not a power of 2", () => {
		const result = BigintMath.modularExponentiate(3n, 12n, 10000n);
		assert.equal(result, 1441n);
	});
});

describe("BigintMath.bezoutCoefficients", () => {
	const testCases = [
		[5n, 7n],
		[2n, 3n],
		[4n, 3n],
		[10n, 7n],
		[5n, 1n],

		[5n, -7n],
		[-2n, 3n],
		[-4n, -3n],
	];
	for(const [num1, num2] of testCases) {
		it(`returns the coefficients (s, t) such that ${num1}s + ${num2}t = 1, when given input (${num1}, ${num2})`, () => {
			const [coef1, coef2] = BigintMath.bezoutCoefficients(num1, num2);
			assert.equal(coef1 * num1 + coef2 * num2, 1n);
		});
	}
});
