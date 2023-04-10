import {animate, AnimationBuilder, keyframes, style} from "@angular/animations";

export abstract class SortAlgorithm {
  array: number[];
  private _speed: number;
  // 单位，毫秒
  delay: number = 0;
  isEnd: boolean = false;
  // 数组，存放每次比较的两个元素的索引以及这是第几次比较
  compareArray: number[][] = [];
  // 数组，存放每次交换的两个元素的索引以及这是第几次交换
  swapArray: number[][] = [];

  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    console.log(this.delay);
    this._speed = value;
  }


  constructor(array: number[], speed: number, private animationBuilder: AnimationBuilder) {
    this.array = array;
    this._speed = speed;
  }
  startSort() {
    this.sort();
    console.log(this.compareArray);
    console.log(this.swapArray);
    this.isEnd = false;
    // this.playAnimation();
  }

  abstract sort(): void;

  protected addCompare(i: number, j: number, count: number) {
    this.compareArray.push([i, j, count]);
  }
  protected addSwap(i: number, j: number, count: number) {
    this.swapArray.push([i, j, count]);
  }
  protected swap(i: number, j: number) {
    let temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;
  }

  protected isIndexValid(index: number): boolean {
    return index >= 0 && index < this.array.length;
  }

  protected getDivByIndex(index: number): HTMLElement {
    // return document.querySelector(`.sort-item .bubbleSort[id="${index}"]`) as HTMLElement;
    // 找到class=sort-item bubbleSort,id=index的div元素
    return document.querySelector(`.sort-item[id="${index}"]`) as HTMLElement;
  }

  protected playSwapAnimation(i: number, j: number) {
    if (!this.isIndexValid(i) || !this.isIndexValid(j)) {
      return;
    }
    // this.setBackGroundColor(i,SortColor.GREENYELLOW);
    // this.setBackGroundColor(j,SortColor.GREENYELLOW);
    let right = Math.max(i, j);
    let left = Math.min(i, j);
    let length = right - left;
    let leftDiv = this.getDivByIndex(left);
    let rightDiv = this.getDivByIndex(right);
    console.log(leftDiv);
    console.log(rightDiv);
    let divWidth = leftDiv.getBoundingClientRect().width;
    let divHeight = leftDiv.getBoundingClientRect().height;
    console.log('i=', i, 'j=', j,'array[i]=',this.array[i],'array[j]=',this.array[j], 'length=', length, 'divWidth=', divWidth, 'divHeight=', divHeight, '从i到j移动距离为', length * divWidth);
    const factory = this.animationBuilder.build([
      animate(`${10*1000/this.speed}ms ease-in-out`, keyframes([
          // 左边的div先向上移动，然后向右移动，最后向下移动
          style({transform: `translateY(-${divHeight}px) translateX(0)`, offset: 0.3}),
          style({transform: `translateY(-${divHeight}px) translateX(${length * divWidth}px)`, offset: 0.7}),
          style({transform: `translateY(0) translateX(${length * divWidth}px)`, offset: 1}),
        ])
      )]);
    const factory2 = this.animationBuilder.build([
      animate(`${10*1000/this.speed}ms ease-in-out`, keyframes([
          // 右边的div先向下移动，然后向左移动，最后向上移动
          style({transform: `translateY(${divHeight}px) translateX(0)`, offset: 0.3}),
          style({transform: `translateY(${divHeight}px) translateX(-${length * divWidth}px)`, offset: 0.7}),
          style({transform: `translateY(0) translateX(-${length * divWidth}px)`, offset: 1}),
        ])
      )]);
    const player = factory.create(leftDiv);
    const player2 = factory2.create(rightDiv);
    player.play();
    player2.play();
    player.onDone(() => {
      player2.onDone(() => {
        // 交换div的id
        console.log("done")
        // leftDiv.id = right.toString();
        // rightDiv.id = left.toString();
        this.swap(i, j);
        player.destroy();
        player2.destroy();
        this.setBackGroundColor(i,SortColor.GREEN);
        this.setBackGroundColor(j,SortColor.GREEN);
      })
    })
    // 更改div的id
    // leftDiv.id = right.toString();
    // rightDiv.id = left.toString();
  }

  playSwapAnimationDelay(i: number, j: number) {
    setTimeout(() => {
      this.playSwapAnimation(i, j);
    }, this.delay);
    this.delay += 10*1000 / this.speed;
  }

  protected setBackGroundColor(i: number, color: SortColor) {
    let div = this.getDivByIndex(i);
    switch (color) {
      case SortColor.NONE:
        div.style.backgroundColor = 'white';
        break;
      case SortColor.GREEN:
        div.style.backgroundColor = 'green';
        break;
      case SortColor.GREENYELLOW:
        div.style.backgroundColor = 'greenyellow';
        break;
      default:
        div.style.backgroundColor = 'white';
    }
  }

  protected setBackGroundColorDelay(i: number, color: SortColor) {
    setTimeout(() => {
      this.setBackGroundColor(i, color);
    }, this.delay);
    this.delay += 10*1000 / this.speed;
  }

  private playAnimation() {
    // 首先，查看swap数组，如果有元素，就拿到这个count，在compare数组中找到所有比count小的元素，然后顺序执行染色动画
    let lastCount = 0;
    while (this.swapArray.length > 0) {
      let swap = this.swapArray.shift()!;
      let count = swap[2];
      let compareArray = this.compareArray.filter((value) => {
        return value[2] < count&&value[2]>=lastCount;
      });
      lastCount=count;
      let length = compareArray.length;
      for (let i = 0; i < length; i++) {
        this.setBackGroundColorDelay(compareArray[i][0], SortColor.GREENYELLOW);
        this.setBackGroundColorDelay(compareArray[i][1], SortColor.GREENYELLOW);
        if(i-1>=0){
          this.setBackGroundColorDelay(compareArray[i-1][1], SortColor.NONE);
        }
      }
      this.setBackGroundColorDelay(compareArray[0][0], SortColor.GREEN);

      this.playSwapAnimationDelay(swap[0], swap[1]);
    }
  }
}

export enum SortColor {
  NONE = 'none',
  GREEN = 'green',
  GREENYELLOW = 'greenyellow',
}
