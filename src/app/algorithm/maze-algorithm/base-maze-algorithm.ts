import {BaseAlgorithm} from "../path-finding-algorithm/base-algorithm";

interface WallQueue {
  row: number,
  col: number,
  type: string
}
export abstract class BaseMazeAlgorithm extends BaseAlgorithm {
  walls: boolean[][];
  wallQueue: WallQueue[] = [];

  protected constructor(rows: number, cols: number, startRow: number, startCol: number, endRow: number, endCol: number, speed: number) {
    super(rows, cols, startRow, startCol, endRow, endCol, speed);
    this.walls = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.walls[i] = new Array(this.cols);
      for (let j = 0; j < this.cols; j++) {
        this.walls[i][j] = false;
      }
    }
  }

  override startVisual() {
    this.wallQueue = [];
    this.start();
    this.setWallQueue()
    this.playSetWallAnimation();
  }

  private playSetWallAnimation() {
    if (this.wallQueue.length > 0) {
      let wall = this.wallQueue.shift();
      if (wall) {
        this.setWallWithIndex(wall.row, wall.col,true);
      }
    }else{
      this.isEnd = true;
    }
    this.timer = setTimeout(() => {
      this.playSetWallAnimation();
    },this.getCalculateSpeed());
  }

  protected addTOWallQueue(row: number, col: number) {
    this.wallQueue.push({row, col, type: 'wall'});
  }

  private setWallQueue() {
    for(let i=0;i<this.rows;i++){
      for(let j=0;j<this.cols;j++){
        if(this.walls[i][j]){
          this.addTOWallQueue(i,j);
        }
      }
    }
  }
}
