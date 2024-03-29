import {animate, AnimationBuilder, keyframes, style} from "@angular/animations";

interface AnimationQueue {
  type: string;
  i: number;
  j: number;
  count: number;
}

export abstract class SortAlgorithm {
  array: number[];
  arrayCopy: number[];
  count: number = 0;
  private _speed: number;
  // 单位，毫秒
  // delay: number = 0;
  isEnd: boolean = false;
  // 数组，存放每次比较的两个元素的索引以及这是第几次比较
  // compareArray: number[][] = [];
  // 数组，存放每次交换的两个元素的索引以及这是第几次交换
  // swapArray: number[][] = [];

  // 动画序列
  animationQueue: AnimationQueue[] = [];

  // 这两个值用于给前端页面展示
  swapCount: number = 0;
  compareCount: number = 0;

  // timers: number[] = [];
  sortTimer: number | undefined;

  get speed(): number {
    return this._speed;
  }

  /**
   * this.speed的范围是[1, 100]，这里将其映射到[1000, 100]，即速度越快，延迟越小，这里只是近似地映射，实际上并不是线性的
   */
  getCalculateSpeed(): number {
    // return 1000 / this.speed;
    return 1000 - 9 * this.speed;
  }

  set speed(value: number) {
    this._speed = value;
  }


  /**
   * 构造函数
   * @param array 要排序的数组
   * @param speed 排序速度，范围是[1, 100]，值越大，速度越快
   * @param animationBuilder  用于创建动画的AnimationBuilder
   */
  constructor(array: number[], speed: number, private animationBuilder: AnimationBuilder) {
    this.array = array;
    this.arrayCopy = array.slice();
    this._speed = speed;
  }

  /**
   * 该方法是排序的抽象方法，子类必须实现该方法
   * @protected
   */
  protected abstract sort(): void;

  /**
   * 该方法是对外公开的排序方法，子类不应该重写该方法，只能在重写sort方法后，由别的类来调用该方法
   */
  public startSort() {
    this.sort();
    this.beforePlayAnimation();
    this.playAnimationQueue(0);
    // this.afterPlayAnimation();
  }

  /**
   * 该方法的作用是对动画序列进行播放，其中需要注意的是根据动画序列中的type来确定是播放比较动画还是交换动画
   * 然后给比较次数和交换次数赋值，这是一个递归的定时器，每次播放完一个动画后，都会调用自身，直到播放完所有的动画
   * 这样可以实现随着外部速度的变化，动画的播放速度也会变化
   * @param index
   * @private
   */
  private playAnimationQueue(index: number) {
    if (index >= this.animationQueue.length) {
      this.isEnd = true;
      this.afterPlayAnimation();
      return;
    } else {
      let animation = this.animationQueue[index];
      if (animation.type === 'compare') {
        this.playCompareAnimation(index);
        this.compareCount++;
      } else if (animation.type === 'swap') {
        this.playSwapAnimation(animation.i, animation.j);
        if (animation.i !== animation.j) {
          this.swapCount++;
        }
      }
      this.sortTimer = setTimeout(() => {
        this.playAnimationQueue(index + 1);
      }, this.getCalculateSpeed());
    }
  }

  // protected addCompare(i: number, j: number, count: number) {
  //   this.compareArray.push([i, j, count]);
  // }

  // protected addSwap(i: number, j: number, count: number) {
  //   this.swapArray.push([i, j, count]);
  // }

  /**
   * 这是真正的交换方法，交换的是array数组中的元素，子类不应该用到此方法
   * @param i 交换的第一个元素的索引
   * @param j 交换的第二个元素的索引
   * @private
   */
  private swap(i: number, j: number) {
    let temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;
  }

  /**
   * 这个方法是交换arrayCopy数组中的元素，子类所有的交换都是在arrayCopy数组中进行的，因此，交换的时候使用此方法。
   * @param i
   * @param j
   * @protected
   */
  protected swapWithCopy(i: number, j: number) {
    let temp = this.arrayCopy[i];
    this.arrayCopy[i] = this.arrayCopy[j];
    this.arrayCopy[j] = temp;
  }

  /**
   * 判断索引是否有效
   * @param index
   * @protected
   */
  protected isIndexValid(index: number): boolean {
    return index >= 0 && index < this.array.length;
  }

  /**
   * 通过索引找到对应的div元素
   * @param index 索引
   * @protected
   */
  protected getDivByIndex(index: number): HTMLElement {
    // return document.querySelector(`.sort-item .bubbleSort[id="${index}"]`) as HTMLElement;
    // 找到class=sort-item bubbleSort,id=index的div元素
    return document.querySelector(`.sort-item[id="${index}"]`) as HTMLElement;
  }

  /**
   * 说明：该方法是染色的核心，主要用到了Angular的动画，因为在sorting.component.ts中，如果直接使用静态动画，就无法实现动画的变速，
   * 因此，在这里使用了动画的编程方式，即使用AnimationBuilder来构建动画，然后直接找到对应的div元素，使用动画来实现染色。
   * 这里的动画是使用了keyframes，即关键帧，即在某个时间点，某个div元素的某个属性的值是多少，这样就可以实现动画的路径变化，
   * 这里的div变化会有这么几种状态，首先，左边的div先向上移动，然后向右移动，最后向下移动，右边的div先向下移动，然后向左移动，最后向上移动，
   * @param i 待排序数组的索引
   * @param j 待排序数组的索引
   * @protected
   */
  protected playSwapAnimation(i: number, j: number) {
    if (!this.isIndexValid(i) || !this.isIndexValid(j)) {
      return;
    }
    if (i === j) {
      return;
    }
    this.setBackGroundColor(i, SortColor.YELLOW);
    this.setBackGroundColor(j, SortColor.YELLOW);
    let right = Math.max(i, j);
    let left = Math.min(i, j);
    let length = right - left;
    let leftDiv = this.getDivByIndex(left);
    let rightDiv = this.getDivByIndex(right);
    let divWidth = leftDiv.getBoundingClientRect().width;
    let divHeight = leftDiv.getBoundingClientRect().height;
    const factory = this.animationBuilder.build([
      animate(`${this.getCalculateSpeed()}ms ease-in-out`, keyframes([
          // 左边的div先向上移动，然后向右移动，最后向下移动
          style({transform: `translateY(-${divHeight}px) translateX(0)`, offset: 0.3}),
          style({transform: `translateY(-${divHeight}px) translateX(${length * divWidth}px)`, offset: 0.7}),
          style({transform: `translateY(0) translateX(${length * divWidth}px)`, offset: 1}),
        ])
      )]);
    const factory2 = this.animationBuilder.build([
      animate(`${this.getCalculateSpeed()}ms ease-in-out`, keyframes([
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
        this.setBackGroundColor(i, SortColor.GREENYELLOW);
        this.setBackGroundColor(j, SortColor.GREENYELLOW);
      })
    })
    // 更改div的id
    // leftDiv.id = right.toString();
    // rightDiv.id = left.toString();
  }

  // playSwapAnimationDelay(i: number, j: number) {
  //   let id = setTimeout(() => {
  //     this.playSwapAnimation(i, j);
  //   }, this.delay);
  //   this.timers.push(id);
  //   this.adjustDelay();
  // }

  /**
   * 设置div的背景颜色
   * @param i 索引
   * @param color 颜色
   * @link SortColor
   * @protected
   */
  protected setBackGroundColor(i: number, color: SortColor) {
    let div = this.getDivByIndex(i);
    switch (color) {
      case SortColor.NONE:
        div.classList.remove(SortColor.YELLOW, SortColor.GREENYELLOW);
        break;
      case SortColor.GREENYELLOW:
        div.classList.remove(SortColor.YELLOW);
        div.classList.add(SortColor.GREENYELLOW);
        break;
      case SortColor.YELLOW:
        div.classList.remove(SortColor.GREENYELLOW);
        div.classList.add(SortColor.YELLOW);
        break;
      default:
        break;
    }
  }

  /**
   * 判断div是否有某种颜色
   * @param i 索引
   * @param color 颜色
   * @private
   */
  private hasBackGroundColor(i: number, color: SortColor): boolean {
    let div = this.getDivByIndex(i);
    switch (color) {
      case SortColor.NONE:
        return !div.classList.contains(SortColor.YELLOW) && !div.classList.contains(SortColor.GREENYELLOW);
      case SortColor.GREENYELLOW:
        return div.classList.contains(SortColor.GREENYELLOW);
      case SortColor.YELLOW:
        return div.classList.contains(SortColor.YELLOW);
      default:
        return false;
    }
  }

  // protected setBackGroundColorDelay(i: number, color: SortColor) {
  //   let id = setTimeout(() => {
  //     this.setBackGroundColor(i, color);
  //   }, this.delay);
  //   this.adjustDelay();
  //   this.timers.push(id);
  // }

  /**
   * 播放动画
   * 说明：该动画是通过比较数组和交换数组来实现的，比较数组中存放的是比较的两个元素的下标，交换数组中存放的是交换的两个元素的下标
   * 1.首先，查看swap数组，如果有元素，就拿到这个count，在compare数组中找到所有比count小的元素，然后顺序执行染色动画
   * 2.然后，查看compare数组，如果有元素，就对其中的元素进行染色动画
   * 3.最后，查看swap数组，如果有元素，就对其中的元素进行交换动画
   *
   * @private
   */
  // private playAnimation() {
  //   // 首先，查看swap数组，如果有元素，就拿到这个count，在compare数组中找到所有比count小的元素，然后顺序执行染色动画
  //   let lastCount = 0;
  //   while (this.swapArray.length > 0) {
  //     let swap = this.swapArray.shift()!;
  //     let count = swap[2];
  //     let compareArray = this.compareArray.filter((value) => {
  //       return value[2] < count && value[2] >= lastCount;
  //     });
  //     lastCount = count;
  //     let length = compareArray.length;
  //     for (let i = 0; i < length; i++) {
  //       this.setBackGroundColorDelay(compareArray[i][0], SortColor.YELLOW);
  //       this.setBackGroundColorDelay(compareArray[i][1], SortColor.YELLOW);
  //       this.addCompareCountDelay();
  //       this.setBackGroundColorDelay(compareArray[i][0], SortColor.NONE);
  //       this.setBackGroundColorDelay(compareArray[i][1], SortColor.NONE);
  //       if (i - 1 >= 0) {
  //         this.setBackGroundColorDelay(compareArray[i - 1][1], SortColor.NONE);
  //       }
  //     }
  //     if (length > 0) {
  //       this.setBackGroundColorDelay(compareArray[0][0], SortColor.GREENYELLOW);
  //     }
  //
  //     this.playSwapAnimationDelay(swap[0], swap[1]);
  //     this.addSwapCountDelay();
  //   }
  // }

  // timerInterval: any;
  // lastCount =0;
  // private playAnimationByTimer() {
  //   this.timerInterval = setInterval(() => {
  //     console.log('现在的速度是：',this.speed);
  //     if (this.swapArray.length > 0) {
  //       let swap = this.swapArray.shift()!;
  //       let count = swap[2];
  //       let compareArray = this.compareArray.filter((value) => {
  //         return value[2] < count && value[2] >= this.lastCount;
  //       });
  //       this.lastCount = count;
  //       let length = compareArray.length;
  //       for (let i = 0; i < length; i++) {
  //         this.setBackGroundColor(compareArray[i][0], SortColor.YELLOW);
  //         this.setBackGroundColor(compareArray[i][1], SortColor.YELLOW);
  //         this.setBackGroundColor(compareArray[i][0], SortColor.NONE);
  //         this.setBackGroundColor(compareArray[i][1], SortColor.NONE);
  //         if (i - 1 >= 0) {
  //           this.setBackGroundColor(compareArray[i - 1][1], SortColor.NONE);
  //         }
  //       }
  //       if (length > 0) {
  //         this.setBackGroundColor(compareArray[0][0], SortColor.GREENYELLOW);
  //       }
  //
  //       this.playSwapAnimation(swap[0], swap[1]);
  //     } else {
  //       clearInterval(this.timerInterval);
  //     }
  //   }, 2000 / this.speed);
  // }

  /**
   * 播放动画之前的准备工作，主要是将isEnd设置为false，这样就可以阻止用户在动画播放的时候进行其他操作
   * @private
   */
  private beforePlayAnimation() {
    this.isEnd = false;
    // this.delay = 0;
  }

  /**
   * 播放动画之后的工作，主要是将isEnd设置为true，这样可以在动画播放完成之后才允许用户操作按钮，
   * 在sort.component.ts中，按钮的disabled属性就是根据这个值来判断的
   * @private
   */
  private afterPlayAnimation() {
    setTimeout(() => {
      this.isEnd = true;
      // 查看是否全部染色，如果没有染色的话就染色
      for (let i = 0; i < this.array.length; i++) {
        if (!this.hasBackGroundColor(i, SortColor.GREENYELLOW)) {
          this.setBackGroundColor(i, SortColor.GREENYELLOW);
        }
      }
    }, this.getCalculateSpeed());
  }

  // private adjustDelay() {
  //   console.log('当前速度为：',this.speed);
  //   this.delay += 1000 / this.speed;
  // }

  // private addCompareCountDelay() {
  //   let id = setTimeout(() => {
  //     this.compareCount++;
  //   }, this.delay);
  //   this.adjustDelay();
  //   this.timers.push(id);
  // }

  /**
   * 添加比较动画，将比较的两个元素的下标和count值放入animationQueue中
   * @param i
   * @param j
   * @protected
   */
  protected addCompareAnimation(i: number, j: number) {
    this.animationQueue.push({type: 'compare', i: i, j: j, count: this.count++});
  }

  /**
   * 添加交换动画，将交换的两个元素的下标和count值放入animationQueue中
   * @param i
   * @param j
   * @protected
   */
  protected addSwapAnimation(i: number, j: number) {
    this.animationQueue.push({type: 'swap', i: i, j: j, count: this.count++});
  }

  // private addSwapCountDelay() {
  //   let id = setTimeout(() => {
  //     this.swapCount++;
  //   }, this.delay);
  //   this.adjustDelay();
  //   this.timers.push(id);
  // }

  /**
   * 停止排序，将所有的div染回原来的颜色，清除定时器
   */
  stopSort() {
    // for (let timer of this.timers) {
    //   clearTimeout(timer);
    // }
    // this.timers = [];
    if (this.sortTimer) {
      clearTimeout(this.sortTimer);
    }
    // 将所有的div染回原来的颜色
    for (let i = 0; i < this.array.length; i++) {
      this.setBackGroundColor(i, SortColor.NONE);
    }
    this.isEnd = true;
  }

  /**
   * 移除所有的背景颜色
   */
  public removeBackGroundColor() {
    for (let i = 0; i < this.array.length; i++) {
      this.setBackGroundColor(i, SortColor.NONE);
    }
  }

  /**
   * 播放比较动画，这里的index是指的是animationQueue中的元素的下标
   * @param index
   * @private
   */
  private playCompareAnimation(index: number) {
    // 首先设置它的上一个type=compare的元素的颜色为none，然后设置它的颜色为yellow
    if (index > 0 && index < this.animationQueue.length) {
      let compareArray = this.animationQueue.filter((value) => {
        return value.type === 'compare' && value.count < index;
      });
      let length = compareArray.length;
      if (length > 0) {
        this.setBackGroundColor(compareArray[length - 1].i, SortColor.NONE);
        this.setBackGroundColor(compareArray[length - 1].j, SortColor.NONE);
      }
      this.setBackGroundColor(this.animationQueue[index].i, SortColor.YELLOW);
      this.setBackGroundColor(this.animationQueue[index].j, SortColor.YELLOW);
    }
  }
}

export enum SortColor {
  NONE = 'none',
  GREENYELLOW = 'background-greenyellow',
  YELLOW = 'background-yellow',
}
