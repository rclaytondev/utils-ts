import { describe, it } from "mocha";
import { Factorization } from "../../math/Factorization.mjs";
import { assert } from "chai";

describe("Factorization.factorial", () => {
	it("can compute the factorization of factorials", () => {
		const factorization = Factorization.factorial(5);
		assert.deepEqual(factorization.exponents, new Map([
			[2, 3],
			[3, 1],
			[5, 1]
		]));
	});
});

describe("Factorization.power", () => {
	it("can compute powers of Factorizations", () => {
		const factorization = new Factorization(new Map([ [2, 5], [3, 7] ]));
		const power = factorization.exponentiate(10);
		assert.deepEqual(power, new Factorization(new Map([ [2, 50], [3, 70] ])));
	});
});
