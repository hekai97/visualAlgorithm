import {BaseAlgorithm, Color} from "../path-finding-algorithm/base-algorithm";

export class RandomizedDepthFirstSearch extends BaseAlgorithm{

  constructor(rows:number,cols:number,startRow: number, startCol: number, endRow: number, endCol: number,speed:number) {
    super(rows, cols, startRow, startCol, endRow, endCol, speed);
  }
  start(): void {

  }
}
