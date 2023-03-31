// 优先队列
export class PriorityQueue<T> {
  private readonly heap: [number, T][];  // 以 [优先级, 值] 的形式存储数据

  constructor() {
    this.heap = [];
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  insert(priority: number, value: T): void {
    this.heap.push([priority, value]);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): T | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }
    const root = this.heap[0][1];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      // @ts-ignore
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return root;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index][0] < this.heap[parentIndex][0]) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private bubbleDown(index: number): void {
    while (index < this.heap.length) {
      const leftChildIndex = index * 2 + 1;
      const rightChildIndex = index * 2 + 2;
      let minIndex = index;
      if (leftChildIndex < this.heap.length && this.heap[leftChildIndex][0] < this.heap[minIndex][0]) {
        minIndex = leftChildIndex;
      }
      if (rightChildIndex < this.heap.length && this.heap[rightChildIndex][0] < this.heap[minIndex][0]) {
        minIndex = rightChildIndex;
      }
      if (minIndex === index) {
        break;
      }
      this.swap(index, minIndex);
      index = minIndex;
    }
  }

  public contains(value: T): boolean {
    for (let i = 0; i < this.heap.length; i++) {
      if (this.heap[i][1] == value) {
        return true;
      }
    }
    return false;
  }

  private swap(index1: number, index2: number): void {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }
}
