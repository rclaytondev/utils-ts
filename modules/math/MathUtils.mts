export class MathUtils {
	static sum(numbers: Iterable<number>) {
		return [...numbers].reduce((accumulator, value) => accumulator + value, 0);
	}
	static product(numbers: Iterable<number>) {
		return [...numbers].reduce((accumulator, value) => accumulator * value, 1);
	}
	static dist(num1: number, num2: number) {
		return Math.abs(num1 - num2);
	}
	static toRadians(degrees: number) {
		return degrees / 180 * Math.PI;
	}
	static toDegrees(radians: number) {
		return radians / Math.PI * 180;
	}
	static constrain(value: number, min: number, max: number) {
		[min, max] = [Math.min(min, max), Math.max(min, max)];
		if(value < min) { return min; }
		if(value > max) { return max; }
		return value;
	}
	static isPrime(n: number) {
		if(n <= 1 || n !== Math.floor(n)) {
			return false;
		}
		for(let k = 2; k <= Math.sqrt(n); k ++) {
			if(n % k === 0) { return false; }
		}
		return true;
	}
	static generalizedModulo(num: number, modulo: number) {
		if(modulo <= 0) {
			throw new Error("Cannot take the modulo by a negative number or 0.");
		}
		if(num >= 0) { return num % modulo; }
		return num + modulo * Math.ceil((-num / modulo));
	}
	static modularExponentiate(base: number, exponent: number, modulo: number): number {
		if(exponent === 0) { return 1; }
		if(exponent === 1) { return base % modulo; }
		const largestPowerOf2 = 2 ** Math.floor(Math.log2(exponent));
		const remainder = exponent - largestPowerOf2;
		if(remainder === 0) {
			const numIterations = Math.log2(exponent);
			let result = base;
			for(let i = 0; i < numIterations; i ++) {
				result = (result ** 2) % modulo;
			}
			return result;
		}
		else {
			const result1 = MathUtils.modularExponentiate(base, largestPowerOf2, modulo);
			const result2 = MathUtils.modularExponentiate(base, remainder, modulo);
			return (result1 * result2) % modulo;
		}
	}
	static gcd(num1: number, num2: number): number {
		[num1, num2] = [Math.max(Math.abs(num1), Math.abs(num2)), Math.min(Math.abs(num1), Math.abs(num2))];
		if(num2 === 0) { return num1; }
		if(num1 % num2 === 0) { return num2; }
		return MathUtils.gcd(num1 % num2, num2);
	}
	static lcm(num1: number, num2: number) {
		return num1 * num2 / MathUtils.gcd(num1, num2);
	}
	static bezoutCoefficients(num1: number, num2: number): [number, number] {
		if(num1 < 0 && num2 < 0) {
			const [coef1, coef2] = MathUtils.bezoutCoefficients(-num1, -num2);
			return [-coef1, -coef2];
		}
		else if(num1 < 0) {
			const [coef1, coef2] = MathUtils.bezoutCoefficients(-num1, num2);
			return [-coef1, coef2];
		}
		else if(num2 < 0) {
			const [coef1, coef2] = MathUtils.bezoutCoefficients(num1, -num2);
			return [coef1, -coef2];
		}
		if(num1 === 0 || num2 === 0) {
			throw new Error("Cannot calculate Bezout coefficients when either of the inputs are zero.");
		}
		if(num1 !== Math.floor(num1) || num2 !== Math.floor(num2)) {
			throw new Error("Calculating Bezout coefficients when either of the inputs are non-integers is not currently supported.");
		}
		if(num1 % num2 === 1) {
			return [1, -Math.floor(num1 / num2)];
		}
		else if(num2 % num1 === 1) {
			return [-Math.floor(num2 / num1), 1];
		}
		if(num1 < num2) {
			const [coef1, coef2] = MathUtils.bezoutCoefficients(num1, num2 % num1);
			return [coef1 - Math.floor(num2 / num1) * coef2, coef2];
		}
		else {
			const [coef1, coef2] = MathUtils.bezoutCoefficients(num1 % num2, num2);
			return [coef1, coef2 - Math.floor(num1 / num2) * coef1];
		}
	}
	static factorial(num: number) {
		if(num < 0 || num % 1 !== 0) {
			throw new Error(`Cannot calculate the factorial of a non-integer (${num}).`);
		}
		let result = 1;
		for(let i = 1; i <= num; i ++) {
			result *= i;
		}
		return result;
	}
	static factors(num: number) {
		return [...MathUtils.factorize(num).keys()];
	}
	static factorize(num: number) {
		const result = new Map<number, number>();

		let exponent2 = 0;
		while(num % 2 === 0) {
			num /= 2; exponent2 ++;
		}
		if(exponent2 > 0) { result.set(2, exponent2); }

		let exponent3 = 0;
		while(num % 3 === 0) {
			num /= 3; exponent3 ++;
		}
		if(exponent3 > 0) { result.set(3, exponent3); }
		
		for(let i = 5; i ** 2 <= num; i += (i % 6 === 1) ? 4 : 2) {
			let exponent = 0;
			while(num % i === 0) {
				num /= i; exponent ++;
			}
			if(exponent !== 0) { result.set(i, exponent); }

		}
		if(num !== 1) { result.set(num, 1); }
		return result;
	}
	static factorsWithMultiplicity(num: number) {
		const result = [];
		const factorization = MathUtils.factorize(num);
		for(const [prime, exponent] of factorization) {
			for(let i = 0; i < exponent; i ++) {
				result.push(prime);
			}
		}
		return result;
	}
	static unfactorize(factorization: Map<number, number>): number;
	static unfactorize(primes: number[], exponents: number[]): number;
	static unfactorize(factorizationOrPrimes: Map<number, number> | number[], exponents?: number[]) {
		if(factorizationOrPrimes instanceof Map) {
			const primes = [...factorizationOrPrimes.keys()];
			return MathUtils.product(primes.map(p => p ** factorizationOrPrimes.get(p)!));
		}
		return MathUtils.product(factorizationOrPrimes.map((p, i) => p ** (exponents!)[i]));
	}
	static divisors(num: number) {
		const divisorsBelowSqrt = [];
		const divisorsAboveSqrt = [];
		for(let i = 1; i ** 2 <= num; i ++) {
			if(num % i === 0) {
				divisorsBelowSqrt.push(i);
				if(i ** 2 !== num) {
					divisorsAboveSqrt.unshift(num / i);
				}
			}
		}
		return [...divisorsBelowSqrt, ...divisorsAboveSqrt];
	}
	static properDivisors(num: number) {
		const divisorsBelowSqrt = [];
		const divisorsAboveSqrt = [];
		for(let i = 2; i ** 2 <= num; i ++) {
			if(num % i === 0) {
				divisorsBelowSqrt.push(i);
				if(i ** 2 !== num) {
					divisorsAboveSqrt.unshift(num / i);
				}
			}
		}
		return [...divisorsBelowSqrt, ...divisorsAboveSqrt];
	}
	static binomial(n: number, k: number) {
		let result = 1;
		for(let i = n - k + 1; i <= n; i ++) {
			result *= i;
		}
		for(let i = 1; i <= k; i ++) {
			result /= i;
		}
		return result;
	}

	static totient(num: number) {
		let result = 1;
		for(const [prime, exponent] of MathUtils.factorize(num)) {
			result *= prime ** (exponent - 1) * (prime - 1);
		}
		return result;
	}
	static digits(num: number) {
		const digits = [];
		do {
			digits.unshift(num % 10);
			num = Math.floor(num / 10);
		} while(num !== 0);
		return digits;
	}
	static fromDigits(digits: number[]) {
		return Number.parseInt(digits.join(""));
	}
}
