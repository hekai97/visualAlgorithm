import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './path-finding.component.html',
  styleUrls: ['./path-finding.component.css'],
})
export class PathFindingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('PathFindingComponent');
    this.createBoard();
  }
  // 默认地图大小
  rows = 20;
  cols = 40;
  startRow = 1;
  startCol = 1;
  endRow = 20;
  endCol = 40;
  speed = 100;
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
    const container = document.querySelector('.container');
    container!.setAttribute('style', `grid-template-rows: repeat(${this.rows}, 30px);`);
    container!.setAttribute('style', `grid-template-columns: repeat(${this.cols}, 30px);`);

    container!.innerHTML = '';
    for (let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        let temp = this.createNode(i, j);
        container!.appendChild(temp);
      }
    }
  }
  createNode(row: number, col: number): HTMLElement {
    let temp = document.createElement('div');
    temp.setAttribute('class', 'before_start_node');
    temp.setAttribute('row', row.toString());
    temp.setAttribute('col', col.toString());
    temp.setAttribute('wall', 'false');
    temp.setAttribute('parent', 'null');
    temp.setAttribute('distance', 'Infinity');
    temp.setAttribute('border','1px solid black')
    temp.innerHTML = '1';
    return temp;
  }
}
