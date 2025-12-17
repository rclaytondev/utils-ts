export class BigintMath {
	static sum(numbers: bigint[]) {
		return numbers.reduce((accumulator, value) => accumulator + value, 0n);
	}
	static max(...values: bigint[]) {
		let max = values[0];
		for(const value of values) {
			if(value > max) {
				max = value;
			}
		}
		return max;
	}
	static min(...values: bigint[]) {
		let min = values[0];
		for(const value of values) {
			if(value < min) {
				min = value;
			}
		}
		return min;
	}
	static abs(value: bigint) {
		return (value < 0n) ? -value : value;
	}
	static sign(value: bigint) {
		if(value === 0n) {
			return 0n;
		}
		return (value > 0) ? 1n : -1n;
	}
	private static recursiveGCD(num1: bigint, num2: bigint): bigint {
		if(num1 % num2 === 0n) { return num2; }
		return BigintMath.recursiveGCD(num2, num1 % num2);
	}
	static gcd(num1: bigint, num2: bigint): bigint {
		if(num1 === 0n || num2 === 0n) { throw new Error("Cannot calculate GCD when either of the inputs are zero."); }
		[num1, num2] = [BigintMath.max(BigintMath.abs(num1), BigintMath.abs(num2)), BigintMath.min(BigintMath.abs(num1), BigintMath.abs(num2))];
		return BigintMath.recursiveGCD(num1, num2);
	}
	static lcm(num1: bigint, num2: bigint) {
		return num1 * num2 / BigintMath.gcd(num1, num2);
	}
	static divideCeil(num: bigint, divisor: bigint) {
		return (num / divisor) + (num % divisor === 0n ? 0n : 1n);
	}
	static factorial(num: bigint) {
		if(num < 0) {
			throw new Error(`Cannot calculate the factorial of a negative integer (${num}).`);
		}
		let result = 1n;
		for(let i = 1n; i <= num; i ++) {
			result *= i;
		}
		return result;
	}
	static floorSqrt(num: bigint) {
		let min = 0n;
		let max = num;
		while(max - min > 1) {
			const halfway = (min + max) / 2n;
			if(halfway ** 2n < num) {
				min = halfway;
			}
			else {
				max = halfway;
			}
		}
		return (min ** 2n <= num && (min + 1n) ** 2n > num) ? min : max;
	}
	static isSquare(num: bigint) {
		return BigintMath.floorSqrt(num) ** 2n === num;
	}
	static binomial(n: bigint, k: bigint) {
		let result = 1n;
		for(let i = n - k + 1n; i <= n; i ++) {
			result *= i;
		}
		for(let i = 1n; i <= k; i ++) {
			result /= i;
		}
		return result;
	}
	static generalizedModulo(num: bigint, modulo: bigint) {
		if(modulo <= 0) {
			throw new Error("Cannot take the modulo by a negative number or 0.");
		}
		if(num >= 0) { return num % modulo; }
		return num + modulo * BigintMath.divideCeil(-num, modulo);
	}
	static modularExponentiate(base: bigint, exponent: bigint, modulo: bigint) {
		const exponentBinary = exponent.toString(2);
		let result = 1n;
		let power = BigInt(base);
		for(let i = 0; i < exponentBinary.length; i ++) {
			if(exponentBinary[exponentBinary.length - 1 - i] === "1") {
				result = (result * power) % modulo;
			}
			power = (power ** 2n) % modulo;
		}
		return result;
	}
	static isPrime(n: bigint) {
		if(n <= 1) {
			return false;
		}
		for(let k = 2n; k ** 2n <= n; k ++) {
			if(n % k === 0n) { return false; }
		}
		return true;
	}
	static rangeSum(min: bigint, max: bigint) {
		if(min > max) { return 0n; }
		return min * (max - min + 1n) + (max - min) * (max - min + 1n) / 2n;
	}
}
