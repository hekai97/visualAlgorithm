import {SortAlgorithm} from "./sort-algorithm";

export class BubbleSort extends SortAlgorithm {
  sort(): void {
    // 冒泡排序
    for (let i = 0; i < this.arrayCopy.length - 1; i++) {
      for (let j = i + 1; j < this.arrayCopy.length; j++) {
        // this.addCompare(i, j, this.count++);
        this.addCompareAnimation(i, j);
        // if(newArray[i]>newArray[j]) {
        //   let temp = newArray[i];
        //   newArray[i] = newArray[j];
        //   newArray[j] = temp;
        //   this.addSwap(i, j, count++);
        // }
        if (this.arrayCopy[i] > this.arrayCopy[j]) {
          this.swapWithCopy(i, j);
          // this.addSwap(i, j, this.count++);
          this.addSwapAnimation(i, j);
        }
      }
    }
    // this.playAnimationDelay(0,3);
  }

}
