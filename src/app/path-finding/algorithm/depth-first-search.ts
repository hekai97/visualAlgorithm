import {BaseAlgorithm, Color} from "./base-algorithm";

export class DepthFirstSearch extends BaseAlgorithm{
  direction = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  start(): void {
    // 深度优先搜索
    let res = this.startAlgorithm(this.startRow,this.startCol,null);
    console.log('res>>',res);
    if(res){
      console.log('找到了');
      // drawBestPath(this.endRow,this.endCol,this.speed);
      this.drawBestPath();
    }
  }
  constructor(rows:number,cols:number,startRow: number, startCol: number, endRow: number, endCol: number,speed:number) {
    super(rows,cols,startRow, startCol, endRow, endCol,speed);
    console.log('row='+rows+'col='+cols+'startRow='+startRow+'startCol='+startCol+'endRow='+endRow+'endCol='+endCol+'speed='+speed);
  }

  private startAlgorithm(startRow: number, startCol: number,parent:HTMLElement|null): boolean {
    if(parent){
      this.setParentWithIndex(startRow,startCol,parent);
      this.setNodeCostWithIndex(startRow,startCol,this.getNodeCostWithNode(parent!)+1);
    }
    if(this.isStartPoint(startRow,startCol)&&parent!==null){
      return false;
    }
    if(this.isEndPoint(startRow,startCol)){
      console.log('停止了，此时的行数为',startRow,'此时的列数为',startCol);
      return true;
    }
    if(!this.isIndexInRange(startRow,startCol)){
      return false;
    }
    for (let i = 0; i < 4; i++) {
      let newRow = startRow + this.direction[i][0];
      let newCol = startCol + this.direction[i][1];
      if (this.isIndexInRange(newRow,newCol) && !this.isWallWithIndex(newRow, newCol) && !this.isVisitedWithIndex(newRow,newCol)) {
        this.setVisitedWithIndex(newRow,newCol,true);
        // this.changeColor(newRow,newCol,time);
        // time+=100/this.speed;
        this.changeDivColorWithIndexDelay(newRow,newCol,Color.RED, this.speed);
        let res = this.startAlgorithm(newRow, newCol,this.getIndexNode(startRow,startCol)!);
        if(res){
          return true;
        }
      }
    }
    return false;
  }

  // private isEnd(startRow: number, startCol: number) {
  //   return startRow === this.endRow && startCol === this.endCol;
  // }

  // private visited(newRow: number, newCol: number) {
  //   return this.getIndexNode(newRow,newCol)!.getAttribute('visited') === 'true';
  // }

  // private isNotWall(newRow: number, newCol: number) {
  //   return this.getIndexNode(newRow,newCol)!.getAttribute('wall') === '0';
  // }

  // private setVisited(newRow: number, newCol: number) {
  //   this.getIndexNode(newRow,newCol)!.setAttribute('visited','true');
  // }

  // private changeColor(newRow: number, newCol: number, time: number) {
  //   setTimeout(() => {
  //     this.getIndexNode(newRow,newCol)!.setAttribute('class','Path_red');
  //   },time);
  // }
  //
  // private isNotOutOfBound(newRow: number, newCol: number) {
  //   if(newRow < 0 || newRow >= this.rows || newCol < 0 || newCol >= this.cols){
  //     return false;
  //   }
  //   return true;
  // }
}
