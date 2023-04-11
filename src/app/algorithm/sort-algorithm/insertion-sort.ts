import {SortAlgorithm} from "./sort-algorithm";

export class InsertionSort extends SortAlgorithm {
  sort(): void {
    // 插入排序
    for (let i = 1; i < this.arrayCopy.length; i++) {
      let j = i;
      while (j > 0 && this.arrayCopy[j] < this.arrayCopy[j - 1]) {
        this.addCompare(j, j - 1, this.count++);
        this.swapWithCopy(j, j - 1);
        this.addSwap(j, j - 1, this.count++);
        j--;
      }
    }
  }
}
