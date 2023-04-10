import {SortAlgorithm} from "./sort-algorithm";

export class BubbleSort extends SortAlgorithm{
  sort(): void {
    // 获得一份array的copy
    let newArray = this.array.slice();
    let count = 0;
    // 冒泡排序
    for (let i = 0; i < newArray.length-1; i++) {
      for(let j = i+1;j<newArray.length;j++) {
        this.addCompare(i, j, count++);
        if(newArray[i]>newArray[j]) {
          let temp = newArray[i];
          newArray[i] = newArray[j];
          newArray[j] = temp;
          this.addSwap(i, j, count++);
        }
      }
    }
    // this.playAnimationDelay(0,3);
  }

}
