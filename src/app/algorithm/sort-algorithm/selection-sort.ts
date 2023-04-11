import {SortAlgorithm} from "./sort-algorithm";

export class SelectionSort extends SortAlgorithm {
  sort(): void {
    // 选择排序
    for (let i = 0; i < this.arrayCopy.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < this.arrayCopy.length; j++) {
        this.addCompare(minIndex, j, this.count++);
        if (this.arrayCopy[j] < this.arrayCopy[minIndex]) {
          minIndex = j;
        }
      }
      this.swapWithCopy(i, minIndex);
      this.addSwap(i, minIndex, this.count++);
    }
  }
}
