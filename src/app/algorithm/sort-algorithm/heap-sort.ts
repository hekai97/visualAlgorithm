import {SortAlgorithm} from "./sort-algorithm";

export class HeapSort extends SortAlgorithm {
  sort(): void {
    // 堆排序
    // 1. 构建大顶堆
    for (let i = Math.floor(this.arrayCopy.length / 2) - 1; i >= 0; i--) {
      this.heapify(this.arrayCopy, i, this.arrayCopy.length);
    }
    // 2. 排序
    for (let i = this.arrayCopy.length - 1; i > 0; i--) {
      this.swapWithCopy(0, i);
      // this.addSwap(0, i, this.count++);
      this.addSwapAnimation(0, i);
      this.heapify(this.arrayCopy, 0, i);
    }
  }

  private heapify(newArray: number[], i: number, length: number) {
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    let largest = i;
    if (left < length && newArray[left] > newArray[largest]) {
      // this.addCompare(left, largest, this.count++);
      this.addCompareAnimation(left, largest);
      largest = left;
    }
    if (right < length && newArray[right] > newArray[largest]) {
      // this.addCompare(right, largest, this.count++);
      this.addCompareAnimation(left, largest);
      largest = right;
    }
    if (largest != i) {
      this.swapWithCopy(i, largest);
      // this.addSwap(i, largest, this.count++);
      this.addSwapAnimation(i, largest);
      this.heapify(newArray, largest, length);
    }
  }
}
