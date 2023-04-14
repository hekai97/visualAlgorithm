import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseAlgorithm} from '../algorithm/path-finding-algorithm/base-algorithm';
import {AStar} from "../algorithm/path-finding-algorithm/a-star";
import {BreadthFirstSearch} from "../algorithm/path-finding-algorithm/breadth-first-search";
import {DepthFirstSearch} from "../algorithm/path-finding-algorithm/depth-first-search";
import {Dijkstra} from "../algorithm/path-finding-algorithm/dijkstra";
import {RandomizedDepthFirstSearch} from "../algorithm/maze-algorithm/randomized-depth-first-search";
import {SimpleStairMaze} from "../algorithm/maze-algorithm/simple-stair-maze";
import {RecursiveDivision} from "../algorithm/maze-algorithm/recursive-division";
import {BaseMazeAlgorithm} from "../algorithm/maze-algorithm/base-maze-algorithm";
@Component({
  templateUrl: './path-finding.component.html',
  styleUrls: ['./path-finding.component.css'],
})
export class PathFindingComponent implements OnInit {
  constructor(private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    console.log('PathFindingComponent');
    this.createBoard();
    this.createStartNode(this.startRow, this.startCol);
    this.createEndNode(this.endRow, this.endCol);
  }
  pathFindingAlgorithm: BaseAlgorithm | null= null;
  mazeAlgorithm: BaseMazeAlgorithm | null = null;
  // 默认地图大小
  rows = 20;
  cols = 40;
  startRow = 10;
  startCol = 10;
  endRow = 10;
  endCol = 30;
  speed = 100;
  isMouseDown = false;

  isWeighted :boolean = false;
  pathFindingAlgorithms = [
    {name: 'A*', value: 'aStar'},
    {name: 'Dijkstra', value: 'dijkstra'},
    {name: 'BFS', value: 'bfs'},
    {name: 'DFS', value: 'dfs'},
  ];
  mazeAlgorithms = [
    {name: 'None', value: 'none'},
    {name: 'Simple Stair Maze', value: 'simpleStairMaze'},
    {name: 'Randomized depth-first search', value: 'randomizedDepthFirstSearch'},
    {name: 'Recursive Division', value: 'recursiveDivision'},
    {name: 'Randomized Prim', value: 'randomizedPrim'},
    {name: 'Randomized Kruskal', value: 'randomizedKruskal'},
  ];

  selectedPathFindingAlgorithm = 'aStar';
  selectedMazeAlgorithm = 'none';

  generateMaze(): void {
    if(this.mazeAlgorithm){
      this.mazeAlgorithm.stopVisual();
      this.mazeAlgorithm = null;
    }
    this.createBoard();
    this.createStartNode(this.startRow, this.startCol);
    this.createEndNode(this.endRow, this.endCol);
    switch (this.selectedMazeAlgorithm) {
      case 'randomizedDepthFirstSearch':
        this.mazeAlgorithm = new RandomizedDepthFirstSearch(this.rows, this.cols,this.startRow-1,this.startCol-1,this.endRow-1,this.endCol-1,this.speed);
        break;
      case 'simpleStairMaze':
        this.mazeAlgorithm = new SimpleStairMaze(this.rows, this.cols,this.startRow-1,this.startCol-1,this.endRow-1,this.endCol-1,this.speed);
        break;
      case 'recursiveDivision':
        this.mazeAlgorithm = new RecursiveDivision(this.rows, this.cols,this.startRow-1,this.startCol-1,this.endRow-1,this.endCol-1,this.speed);
        break;
      default:
        break;
    }
    this.mazeAlgorithm?.startVisual();
  }

  createBoard(): void {
    const width = 1200;
    const height = 600;
    const container = document.querySelector('.container');


    container!.setAttribute(
      'style',
      `grid-template-rows: repeat(${this.rows}, ${height / this.rows}px);grid-template-columns: repeat(${this.cols}, ${width / this.cols}px);`
    );
    // container!.setAttribute(
    //   'style',
    //   `grid-template-columns: repeat(${this.cols}, ${width / this.cols}px);`
    // );

    container!.innerHTML = '';
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let temp = this.createNode(i, j);
        container!.appendChild(temp);
      }
    }
    // container!.addEventListener('mousedown', () => {
    //   console.log('this.isMouseDown :>> ', this.isMouseDown);
    //   this.isMouseDown = true;
    // });
    // container!.addEventListener('mouseup', () => {
    //   this.isMouseDown = false;
    // });
    // container!.addEventListener('mousedown', this.setWallAttribute);
    // container!.addEventListener('mouseover', this.setWallAttribute);
    // container!.addEventListener('mouseup', this.setWallAttribute);
  }

  createNode(row: number, col: number): HTMLElement {
    // console.log(row, col);

    let temp = document.createElement('div');
    temp.classList.add('before_start_node');
    temp.setAttribute('row', row.toString());
    temp.setAttribute('col', col.toString());
    temp.setAttribute('wall', 'false');
    temp.setAttribute('parent', 'null');
    temp.setAttribute('border', '1px solid black');
    temp.innerHTML = '';
    return temp;
  }

  setWallAttribute(event: any) {
    // console.log('this.isMouseDown2 :>> ', this.isMouseDown);
    if (this.isMouseDown) {
      if (event.target.classList.contains('before_start_node')) {
        const row = event.target.getAttribute('row');
        const col = event.target.getAttribute('col');
        if (
          (row == this.startRow-1 && col == this.startCol-1) ||
          (this.endRow-1 == row && this.endCol-1 == col)
        ) {
          this._snackBar.open('不能选择起点或终点！');
        } else {
          event.target.classList.toggle('wall');
          if (event.target.classList.contains('wall')) {
            event.target.setAttribute('wall', 'true');
          } else {
            event.target.setAttribute('wall', 'false');
          }
        }
      }
    }
  }

  onMouseDown(event: any) {
    this.isMouseDown = true;
    this.setWallAttribute(event);
  }

  onMouseUp(event: any) {
    this.isMouseDown = false;
    this.setWallAttribute(event);
  }

  reset() {
    this.rows = 20;
    this.cols = 40;
    this.startRow = 10;
    this.startCol = 10;
    this.endRow = 10;
    this.endCol = 30;
    this.speed = 100;
    this.isWeighted = false;
    this.selectedPathFindingAlgorithm = 'aStar';
    this.selectedMazeAlgorithm = 'none';
    this.createBoard();
    this.createStartNode(this.startRow, this.startCol);
    this.createEndNode(this.endRow, this.endCol);
  }

  createStartNode(x: number, y: number) {
    const container = document.querySelector('.container');
    const startNode = container!.querySelector(`div[row="${x-1}"][col="${y-1}"]`);
    startNode!.setAttribute('cost', String(0));
    startNode!.setAttribute('class', 'ends');
    startNode!.innerHTML = 'S';
  }

  createEndNode(x: number, y: number) {
    const container = document.querySelector('.container');
    const endNode = container!.querySelector(`div[row="${x-1}"][col="${y-1}"]`);
    endNode!.setAttribute('class', 'ends');
    endNode!.innerHTML = 'E';
  }

  visualStart():void {
    if(this.selectedPathFindingAlgorithm == 'aStar'){
      this.pathFindingAlgorithm = new AStar(this.rows, this.cols, this.startRow-1, this.startCol-1, this.endRow-1, this.endCol-1, this.speed);
    }
    else if(this.selectedPathFindingAlgorithm == 'dijkstra'){
      if(this.isWeighted){
        this.pathFindingAlgorithm = new Dijkstra(this.rows, this.cols, this.startRow-1, this.startCol-1, this.endRow-1, this.endCol-1, this.speed);
      }
      else{
        this.pathFindingAlgorithm = new BreadthFirstSearch(this.rows, this.cols, this.startRow-1, this.startCol-1, this.endRow-1, this.endCol-1, this.speed)
      }
    }else if(this.selectedPathFindingAlgorithm == 'bfs'){
      this.pathFindingAlgorithm = new BreadthFirstSearch(this.rows, this.cols, this.startRow-1, this.startCol-1, this.endRow-1, this.endCol-1, this.speed);
    }
    else if(this.selectedPathFindingAlgorithm == 'dfs'){
      console.log('dfs');
      this.pathFindingAlgorithm = new DepthFirstSearch(this.rows, this.cols, this.startRow-1, this.startCol-1, this.endRow-1, this.endCol-1, this.speed);
    }
    this.pathFindingAlgorithm!.startVisual();
  }
  // 用于给图设置权值
  changeNodeWeight() {
    console.log(this.isWeighted);
    if(this.isWeighted){
      for(let i=0;i<this.rows;i++){
        for(let j=0;j<this.cols;j++){
          let widget = Math.ceil(Math.random()*10);
          if((i==this.startRow-1&&j==this.startCol-1)||(i==this.endRow-1&&j==this.endCol-1)){
            widget = 0;
          }
          let temp = document.querySelector(`div[row="${i}"][col="${j}"]`);
          temp!.setAttribute('weight', widget.toString());
          if((i==this.startRow-1&&j==this.startCol-1)||(i==this.endRow-1&&j==this.endCol-1)){

          }else {
            temp!.innerHTML = widget.toString();
          }
        }
      }
    }else{
      for(let i=0;i<this.rows;i++){
        for(let j=0;j<this.cols;j++){
          let temp = document.querySelector(`div[row="${i}"][col="${j}"]`);
          temp!.removeAttribute('weight');
          temp!.innerHTML = '';
        }
      }
    }
  }

  changeSpeedDynamically() {
    if(this.pathFindingAlgorithm!=null){
      this.pathFindingAlgorithm!.speed = this.speed;
    }
    if(this.mazeAlgorithm!=null){
      this.mazeAlgorithm!.speed = this.speed;
    }
  }

  algorithmChange() {
    if(this.pathFindingAlgorithm){
      this.reset();
      this.pathFindingAlgorithm!.stopVisual();
      this.pathFindingAlgorithm = null;
    }
    if(this.mazeAlgorithm){
      this.reset();
      this.mazeAlgorithm!.stopVisual();
      this.mazeAlgorithm = null;
    }
  }
}
