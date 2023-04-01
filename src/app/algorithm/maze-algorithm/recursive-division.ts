import {BaseAlgorithm} from "../path-finding-algorithm/base-algorithm";

//阿弥陀佛 赛博佛祖保佑

export class RecursiveDivision extends BaseAlgorithm{
  constructor(rows:number,cols:number,startRow: number, startCol: number, endRow: number, endCol: number,speed:number) {
    super(rows, cols, startRow, startCol, endRow, endCol, speed);
  }
  start(): void {
    // 递归分割算法生成迷宫
    // 1. 标出迷宫的边界
    this.setBoundary();
    // 2. 递归分割
    this.divide(1,1,this.rows-2,this.cols-2);
    // let map = this.generateMap(40,20);
    // console.log(map);
    // for (let i = 0; i < this.rows; i++) {
    //   for (let j = 0; j < this.cols; j++) {
    //     if(map[i][j]==1){
    //       if(this.isStartPoint(i,j)||this.isEndPoint(i,j)){
    //         continue;
    //       }
    //       this.setWallWithIndex(i,j,true);
    //     }
    //   }
    // }
  }
  generateMap(width: number, height: number): number[][] {
    // 初始化地图，全部设为1
    let map: number[][] = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => 1)
    );

    // 递归分割函数
    function divide(left: number, top: number, right: number, bottom: number) {
      // 计算区域的宽度和高度
      const width = right - left + 1;
      const height = bottom - top + 1;

      // 如果区域的宽度或高度小于2，则无法再分割
      if (width < 2 || height < 2) {
        return;
      }

      // 选取一个随机的竖直或水平方向来分割区域
      const isVertical = Math.random() < 0.5;

      // 如果是竖直方向，则在区域的中间随机选取一列
      if (isVertical) {
        const x = Math.floor(randomRange(left + 1, right - 1) / 2) * 2;
        // 将选中的列从上到下全部设为0，表示打通这一列
        for (let y = top; y <= bottom; y++) {
          map[y][x] = 0;
        }
        // 在选中列的两侧各进行一次递归分割
        divide(left, top, x - 1, bottom);
        divide(x + 1, top, right, bottom);
      } else {
        // 如果是水平方向，则在区域的中间随机选取一行
        const y = Math.floor(randomRange(top + 1, bottom - 1) / 2) * 2;
        // 将选中的行从左到右全部设为0，表示打通这一行
        for (let x = left; x <= right; x++) {
          map[y][x] = 0;
        }
        // 在选中行的两侧各进行一次递归分割
        divide(left, top, right, y - 1);
        divide(left, y + 1, right, bottom);
      }
    }

    // 生成一个指定范围内的随机数
    function randomRange(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 调用递归分割函数，生成地图
    divide(0, 0, width - 1, height - 1);

    return map;
  }


  private setBoundary() {
    for (let i = 0; i < this.rows; i++) {
      this.setWallWithIndex(i,0,true);
      this.setWallWithIndex(i,this.cols-1,true);
    }
    for (let i = 0; i < this.cols; i++) {
      this.setWallWithIndex(0,i,true);
      this.setWallWithIndex(this.rows-1,i,true);
    }
  }

  private divide(x1: number, y1: number, x2: number, y2: number) {
    // 递归结束条件
    if (x1 >= x2 || y1 >= y2) {
      return;
    }
    // 随机选择一个方向
    let isVertical = Math.random() < 0.5;
    if (isVertical) {
      // 从左到右生成一个随机数
      let x = Math.floor(Math.random() * (x2 - x1)) + x1;
      // 偶数化
      x = x % 2 == 0 ? x : x + 1;
      // 生成一个随机数，用于确定挖洞的位置
      let y = Math.floor(Math.random() * (y2 - y1 + 1)) + y1;
      // 挖洞
      for (let i = y1; i <= y2; i++) {
        if (i == y) {
          continue;
        }
        console.log('i',i,'x',x);
        this.setWallWithIndex(x,i,true);
      }
      // 递归
      this.divide(x1, y1, x - 1, y2);
      this.divide(x + 1, y1, x2, y2);
    } else {
      // 从上到下生成一个随机数
      let y = Math.floor(Math.random() * (y2 - y1)) + y1;
      // 偶数化
      y = y % 2 == 0 ? y : y + 1;
      // 生成一个随机数，用于确定挖洞的位置
      let x = Math.floor(Math.random() * (x2 - x1 + 1)) + x1;
      // 挖洞
      for (let i = x1; i <= x2; i++) {
        if (i == x) {
          continue;
        }
        console.log('i',i,'y',y);
        this.setWallWithIndex(i,y,true);
      }
      // 递归
      this.divide(x1, y1, x2, y - 1);
      this.divide(x1, y + 1, x2, y2);
    }
  }

}

