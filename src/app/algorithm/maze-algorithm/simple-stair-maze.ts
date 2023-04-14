import {BaseAlgorithm} from "../path-finding-algorithm/base-algorithm";
import {BaseMazeAlgorithm} from "./base-maze-algorithm";

export class SimpleStairMaze extends BaseMazeAlgorithm{
  constructor(rows:number,cols:number,startRow: number, startCol: number, endRow: number, endCol: number,speed:number) {
    super(rows, cols, startRow, startCol, endRow, endCol, speed);
  }
  start(): void {
    let currentPointX = this.rows-1;
    let currentPointY = 0;
    let count = 0;
    while(currentPointY<this.cols){
      console.log(currentPointX,currentPointY)
      if(count%2==0){
        // this.setWallWithIndex(currentPointX,currentPointY,true);
        this.walls[currentPointX][currentPointY] = true;
        currentPointY++;
        currentPointX--;
        if(currentPointX==1){
          count++;
        }
      }
      else{
        // this.setWallWithIndex(currentPointX,currentPointY,true);
        this.walls[currentPointX][currentPointY] = true;
        currentPointY++;
        currentPointX++;
        if(currentPointX==this.rows-1){
          count++;
        }
      }

    }
  }

}
