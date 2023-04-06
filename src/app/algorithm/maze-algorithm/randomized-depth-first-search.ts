import {BaseAlgorithm, Color} from "../path-finding-algorithm/base-algorithm";

export class RandomizedDepthFirstSearch extends BaseAlgorithm{

  constructor(rows:number,cols:number,startRow: number, startCol: number, endRow: number, endCol: number,speed:number) {
    super(rows, cols, startRow, startCol, endRow, endCol, speed);
  }

  /**
   * 生成迷宫
   * 思路：首先，因为随机深度优先迷宫算法的本质是打通两个格子之间的墙，但是，我的项目中并没有那种两个格子之间的墙，例如下图
   * - - -                      - - -
   * | | |          ->          |   |
   * - - -                      - - -
   * 所以，我需要重新设计一下思路，首先，将9个格子当成一个整体，
   *  ***
   *  ***
   *  ***
   *  类似与上面这种，然后，将这个整体的中间的格子当成通路，上下左右的当作墙
   *  这样的话，就可以使用随机深度优先迷宫算法了，然后，将所有的墙都打通，就可以了
   *  不过需要注意的是，格子之间是有重叠部分的，类似于滑动
   */
  start(): void {
    // 首先，将所有的都标记为墙
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.setWallWithIndex(i, j, true);
      }
    }
    // 然后，将路径放出来

    // let map = new Array(this.rows);
    // let visited = new Array(this.rows);
    // for (let i = 0; i < this.rows; i++) {
    //   map[i] = new Array(this.cols);
    //   visited[i] = new Array(this.cols);
    //   for (let j = 0; j < this.cols; j++) {
    //     map[i][j] = 1;
    //     visited[i][j] = false;
    //   }
    // }
    let stack = [];
    stack.push([this.startRow,this.startCol]);
    // visited[this.startRow][this.startCol] = true;
    this.setVisitedWithIndex(this.startRow,this.startCol,true);
    while(stack.length>0) {
      let currentPoint: any;
      currentPoint = stack.pop();
      let currentPointX = currentPoint[0];
      let currentPointY = currentPoint[1];
      let neighbors = this.getNeighbors(currentPointX,currentPointY);
      if(neighbors.length>0){
        stack.push([currentPointX,currentPointY]);
        let randomIndex = Math.floor(Math.random()*neighbors.length);
        let randomNeighbor = neighbors[randomIndex];
        let randomNeighborX = randomNeighbor[0];
        let randomNeighborY = randomNeighbor[1];
        // if(randomNeighborX==this.endRow && randomNeighborY==this.endCol){
        //   break;
        // }
        // if(randomIndex==0){
        //   this.getIndexNode(randomNeighborX+1,randomNeighborY)!.innerHTML = "^";
        // }
        // else if(randomIndex==1){
        //   this.getIndexNode(randomNeighborX-1,randomNeighborY)!.innerHTML = "V";
        // }
        // else if(randomIndex==2){
        //   this.getIndexNode(randomNeighborX,randomNeighborY+1)!.innerHTML = "<";
        // }
        // else if(randomIndex==3){
        //   this.getIndexNode(randomNeighborX,randomNeighborY-1)!.innerHTML = ">";
        // }
        let x = (currentPointX+randomNeighborX)/2;
        let y = (currentPointY+randomNeighborY)/2;
        // map[x][y] = 0;
        // this.changeDivColorWithIndexDelay(randomNeighborX,randomNeighborY,Color.RED,this.speed);
        // this.changeDivColorWithIndexDelay(x,y,Color.RED,this.speed);
        // this.setWallWithIndex(randomNeighborX,randomNeighborY,false);
        // this.setWallWithIndex(x,y,false);
        this.setWallWithIndexDelay(randomNeighborX,randomNeighborY,false,this.speed);
        this.setWallWithIndexDelay(x,y,false,this.speed);
        stack.push([randomNeighborX,randomNeighborY]);
        // visited[randomNeighborX][randomNeighborY] = true;
        this.setVisitedWithIndex(randomNeighborX,randomNeighborY,true);
      }
    }
    // console.log(map);
    for(let i=0;i<this.rows;i++){
      for(let j=0;j<this.cols;j++){
        this.setVisitedWithIndex(i,j,false);
      }
    }
  }
  private getNeighbors(currentPointX: number, currentPointY: number): any[] {
    let neighbors = [];
    if(this.isIndexInRange(currentPointX-2,currentPointY) && !this.isVisitedWithIndex(currentPointX-2,currentPointY)){
      neighbors.push([currentPointX-2,currentPointY]);
    }
    if(this.isIndexInRange(currentPointX+2,currentPointY) && !this.isVisitedWithIndex(currentPointX+2,currentPointY)){
      neighbors.push([currentPointX+2,currentPointY]);
    }
    if(this.isIndexInRange(currentPointX,currentPointY-2) && !this.isVisitedWithIndex(currentPointX,currentPointY-2)){
      neighbors.push([currentPointX,currentPointY-2]);
    }
    if(this.isIndexInRange(currentPointX,currentPointY+2) && !this.isVisitedWithIndex(currentPointX,currentPointY+2)){
      neighbors.push([currentPointX,currentPointY+2]);
    }
    return neighbors;
  }

}
