import {BaseAlgorithm, Color} from "./base-algorithm";

export class BreadthFirstSearch extends BaseAlgorithm{
  start(): void {
    //创建一个div的队列
    const queue: HTMLElement[] = [];
    //将起点加入队列
    queue.push(this.getIndexNode(this.startRow, this.startCol)!);
    let time = 0;
    this.startAlgorithm(queue,time);
  }
  constructor(rows:number,cols:number,startRow: number, startCol: number, endRow: number, endCol: number,speed:number) {
    super(rows,cols,startRow, startCol, endRow, endCol,speed);
  }

  private startAlgorithm(queue: HTMLElement[],time:number) {
    let found = false;
    //开始广搜
    while (queue.length > 0) {
      //取出队首元素
      const current = queue.shift()!;
      //如果队首元素是终点，结束搜索
      if (current === this.getIndexNode(this.endRow, this.endCol)) {
        found = true;
        break;
      }
      // console.log("速度为"+time);
      //如果队首元素不是终点，将其加入已访问集合
      // current.setAttribute('visited', 'true');
      let index = this.getNodeIndex(current);
      this.setVisitedWithIndex(index[0],index[1],true);
      // 更改cost
      let parent = this.getParentNodeWithNode(current);
      if(parent != null) {
        // current.setAttribute('cost',`${parseInt(parent.getAttribute('cost')!)+1}`);

        // this.setNodeCostWithIndex(index[0],index[1],this.getNodeCostWithNode(parent)+1);
        this.setNodeCostWithNode(current,this.getNodeCostWithNode(parent)+1);
      }
      // let parentIndex = current.getAttribute('parent');
      // console.log(parentIndex);
      // if(parentIndex != null && parentIndex != 'null') {
      //   let parent = this.getIndexNode(parseInt(parentIndex.split('|')[0]),parseInt(parentIndex.split('|')[1]))!;
      //   current.setAttribute('cost',`${parseInt(parent.getAttribute('cost')!)+1}`);
      // }
      // 延迟染色
      if(!(this.isStartNode(current)||this.isEndNode(current))){
        // this.changeColor(current,this.speed,time);

        // this.changeDivColorWithNodeDelay(current,Color.RED, this.speed);
        this.addChangeColorQueue(index[0],index[1],Color.RED);
      }
      // else{
      //   this.changeColor(current,this.speed,time);
      //   // 延迟染色的时间
      //   time+=100/this.speed;
      // }




      // setTimeout(() => {
      //   this.changeColor(current,this.speed);
      // }, this.speed);
      //将队首元素的相邻元素加入队列
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!this.isVisitedWithNode(neighbor)&&!this.isWallWithNode(neighbor)) {
          console.log(neighbor.getAttribute('wall'));
          neighbor.setAttribute('visited', 'true');
          neighbor.setAttribute('parent', `${current.getAttribute('row')}|${current.getAttribute('col')}`);
          queue.push(neighbor);
        }
      }
    }
    if(found) {
      // this.findBestPath(time);
      return;
      // this.drawBestPath();
    }
  }

  private getNeighbors(current: HTMLElement) {
    const row = parseInt(current.getAttribute('row')!);
    const col = parseInt(current.getAttribute('col')!);
    const neighbors: HTMLElement[] = [];
    //上
    if (row > 0) {
      neighbors.push(this.getIndexNode(row - 1, col)!);
    }
    //右
    if (col < this.cols - 1) {
      neighbors.push(this.getIndexNode(row, col + 1)!);
    }
    //下
    if (row < this.rows - 1) {
      neighbors.push(this.getIndexNode(row + 1, col)!);
    }
    //左
    if (col > 0) {
      neighbors.push(this.getIndexNode(row, col - 1)!);
    }
    return neighbors;
  }

  // private changeColor(current: HTMLElement, speed: number,time:number) {
  //   setTimeout(() => {
  //     current.setAttribute('class', 'Path_red');
  //     current.innerHTML = current.getAttribute('cost')!;
  //   }, time);
  // }


  // private findBestPath(time:number){
  //   let current = this.getIndexNode(this.endRow,this.endCol)!;
  //   while (current !== this.getIndexNode(this.startRow,this.startCol)){
  //     // current.removeAttribute('Path_red');
  //     // 将路线染成绿色，但是终点不染色
  //     if(current !== this.getIndexNode(this.endRow,this.endCol)){
  //       this.changeToGreen(current,time);
  //       time+=100/this.speed;
  //     }
  //
  //     console.log("寻找最好路径速度为"+time+"当前节点为"+`${current.getAttribute('row')}|${current.getAttribute('col')}`);
  //     // current.setAttribute('class','Path_green');
  //     const parent = current.getAttribute('parent')!.split('|');
  //     current = this.getIndexNode(parseInt(parent[0]),parseInt(parent[1]))!;
  //   }
  // }
  // changeToGreen(current: HTMLElement, time:number) {
  //   setTimeout(() => {
  //     current.setAttribute('class', 'Path_green');
  //   }, time);
  // }
}
