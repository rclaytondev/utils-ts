export class PriorityQueue<T> {
	private heap: { value: T, priority: number }[] = [];

	private static childIndices(index: number) {
		return [2 * index + 1, 2 * index + 2];
	}
	private static parentIndex(index: number) {
		return Math.floor((index - 1) / 2);
	}
	private swap(index1: number, index2: number) {
		[this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
	}

	insert(value: T, priority: number) {
		this.heap.push({ value, priority });
		this.sift(this.heap.length - 1);
	}
	private sift(index: number) {
		/* Repeatedly swaps the element with its parent until the element's priority is greater than or equal to that of its parent. */
		if(index === 0) { return; }
		const parentIndex = PriorityQueue.parentIndex(index);
		if(this.heap[parentIndex].priority > this.heap[index].priority) {
			[this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
			this.sift(parentIndex);
		}
	}
	pop(): T {
		if(this.heap.length === 0) {
			throw new Error("Cannot pop from empty priority queue.");
		}
		this.swap(0, this.heap.length - 1);
		const result = this.heap.pop();
		this.heapify(0);
		return result!.value;
	}
	private heapify(index: number) {
		if(this.heap.length === 0) { return; }
		const [child1Index, child2Index] = PriorityQueue.childIndices(index);
		const priority1 = this.heap[child1Index]?.priority ?? Infinity;
		const priority2 = this.heap[child2Index]?.priority ?? Infinity;
		if(this.heap[index].priority > priority1 || this.heap[index].priority > priority2) {
			const minPriorityChild = (priority1 < priority2) ? child1Index : child2Index;
			this.swap(index, minPriorityChild);
			this.heapify(minPriorityChild);
		}
	}

	*entries() {
		/* Can yield the first k values in O(k log k) time. */
		if(this.heap.length === 0) { return; }
		const queue = new PriorityQueue<number>();
		queue.insert(0, this.heap[0].priority);
		while(queue.heap.length !== 0) {
			const nextIndex = queue.heap[0].value;
			yield [this.heap[nextIndex].value, this.heap[nextIndex].priority];
			queue.pop();
			const [child1Index, child2Index] = PriorityQueue.childIndices(nextIndex);
			if(child1Index < this.heap.length) {
				queue.insert(child1Index, this.heap[child1Index].priority);
			}
			if(child2Index < this.heap.length) {
				queue.insert(child2Index, this.heap[child2Index].priority);
			}
		}
	}
}
