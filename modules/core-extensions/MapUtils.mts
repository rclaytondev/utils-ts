export class MapUtils {
	static equals<K, V>(map1: ReadonlyMap<K, V>, map2: ReadonlyMap<K, V>, equals?: (v1: V, v2: V) => boolean) {
		if(map1.size !== map2.size) {
			return false;
		}
		for(const [key, value] of map1) {
			if(
				!map2.has(key) ||
				(!equals && map1.get(key) !== map2.get(key)) ||
				(equals && !equals(value, map2.get(key)!))
			) { return false; }
		}
		return true;
	}
	static filter<K, V>(map: Map<K, V>, callback: (key: K, value: V) => boolean) {
		const result = new Map<K, V>();
		for(const [key, value] of map.entries()) {
			if(callback(key, value)) {
				result.set(key, value);
			}
		}
		return result;
	}

	static groupBy<T, S>(items: Iterable<T>, callback: (value: T) => S) {
		const groups = new Map<S, T[]>();
		for(const value of items) {
			const output = callback(value);
			const group = groups.get(output);
			if(group) {
				group.push(value);
			}
			else {
				groups.set(output, [value]);
			}
		}
		return groups;
	}
}
