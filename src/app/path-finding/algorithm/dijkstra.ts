import {BaseAlgorithm, Color} from "./base-algorithm";

export class Dijkstra extends BaseAlgorithm{

  start(): void {
    console.log('Dijkstra');
    let direction = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    // dijkstra算法，使用优先队列
    let pq = new PriorityQueue<[number, number]>();
    pq.insert(0, [this.startRow, this.startCol]);
    this.setNodeCostWithIndex(this.startRow,this.startCol,0);
    this.setNodeCostWithIndex(this.endRow,this.endCol,0);
    while (!pq.isEmpty()) {
      let [row, col] = pq.extractMin()!;
      if (this.isEndPoint(row, col)) {
        console.log('找到了');
        this.drawBestPath();
        return;
      }
      if (this.isVisitedWithIndex(row, col)) {
        continue;
      }
      this.setVisitedWithIndex(row, col, true);
      this.changeDivColorWithIndexDelay(row, col, Color.RED, this.speed);
      for (let i = 0; i < 4; i++) {
        let newRow = row + direction[i][0];
        let newCol = col + direction[i][1];
        if (this.isIndexInRange(newRow, newCol) && !this.isWallWithIndex(newRow, newCol)) {
          let newCost = this.getNodeCostWithIndex(row, col) + this.getNodeWeightWithIndex(newRow, newCol);
          console.log('newCost',newCost,'nodeCost',this.getNodeWeightWithIndex(newRow, newCol));
          // TODO 这里需要更改算法的设计思路，现在还是寻不准路。
          if (!this.isVisitedWithIndex(newRow, newCol) || newCost < this.getNodeCostWithIndex(newRow, newCol)) {
            // this.setVisitedWithIndex(row, col, true);
            // this.changeDivColorWithIndexDelay(row, col, Color.RED, this.speed);
            pq.insert(newCost, [newRow, newCol]);
            this.setNodeCostWithIndex(newRow, newCol, newCost);
            this.setParentWithIndex(newRow, newCol, this.getIndexNode(row, col)!);
          }
        }
      }
    }
    // this.drawBestPath();

  }

  constructor(rows:number,cols:number,startRow: number, startCol: number, endRow: number, endCol: number,speed:number) {
    super(rows,cols,startRow, startCol, endRow, endCol,speed);
  }

  private getNodeWeightWithIndex(row: number, col: number): number {
    let s = this.getIndexNode(row, col)!.getAttribute('weight')!;
    return parseInt(s);

  }

  // private getAroundMin() {
  //   let direction = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  //   let min = null;
  //   for(let i = 0;i<4;++i){
  //     let newRow = this.endRow + direction[i][0];
  //     let newCol = this.endCol + direction[i][1];
  //     if (this.isIndexInRange(newRow, newCol) && !this.isWallWithIndex(newRow, newCol)) {
  //       if(min == null){
  //         min = this.getNodeCostWithIndex(newRow, newCol);
  //       }else{
  //         min = Math.min(min,this.getNodeCostWithIndex(newRow, newCol));
  //       }
  //     }
  //   }
  //   return min;
  // }

}

// 优先队列
class PriorityQueue<T> {
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

  private swap(index1: number, index2: number): void {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }
}
