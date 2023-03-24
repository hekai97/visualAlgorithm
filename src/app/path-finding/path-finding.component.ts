import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './path-finding.component.html',
  styleUrls: ['./path-finding.component.css'],
})
export class PathFindingComponent implements OnInit {
  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    console.log('PathFindingComponent');
    this.createBoard();
    this.createStartNode();
    this.createEndNode();
  }
  // 默认地图大小
  rows = 20;
  cols = 40;
  startRow = 1;
  startCol = 1;
  endRow = 20;
  endCol = 40;
  speed = 100;
  isMouseDown = false;
  pathFindingAlgorithms = [
    { name: 'A*', value: 'aStar' },
    { name: 'Dijkstra', value: 'dijkstra' },
    { name: 'BFS', value: 'bfs' },
    { name: 'DFS', value: 'dfs' },
  ];
  mazeAlgorithms = [
    { name: 'None', value: 'none' },
    { name: 'Recursive Division', value: 'recursiveDivision' },
    { name: 'Randomized Prim', value: 'randomizedPrim' },
    { name: 'Randomized Kruskal', value: 'randomizedKruskal' },
  ];

  selectedPathFindingAlgorithm = 'aStar';
  selectedMazeAlgorithm = 'none';

  print(): void {
    console.log(this.rows);
    console.log(this.cols);
    console.log(this.startRow);
    console.log(this.startCol);
    console.log(this.endRow);
    console.log(this.endCol);
    console.log(this.speed);
    console.log(this.selectedPathFindingAlgorithm);
  }
  createBoard(): void {
    var width = 1200;
    var height = 600;
    const container = document.querySelector('.container');

    container!.setAttribute(
      'style',
      `grid-template-rows: repeat(${this.rows}, ${height / this.rows}px);`
    );
    container!.setAttribute(
      'style',
      `grid-template-columns: repeat(${this.cols}, ${width / this.cols}px);`
    );

    container!.innerHTML = '';
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let temp = this.createNode(i+1, j+1);
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
    console.log(row, col);

    let temp = document.createElement('div');
    temp.classList.add('before_start_node');
    temp.setAttribute('row', row.toString());
    temp.setAttribute('col', col.toString());
    temp.setAttribute('wall', 'false');
    temp.setAttribute('parent', 'null');
    temp.setAttribute('border', '1px solid black');
    temp.innerHTML = ' ';
    return temp;
  }

  setWallAttribute(event: any) {
    console.log('this.isMouseDown2 :>> ', this.isMouseDown);
    if (this.isMouseDown) {
      if (event.target.classList.contains('before_start_node')) {
        const row = event.target.getAttribute('row');
        const col = event.target.getAttribute('col');
        if (
          (row == this.startRow && col == this.startCol) ||
          (this.endRow == row && this.endCol == col)
        ) {
          this._snackBar.open('不能选择起点或终点！');
        } else {
          event.target.classList.toggle('wall');
          if (event.target.classList.contains('wall')) {
            event.target.setAttribute('wall', 1);
          } else {
            event.target.setAttribute('wall', 0);
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
    this.startRow = 1;
    this.startCol = 1;
    this.endRow = 20;
    this.endCol = 40;
    this.speed = 100;
    this.selectedPathFindingAlgorithm = 'aStar';
    this.selectedMazeAlgorithm = 'none';
    this.createBoard();
  }

  createStartNode() {
    const container = document.querySelector('.container');
    const startNode = container!.querySelector(`[row="${this.startRow}"][col="${this.startCol}"]`);
    startNode!.classList.remove('before_start_node');
    startNode!.classList.add('start_node');
    startNode!.innerHTML = 'S';
  }

  createEndNode() {
    const container = document.querySelector('.container');
    const endNode = container!.querySelector(`[row="${this.endRow}"][col="${this.endCol}"]`);
    endNode!.classList.remove('before_start_node');
    endNode!.classList.add('end_node');
    endNode!.innerHTML = 'E';
  }
}
