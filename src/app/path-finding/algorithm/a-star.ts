import {BaseAlgorithm} from "./base-algorithm";

export class AStar extends BaseAlgorithm {
  start(): void {
    console.log('AStar');
    console.log("rows: " + this.rows);
    console.log("cols: " + this.cols);
    console.log("speed: " + this.speed);
    console.log("startRow: " + this.startRow);
    console.log("startCol: " + this.startCol);
    console.log("endRow: " + this.endRow);
    console.log("endCol: " + this.endCol);
  }
  constructor(rows:number,cols:number,startRow: number, startCol: number, endRow: number, endCol: number,speed:number) {
    super(rows,cols,startRow, startCol, endRow, endCol,speed);
  }
}
