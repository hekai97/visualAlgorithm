import {BaseAlgorithm} from "../path-finding-algorithm/base-algorithm";
import {BaseMazeAlgorithm} from "./base-maze-algorithm";

export class RecursiveDivision extends BaseMazeAlgorithm {
  constructor(rows: number, cols: number, startRow: number, startCol: number, endRow: number, endCol: number, speed: number) {
    super(rows, cols, startRow, startCol, endRow, endCol, speed);
  }

  start(): void {
    // 递归分割算法生成迷宫
    // 1. 标出迷宫的边界
    this.setBoundary();
    // 2. 递归分割
    this.divide(1, 1, this.rows - 2, this.cols - 2);

    for (let i = 0; i < 100; ++i) {
      console.log(this.getRandomInt(3, 5));
    }
  }

  private setBoundary() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (i == 0 || i == this.rows - 1 || j == 0 || j == this.cols - 1) {
          // this.setWallWithIndex(i,j,true);
          this.walls[i][j] = true;
        }
      }
    }
  }

  private divide(x1: number, y1: number, x2: number, y2: number) {
    // 为什么是小于4呢？因为，在这个矩阵中，我们需要留出空隙，以便于后面的递归分割,不然极容易出现一层墙上面又是一层墙
    if (Math.abs(x1 - x2) < 4 || Math.abs(y1 - y2) < 4) {
      return;
    }
    // 在该矩阵中随机选择一个点，该点不能是紧贴着墙的点
    let point = this.randomPoint(x1, x2, y1, y2);
    // 由该点开始，向上下左右开始填充墙
    for (let i = x1; i <= x2; i++) {
      // this.setWallWithIndex(i,point[1],true);
      this.walls[i][point[1]] = true;
    }
    for (let i = y1; i <= y2; i++) {
      // this.setWallWithIndex(point[0],i,true);
      this.walls[point[0]][i] = true;
    }
    // 选择随机的三堵墙，将其打通
    this.randomBreakWalls(point[0], point[1], x1, x2, y1, y2);
    // 递归分割
    this.divide(x1, y1, point[0], point[1]);
    this.divide(point[0], y1, x2, point[1]);
    this.divide(x1, point[1], point[0], y2);
    this.divide(point[0], point[1], x2, y2);
  }

  private randomPoint(x1: number, x2: number, y1: number, y2: number) {
    let x = this.getRandomInt(x1 + 1, x2 - 1);
    let y = this.getRandomInt(y1 + 1, y2 - 1);
    return [x, y];
  }

  private randomBreakWalls(pointX: number, pointY: number, x1: number, x2: number, y1: number, y2: number) {
    // 上右下左分别用0，1，2，3表示，随机一个数，表示不打通这堵墙，其余的打通
    let random = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; ++i) {
      if (i == random) {
        continue;
      }
      this.breakWall(pointX, pointY, x1, x2, y1, y2, i);
    }
  }

  private breakWall(pointX: number, pointY: number, x1: number, x2: number, y1: number, y2: number, orientation: number) {
    switch (orientation) {
      case 0:
        // 上
        let randomX = this.getRandomInt(pointX, x1);
        // this.setWallWithIndex(randomX,pointY,false);
        this.walls[randomX][pointY] = false;
        break;
      case 1:
        // 右
        let randomY = this.getRandomInt(pointY, y2);
        // this.setWallWithIndex(pointX,randomY,false);
        this.walls[pointX][randomY] = false;
        break;
      case 2:
        // 下
        let randomX2 = this.getRandomInt(pointX, x2);
        // this.setWallWithIndex(randomX2,pointY,false);
        this.walls[randomX2][pointY] = false;
        break;
      case 3:
        // 左
        let randomY2 = this.getRandomInt(pointY, y1);
        // this.setWallWithIndex(pointX,randomY2,false);
        this.walls[pointX][randomY2] = false;
        break;
      default:
        break;
    }
  }

  private getRandomInt(a: number, b: number) {
    let min = Math.min(a, b);
    let max = Math.max(a, b);
    // min = Math.ceil(min);
    // max = Math.floor(max);
    // return Math.floor(Math.random() * (max - min) + min);
    // 返回一个开区间的随机数，范围为(min,max),不包括max和min
    return Math.floor(Math.random() * (max - min - 1)) + min + 1;
  }
}

