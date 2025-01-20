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
	
	filter(callback: (value: T) => boolean) {
		return new HashSet([...this].filter(callback));
	}
	toString() {
		return `{${[...this.values.values()].map(v => `${v}`).join(", ")}}`;
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
}
