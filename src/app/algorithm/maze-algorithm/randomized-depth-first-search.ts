import {BaseAlgorithm, Color} from "../path-finding-algorithm/base-algorithm";

export class RandomizedDepthFirstSearch extends BaseAlgorithm{

  constructor(rows:number,cols:number,startRow: number, startCol: number, endRow: number, endCol: number,speed:number) {
    super(rows, cols, startRow, startCol, endRow, endCol, speed);
  }
  start(): void {
   let map = this.generateMap(40,40);
    console.log(map);
  }
  generateMap(rows: number, cols: number): number[][] {
    // 初始化地图，全部设置为障碍
    const map = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 1));
    let visited = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
    // 随机选取一个起点
    const startX = Math.floor(Math.random() * rows);
    const startY = Math.floor(Math.random() * cols);

    // 将起点设置为可以行走，并加入到栈中
    map[startX][startY] = 0;
    visited[startX][startY] = true;
    const stack = [[startX, startY]];

    // 使用深度优先算法生成地图
    while (stack.length > 0) {
      const [x, y] = stack[stack.length - 1];
      let found = false;

      // 随机选择相邻的一个位置
      const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // 上右下左
      const randomDirections = directions.sort(() => Math.random() - 0.5);
      for (const [dx, dy] of randomDirections) {
        const nextX = x + dx;
        const nextY = y + dy;
        if(visited[nextX][nextY]){
          continue;
        }
        // 如果相邻的位置是障碍，就将其变成可以行走，并加入到栈中
        if (nextX >= 0 && nextX < rows && nextY >= 0 && nextY < cols && map[nextX][nextY] === 1) {
          map[nextX][nextY] = 0;
          visited[nextX][nextY] = true;
          stack.push([nextX, nextY]);
          found = true;
          break;
        }
      }

      // 如果当前位置没有相邻的障碍，就从栈中弹出该元素，回到前一个位置
      if (!found) {
        stack.pop();
      }
    }

    return map;
  }
}
