import {BaseAlgorithm, Color} from "./base-algorithm";
import {PriorityQueue} from "./priority_queue";

export class AStar extends BaseAlgorithm {
  private D = 1;

  start(): void {
    /**
     * * 初始化open_set和close_set；
     * * 将起点加入open_set中，并设置优先级为0（优先级最高）；
     * * 如果open_set不为空，则从open_set中选取优先级最高的节点n：
     *     * 如果节点n为终点，则：
     *         * 从终点开始逐步追踪parent节点，一直达到起点；
     *         * 返回找到的结果路径，算法结束；
     *     * 如果节点n不是终点，则：
     *         * 将节点n从open_set中删除，并加入close_set中；
     *         * 遍历节点n所有的邻近节点：
     *             * 如果邻近节点m在close_set中，则：
     *                 * 跳过，选取下一个邻近节点
     *             * 如果邻近节点m也不在open_set中，则：
     *                 * 设置节点m的parent为节点n
     *                 * 计算节点m的优先级
     *                 * 将节点m加入open_set中
     *
     * */
      // A star 算法
    let direction = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    let openSet = new PriorityQueue<HTMLElement>();
    // let closeSet = [];
    openSet.insert(0, this.getIndexNode(this.startRow, this.startCol)!);
    this.setNodeCostWithIndex(this.startRow, this.startCol, 0);
    while (!openSet.isEmpty()) {
      let div = openSet.extractMin()!;
      if (this.isEndNode(div)) {
        console.log('找到了');
        // this.drawBestPath();
        return;
      }
      this.setVisitedWithNode(div, true);
      // this.changeDivColorWithNodeDelay(div, Color.RED, this.speed);
      let point = this.getNodeIndex(div);
      this.addChangeColorQueue(point[0], point[1], Color.RED);

      for (let i = 0; i < 4; i++) {
        let newRow = parseInt(div.getAttribute('row')!) + direction[i][0];
        let newCol = parseInt(div.getAttribute('col')!) + direction[i][1];
        if (this.isIndexInRange(newRow, newCol) && !this.isWallWithIndex(newRow, newCol)) {
          if (this.isVisitedWithIndex(newRow, newCol)) {
            continue;
          }
          if (!openSet.contains(this.getIndexNode(newRow, newCol)!)) {
            this.setParentWithIndex(newRow, newCol, div);
            this.setNodeCostWithIndex(newRow, newCol, this.getNodeCostWithNode(div) + 1);
            openSet.insert(this.f(newRow, newCol), this.getIndexNode(newRow, newCol)!);
          }
        }
      }
      // console.log('row', row, 'col', col);
      // this.setVisitedWithIndex(row, col, true);
      // this.changeDivColorWithIndexDelay(row, col, Color.RED, this.speed);
      // for (let i = 0; i < 4; i++) {
      //   let newRow = row + direction[i][0];
      //   let newCol = col + direction[i][1];
      //   if (this.isIndexInRange(newRow, newCol) && !this.isWallWithIndex(newRow, newCol)) {
      //     if(this.isVisitedWithIndex(newRow,newCol)){
      //       continue;
      //     }
      //     if(!openSet.contains([newRow,newCol])){
      //       let parent = this.getIndexNode(row, col)!;
      //       this.setParentWithIndex(newRow, newCol, parent);
      //       this.setNodeCostWithIndex(newRow, newCol, this.getNodeCostWithNode(parent) + 1);
      //       openSet.insert(this.f(newRow, newCol), [newRow, newCol]);
      //     }
      //   }
      // }
    }
  }

  constructor(rows: number, cols: number, startRow: number, startCol: number, endRow: number, endCol: number, speed: number) {
    super(rows, cols, startRow, startCol, endRow, endCol, speed);
  }

  // A star算法中的g(n)函数
  private g(row: number, col: number): number {
    let dx = Math.abs(row - this.startRow);
    let dy = Math.abs(col - this.startCol);
    return (dx + dy) * this.D;
    // return Math.sqrt(Math.pow(row - this.startRow, 2) + Math.pow(col - this.startCol, 2))+this.getNodeCostWithIndex(row,col);
  }

  // A star算法中的h(n)函数
  private h(row: number, col: number): number {
    let dx = Math.abs(row - this.endRow);
    let dy = Math.abs(col - this.endCol);
    return (dx + dy) * this.D;
    // return Math.sqrt(Math.pow(row - this.endRow, 2) + Math.pow(col - this.endCol, 2))+this.getNodeCostWithIndex(row,col);
  }

  // A star算法中的f(n)函数
  private f(row: number, col: number): number {
    return this.g(row, col) + this.h(row, col);
  }
}
