export abstract class BaseAlgorithm {
  private readonly DRAW_CONTROL_TIME = 100;

  // 地图的行数
  private _rows: number;
  // 地图的列数
  private _cols: number;
  // 搜索速度
  private _speed: number;
  // 起点的行数
  private _startRow: number;
  // 起点的列数
  private _startCol: number;
  // 终点的行数
  private _endRow: number;
  // 终点的列数
  private _endCol: number;

  // 该值用来控制绘制路径的速度，每次绘制路径的时间间隔为100/speed
  protected drawTime = 0;

  get rows(): number {
    return this._rows;
  }

  set rows(value: number) {
    this._rows = value;
  }

  get cols(): number {
    return this._cols;
  }

  set cols(value: number) {
    this._cols = value;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    console.log(value);
    this._speed = value;
  }

  get startRow(): number {
    return this._startRow;
  }

  set startRow(value: number) {
    this._startRow = value;
  }

  get startCol(): number {
    return this._startCol;
  }

  set startCol(value: number) {
    this._startCol = value;
  }

  get endRow(): number {
    return this._endRow;
  }

  set endRow(value: number) {
    this._endRow = value;
  }

  get endCol(): number {
    return this._endCol;
  }

  set endCol(value: number) {
    this._endCol = value;
  }
  abstract start(): void;
  protected constructor(
    rows: number,
    cols: number,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    speed: number
  ) {
    this._rows = rows;
    this._cols = cols;
    this._speed = speed;
    this._startRow = startRow;
    this._startCol = startCol;
    this._endRow = endRow;
    this._endCol = endCol;
  }

  /**
   * 获取指定位置的div
   * @param row 哪行
   * @param col 哪列
   * @return HTMLElement|null 如果找到了，就返回div，否则返回null
   */
  getIndexNode(row: number, col: number): HTMLElement | null {
    if(this.isIndexInRange(row,col)){
      return document.querySelector(`div[row="${row}"][col="${col}"]`);
    }
    return null;
  }
  /**
   * 1.执行算法
   * 2.算法执行过程中延迟更新div的状态
   * 3.算法执行完毕后，更新div的状态，用于确定路径
   *
   * 进行抽象，将公用方法放在基类中
   * */

  // protected findParentNodeWithNode(node: HTMLElement): HTMLElement | null {
  //   let parent = node.getAttribute("parent");
  //   if (parent && parent!=='null') {
  //     let [row, col] = parent.split("|");
  //     return this.getIndexNode(parseInt(row), parseInt(col));
  //   }
  //   return null;
  // }

  protected isParent(newRow: number, newCol: number) {
    return this.getIndexNode(newRow, newCol)!==this.getParentNodeWithIndex(newRow, newCol);
  }

  /**
   * 给指定div染色
   * @param x div属性中的row
   * @param y div属性中的col
   * @param color 染的颜色，有红色和绿色两种
   * @private
   * @return void
   */
  protected changeDivColorWithIndex(x: number, y: number, color: Color) {
    let node = this.getIndexNode(x, y);
    if(this.isEndPoint(x,y)||this.isStartPoint(x,y)){
      return;
    }
    if (node) {
      if (color === Color.RED) {
        node.setAttribute('class', 'Path_red');
      } else if (color === Color.GREEN) {
        node.setAttribute('class', 'Path_green');
      }
      if(node!.getAttribute('weight')!==null){
        node!.innerHTML = node!.getAttribute('weight')!+'|'+node!.getAttribute('cost')!;
      }else {
        node!.innerHTML = node!.getAttribute('cost')!;
      }
    }
  }

  /**
   * 延迟染色
   * @param x div属性中的row
   * @param y div属性中的col
   * @param color 染的颜色，有红色和绿色两种
   * @param delay 延迟的时间，单位为毫秒，每次延迟的时间为100/speed
   * @protected
   */
  protected changeDivColorWithIndexDelay(x: number, y: number, color: Color, delay: number) {
    if(delay===0){
      delay = 1;
    }
    setTimeout(() => {
      this.changeDivColorWithIndex(x, y, color);
      if(color===Color.RED&&!this.isStartPoint(x,y)&&!this.isEndPoint(x,y)){
        const node = this.getIndexNode(x, y);
        if(node!.getAttribute('weight')!==null){
          node!.innerHTML = node!.getAttribute('weight')!+'|'+node!.getAttribute('cost')!;
        }else {
          node!.innerHTML = node!.getAttribute('cost')!;
        }
      }
    }, this.drawTime);
    this.drawTime += this.DRAW_CONTROL_TIME/this.speed;
  }

  protected changeDivColorWithNodeDelay(node: HTMLElement, color: Color, delay: number) {
    let index = this.getNodeIndex(node);
    this.changeDivColorWithIndexDelay(index[0], index[1], color, delay);
  }

  /**
   * 绘制最佳路径，从终点开始，一直到起点，将路径染成绿色
   * @protected
   */
  protected drawBestPath() {
    let current = this.getIndexNode(this.endRow, this.endCol)!;
    while (current !== this.getIndexNode(this.startRow, this.startCol)) {
      // current.removeAttribute('Path_red');
      // 将路线染成绿色，但是终点不染色
      if (current !== this.getIndexNode(this.endRow, this.endCol)) {
        this.changeDivColorWithIndexDelay(parseInt(current.getAttribute('row')!), parseInt(current.getAttribute('col')!), Color.GREEN, this.speed);
      }
      // current.setAttribute('class','Path_green');
      const parent = current.getAttribute('parent')!.split('|');
      current = this.getIndexNode(parseInt(parent[0]), parseInt(parent[1]))!;
    }
  }

  /**
   * 判断指定位置是否是墙
   * @param row 哪行
   * @param col 哪列
   * @protected
   * @return boolean 如果是墙，返回true，否则返回false
   */
  protected isWallWithIndex(row: number, col: number): boolean {
    return this.getIndexNode(row, col)!.getAttribute('wall') === 'true';
  }

  protected isWallWithNode(node: HTMLElement): boolean {
    return node.getAttribute('wall') === 'true';
  }

  protected setWallWithIndex(row: number, col: number,wall:boolean) {
    if(this.isStartPoint(row,col)||this.isEndPoint(row,col)){
      return;
    }
    this.getIndexNode(row, col)!.setAttribute('wall', wall.toString());
    if(wall){
      this.getIndexNode(row, col)!.classList.add('wall');
    }else{
      this.getIndexNode(row, col)!.classList.remove('wall');
    }
  }

  protected setWallWithNode(node: HTMLElement,wall:boolean) {
    let [row,col] = this.getNodeIndex(node);
    this.setWallWithIndex(row,col,wall);
  }

  protected setWallWithIndexDelay(row: number, col: number,wall:boolean,delay:number) {
    if(delay===0){
      delay = 1;
    }
    setTimeout(() => {
      this.setWallWithIndex(row,col,wall);
    }, this.drawTime);
    this.drawTime += this.DRAW_CONTROL_TIME/delay;
  }

  protected setWallWithNodeDelay(node: HTMLElement,wall:boolean,delay:number) {
    let [row,col] = this.getNodeIndex(node);
    this.setWallWithIndexDelay(row,col,wall,delay);
  }

  /**
   * 判断指定位置是否已经被访问过
   * @param row 哪行
   * @param col 哪列
   * @protected
   * @return boolean 如果已经被访问过，返回true，否则返回false
   */
  protected isVisitedWithIndex(row: number, col: number): boolean {
    return this.getIndexNode(row, col)!.getAttribute('visited') === 'true';
  }

  protected isVisitedWithNode(node: HTMLElement): boolean {
    return node.getAttribute('visited') === 'true';
  }

  /**
   * 判断指定位置是否是起点
   * @param row 哪行
   * @param col 哪列
   * @protected
   * @return boolean 如果是起点，返回true，否则返回false
   */
  protected isStartPoint(row: number, col: number): boolean {
    return this._startRow === row && this._startCol === col;
  }

  protected isStartNode(node: HTMLElement): boolean {
    return this._startRow === parseInt(node.getAttribute('row')!) && this._startCol === parseInt(node.getAttribute('col')!);
  }

  /**
   * 判断指定位置是否是终点
   * @param row 哪行
   * @param col 哪列
   * @protected
   * @return boolean 如果是终点，返回true，否则返回false
   */
  protected isEndPoint(row: number, col: number): boolean {
    return this._endRow === row && this._endCol === col;
  }

  protected isEndNode(node: HTMLElement): boolean {
    return this._endRow === parseInt(node.getAttribute('row')!) && this._endCol === parseInt(node.getAttribute('col')!);
  }

  /**
   * 设置指定位置的div的访问状态
   * @param row 哪行
   * @param col 哪列
   * @param visited 是否已经被访问过，true表示已经被访问过，false表示未被访问过
   * @protected
   */
  protected setVisitedWithIndex(row: number, col: number, visited: boolean) {
    this.getIndexNode(row, col)!.setAttribute('visited', visited.toString());
  }

  protected setVisitedWithNode(node: HTMLElement, visited: boolean) {
    node.setAttribute('visited', visited.toString());
  }

  /**
   * 设置指定位置的div的父节点
   * @param row 哪行
   * @param col 哪列
   * @param parent 父节点，是一个div
   * @protected
   */
  protected setParentWithIndex(row: number, col: number, parent:HTMLElement): void{
    this.getIndexNode(row, col)!.setAttribute('parent', `${parent.getAttribute('row')}|${parent.getAttribute('col')}`);
  }

  protected setParentWithNode(node: HTMLElement, parent: HTMLElement): void{
    node.setAttribute('parent', `${parent.getAttribute('row')}|${parent.getAttribute('col')}`);
  }


  protected getParentNodeWithIndex(row: number, col: number): HTMLElement | null{
    let parent = this.getIndexNode(row, col)!.getAttribute('parent');
    if (parent === null) {
      return null;
    }
    let parentIndex = parent.split('|');
    return this.getIndexNode(parseInt(parentIndex[0]), parseInt(parentIndex[1]));
  }
  /**
   * 获取指定div的父节点
   * @param node 指定的div
   * @protected
   * @return HTMLElement|null 如果找到了，就返回父div，否则返回null
   */
  protected getParentNodeWithNode(node: HTMLElement): HTMLElement | null{
    let parent = node.getAttribute('parent');
    if (parent === null) {
      return null;
    }
    let parentIndex = parent.split('|');
    return this.getIndexNode(parseInt(parentIndex[0]), parseInt(parentIndex[1]));
  }

  /**
   * 设置指定位置的div的父节点
   * @param row 哪行
   * @param col 哪列
   * @param parentX 父节点的row
   * @param parentY 父节点的col
   * @protected
   */
  protected setParentWithIndexToIndex(row: number, col: number, parentX:number, parentY:number): void{
    this.getIndexNode(row, col)!.setAttribute('parent', `${parentX}|${parentY}`);
  }

  /**
   * 获取指定节点的cost值，该值的作用是用来计算路径的长度
   * @param row 行
   * @param col 列
   * @protected
   * @return number cost值
   */
  protected getNodeCostWithIndex(row: number, col: number): number{
    let cost = this.getIndexNode(row, col)!.getAttribute('cost');
    if (cost === null) {
      return Infinity;
    }
    return parseInt(cost);
  }

  protected getNodeCostWithNode(node: HTMLElement): number{
    return parseInt(node.getAttribute('cost')!);
  }

  /**
   * 设置指定节点的cost值，该值的作用是用来计算路径的长度
   * @param row 行
   * @param col 列
   * @param cost  cost值
   * @protected
   * @return number cost值
   */
  protected setNodeCostWithIndex(row: number, col: number, cost: number): void{
    this.getIndexNode(row, col)!.setAttribute('cost', cost.toString());
  }

  protected setNodeCostWithNode(node: HTMLElement, cost: number): void{
    node.setAttribute('cost', cost.toString());
  }

  /**
   * 返回指定节点的索引值，该索引值是节点的一个属性，返回值类型为[number, number]
   * @param node
   * @protected
   */
  protected getNodeIndex(node: HTMLElement): [number, number]{
    return [parseInt(node.getAttribute('row')!), parseInt(node.getAttribute('col')!)];
  }

  protected isIndexInRange(row: number, col: number): boolean{
    // console.log(row, col,'此时的行列,总行列为',this.rows,this.cols);
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  ///////////////////////////////////////////重构///////////////////////////////////////////////////////////////////
  ChangeColorQueue: ChangeColor[] = [];
  timer: number = 0;
  isEnd:boolean = false;
  protected addChangeColorQueue(row: number, col: number, color: Color): void{
    this.ChangeColorQueue.push({row, col, color});
  }

  private findPathNodeAddToQueue() {
    let current = this.getIndexNode(this.endRow, this.endCol);
    while (current&&current !== this.getIndexNode(this.startRow, this.startCol)) {
      // current.removeAttribute('Path_red');
      // 将路线染成绿色，但是终点不染色
      if (current !== this.getIndexNode(this.endRow, this.endCol)) {
        this.addChangeColorQueue(parseInt(current!.getAttribute('row')!), parseInt(current!.getAttribute('col')!), Color.GREEN);
      }
      // current.setAttribute('class','Path_green');
      const parent = current!.getAttribute('parent')!.split('|');
      current = this.getIndexNode(parseInt(parent[0]), parseInt(parent[1]))!;
    }
  }


  // TODO 需要在这里更改div颜色的时候将cost值也更改
  private playAnimation(): void{
    let changeColor = this.ChangeColorQueue.shift();
    if(changeColor){
      this.changeDivColorWithIndex(changeColor.row, changeColor.col, changeColor.color);
    }else{
      this.isEnd = true;
    }
    this.timer = setTimeout(()=>{
      this.playAnimation();
    },this.getCalculateSpeed());
  }

  protected getCalculateSpeed() {
    // return 1000 - 9 * this.speed;
    return 1000/this.speed;
  }

  public startVisual():void {
    this.start();
    this.findPathNodeAddToQueue();
    this.playAnimation();
  }

  public stopVisual():void {
    clearTimeout(this.timer);
    this.isEnd = true;
  }
  /**
   * 更改思路，将所有需要染色的都放在一个队列中，统一处理*/
}

interface ChangeColor {
  row: number;
  col: number;
  color:Color;
}

export enum Color {
  RED ,
  GREEN
}
