import {BaseAlgorithm, Color} from "./base-algorithm";
import {PriorityQueue} from "./priority_queue";

export class Dijkstra extends BaseAlgorithm {

  start(): void {
    console.log('Dijkstra');
    let direction = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    // dijkstra算法，使用优先队列
    let pq = new PriorityQueue<[number, number]>();
    pq.insert(0, [this.startRow, this.startCol]);
    this.setNodeCostWithIndex(this.startRow, this.startCol, 0);
    this.setNodeCostWithIndex(this.endRow, this.endCol, 2000);
    while (!pq.isEmpty()) {
      let [row, col] = pq.extractMin()!;
      if (this.isEndPoint(row, col)) {
        console.log('找到了');
        // this.drawBestPath();
        return;
      }
      this.setVisitedWithIndex(row, col, true);
      // this.changeDivColorWithIndexDelay(row, col, Color.RED, this.speed);
      this.addChangeColorQueue(row, col, Color.RED);
      for (let i = 0; i < 4; i++) {
        let newRow = row + direction[i][0];
        let newCol = col + direction[i][1];
        if (this.isIndexInRange(newRow, newCol) && !this.isWallWithIndex(newRow, newCol)) {
          let newCost = this.getNodeCostWithIndex(row, col) + this.getNodeWeightWithIndex(newRow, newCol);
          console.log('newCost', newCost, 'nodeCost', this.getNodeCostWithIndex(newRow, newCol));
          // TODO 这里需要更改算法的设计思路，现在还是寻不准路。
          if (newCost < this.getNodeCostWithIndex(newRow, newCol) || !this.isParent(newRow, newCol)) {
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

  constructor(rows: number, cols: number, startRow: number, startCol: number, endRow: number, endCol: number, speed: number) {
    super(rows, cols, startRow, startCol, endRow, endCol, speed);
  }

  private getNodeWeightWithIndex(row: number, col: number): number {
    let s = this.getIndexNode(row, col)!.getAttribute('weight')!;
    return parseInt(s);

  }
}
