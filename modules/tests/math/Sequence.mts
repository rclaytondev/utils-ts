import { assert } from "chai";
import { describe, it } from "mocha";
import { Sequence } from "../../math/Sequence.mjs";

describe("Sequence.getTerm", () => {
	it("can return the nth term of a sequence given by an explicit formula, and uses memoization", () => {
		let timesCalled = 0;
		const sequence = new Sequence(n => {
			timesCalled ++;
			return n * n;
		});
		assert.equal(sequence.getTerm(5), 25);
		assert.equal(sequence.getTerm(5), 25);
		assert.equal(sequence.getTerm(5), 25);
		assert.equal(timesCalled, 1);
	});
	it("can return the nth term of a sequence given by a generator function, and uses memoization", () => {
		let timesYielded = 0;
		const powersOf2 = new Sequence(function*() {
			let num = 1;
			while(true) {
				timesYielded ++;
				yield num;
				num *= 2;
			}
		});
		assert.equal(powersOf2.getTerm(5), 32);
		assert.equal(powersOf2.getTerm(5), 32);
		assert.equal(powersOf2.getTerm(5), 32);
		assert.equal(timesYielded, 6);

		assert.equal(powersOf2.getTerm(7), 128);
		assert.equal(powersOf2.getTerm(7), 128);
		assert.equal(powersOf2.getTerm(7), 128);
		assert.equal(timesYielded, 8);

		assert.equal(powersOf2.getTerm(2), 4);
		assert.equal(powersOf2.getTerm(2), 4);
		assert.equal(powersOf2.getTerm(2), 4);
		assert.equal(timesYielded, 8);
	});
});
describe("Sequence iterator", () => {
	it("yields the terms in the sequence", () => {
		const sequence = new Sequence(n => n ** 2); // 0, 1, 4, 9, ...
		const terms = [];
		for(const term of sequence) {
			if(terms.length >= 5) { break; }
			terms.push(term);
		}
		assert.deepEqual(terms, [0, 1, 4, 9, 16]);
	});
});
describe("Sequence.entriesBelow", () => {
	it("can yield all the terms and indices such that the term is less than or equal to the given maximum", () => {
		const sequence = new Sequence(n => 2 ** n); // 1, 2, 4, 8, ...
		const entries = [...sequence.entriesBelow(16, "inclusive")];
		assert.deepEqual(entries, [
			[0, 1],
			[1, 2],
			[2, 4],
			[3, 8],
			[4, 16],
		]);
	});
	it("can yield all the terms and indices such that the term is strictly less than the given maximum", () => {
		const sequence = new Sequence(n => 2 ** n); // 1, 2, 4, 8, ...
		const entries = [...sequence.entriesBelow(16, "exclusive")];
		assert.deepEqual(entries, [
			[0, 1],
			[1, 2],
			[2, 4],
			[3, 8],
		]);
	});
});
describe("Sequence.entriesBetween", () => {
	it("works when both modes are inclusive", () => {
		const sequence = new Sequence(n => n ** 2); // 0, 1, 4, 9, ...
		const entries = [...sequence.entriesBetween(9, 25, "inclusive", "inclusive")];
		assert.deepEqual(entries, [
			[3, 9],
			[4, 16],
			[5, 25],
		]);
	});
	it("works when lowerMode is inclusive and upperMode is exclusive", () => {
		const sequence = new Sequence(n => n ** 2); // 0, 1, 4, 9, ...
		const entries = [...sequence.entriesBetween(9, 25, "inclusive", "exclusive")];
		assert.deepEqual(entries, [
			[3, 9],
			[4, 16],
		]);
	});
	it("works when lowerMode is exclusive and upperMode is inclusive", () => {
		const sequence = new Sequence(n => n ** 2); // 0, 1, 4, 9, ...
		const entries = [...sequence.entriesBetween(9, 25, "exclusive", "inclusive")];
		assert.deepEqual(entries, [
			[4, 16],
			[5, 25],
		]);
	});
	it("works when both modes are exclusive", () => {
		const sequence = new Sequence(n => n ** 2); // 0, 1, 4, 9, ...
		const entries = [...sequence.entriesBetween(9, 25, "exclusive", "exclusive")];
		assert.deepEqual(entries, [
			[4, 16],
		]);
	});
});
describe("Sequence.setsWithSum", () => {
	it("returns all the sets of elements of the sequence that add up to the given value, sorted in ascending order", () => {
		const sequence = new Sequence(n => n);
		const sets = [...sequence.setsWithSum(6, 2)];
		assert.sameDeepMembers(sets, [
			[0, 6],
			[1, 5],
			[2, 4],
		]);
	});
	it("returns sets of any size when the setSize parameter is omitted", () => {
		const sets = [...Sequence.POSITIVE_INTEGERS.setsWithSum(4)];
		assert.sameDeepMembers(sets, [
			[4],
			[1, 3],
		]);
	});
});
describe("Sequence.multisetsWithSum", () => {
	it("can return the set of all sets of 2 positive integers that sum to 6", () => {
		const POSITIVE_INTEGERS = new Sequence(n => n + 1);
		const sets = [...POSITIVE_INTEGERS.multisetsWithSum(6, 2)];
		assert.sameDeepMembers(sets, [
			[1, 5],
			[2, 4],
			[3, 3],
		]);
	});
	it("returns multisets of any size when the setSize parameter is omitted", () => {
		const sets = [...Sequence.POSITIVE_INTEGERS.multisetsWithSum(4)];
		assert.sameDeepMembers(sets, [
			[4],
			[1, 3],
			[2, 2],
			[1, 1, 2],
			[1, 1, 1, 1],
		]);
	});
});
describe("Sequence.numMultisetsWithSum", () => {
	it("can return the number of sets of 2 positive integers that sum to 6", () => {
		const result = Sequence.POSITIVE_INTEGERS.numMultisetsWithSum(6, 2);
		assert.equal(result, 3);
	});
	it("returns multisets of any size when the setSize parameter is omitted", () => {
		const result = Sequence.POSITIVE_INTEGERS.numMultisetsWithSum(4);
		assert.equal(result, 5);
	});
});
describe("Sequence.includes", () => {
	it("returns whether or not the term is in the sequence, assuming the sequence is increasing", () => {
		const sequence = new Sequence(n => 2 ** n);
		assert.isTrue(sequence.includes(8));
		assert.isFalse(sequence.includes(9));
	});
});
describe("Sequence.filter", () => {
	it("returns the sequence consisting of all the numbers that satisfy the callback", () => {
		const sequence = Sequence.POSITIVE_INTEGERS.filter(n => n % 2 === 0);
		const terms = sequence.slice(0, 5);
		assert.sameOrderedMembers(terms, [2, 4, 6, 8, 10]);
	});
});

describe("Sequence.tuplesWithSum", () => {
	it("can yield a list of all tuples of a given size that have a given sum", () => {
		const tuples = [...Sequence.POSITIVE_INTEGERS.tuplesWithSum(5, 3)];
		assert.sameDeepMembers(tuples, [
			[1, 1, 3],
			[1, 2, 2],
			[1, 3, 1],

			[2, 1, 2],
			[2, 2, 1],

			[3, 1, 1],
		]);
	});
	it("can yield a list of all tuples that have a given sum and have no more elements than the given sum", () => {
		const tuples = [...Sequence.POSITIVE_INTEGERS.tuplesWithSum(5)];
		assert.sameDeepMembers(tuples, [
			[5],

			[1, 4],
			[2, 3],
			[3, 2],
			[4, 1],

			[1, 1, 3],
			[1, 2, 2],
			[1, 3, 1],
			[2, 1, 2],
			[2, 2, 1],
			[3, 1, 1],

			[2, 1, 1, 1],
			[1, 2, 1, 1],
			[1, 1, 2, 1],
			[1, 1, 1, 2],

			[1, 1, 1, 1, 1],
		]);
	});
});
describe("Sequence.PRIMES", () => {
	it("can generate a list of the primes up to 20", () => {
		const primes = Sequence.PRIMES.termsBelow(20);
		assert.sameOrderedMembers([...primes], [2, 3, 5, 7, 11, 13, 17, 19]);
	});
});
