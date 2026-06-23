export class HashSet<T> {
	values: Map<string, T>;
	hashFunction: (value: T) => string;

	constructor(values: Iterable<T> = [], hashFunction: (value: T) => string = (x => `${x}`)) {
		this.values = new Map();
		this.hashFunction = hashFunction;
		for(const value of values) {
			this.add(value);
		}
	}

	has(value: T) {
		return this.values.has(this.hashFunction(value));
	}
	add(value: T) {
		const hash = this.hashFunction(value);
		if(!this.values.has(hash)) {
			this.values.set(hash, value);
		}
	}
	delete(value: T) {
		return this.values.delete(this.hashFunction(value));
	}

	get size() {
		return this.values.size;
	}
	*[Symbol.iterator]() {
		yield* this.values.values();
	}


	filter<S extends T>(callback: (value: T) => value is S) {
		return new HashSet<S>([...this].filter(callback));
	}
	toString() {
		return `{${[...this.values.values()].map(v => `${v}`).sort().join(", ")}}`;
	}


	map<S>(callback: (value: T) => S, newHashFunction?: (value: S) => string) {
		return new HashSet([...this.values.values()].map(callback), newHashFunction);
	}
	static union<T>(...sets: HashSet<T>[]) {
		const result = new HashSet<T>([], sets[0]?.hashFunction ?? (x => `${x}`));
		for(const set of sets) {
			for(const value of set.values.values()) {
				result.add(value);
			}
		}
		return result;
	}
	difference(set: HashSet<T>) {
		const result = new HashSet<T>();
		for(const [hash, value] of this.values.entries()) {
			if(!set.values.has(hash)) {
				result.add(value);
			}
		}
		return result;
	}
	equals(set: HashSet<T>) {
		return this.toString() === set.toString();
	}
	copy() {
		return this.map(s => s, this.hashFunction);
	}
}
