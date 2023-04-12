import {SortAlgorithm} from "./sort-algorithm";

export class MergeSort extends SortAlgorithm {
  sort(): void {
    this.mergeSort(this.arrayCopy, 0, this.arrayCopy.length - 1);
  }

  private mergeSort(newArray: number[], left: number, right: number) {
    if (left < right) {
      let mid = Math.floor((left + right) / 2);
      this.mergeSort(newArray, left, mid);
      this.mergeSort(newArray, mid + 1, right);
      this.merge(newArray, left, mid, right);
    }
  }

  private merge(newArray: number[], left: number, mid: number, right: number) {
    let i = left;
    let j = mid + 1;
    let k = 0;
    let temp = [];
    while (i <= mid && j <= right) {
      // this.addCompare(i, j, this.count++);
      this.addCompareAnimation(i, j);
      if (newArray[i] < newArray[j]) {
        temp[k++] = newArray[i++];
      } else {
        temp[k++] = newArray[j++];
      }
    }
    while (i <= mid) {
      temp[k++] = newArray[i++];
    }
    while (j <= right) {
      temp[k++] = newArray[j++];
    }
    for (let i = 0; i < k; i++) {
      newArray[left + i] = temp[i];
      // this.addSwap(left + i, left + i, this.count++);
      this.addSwapAnimation(left + i, left + i);
    }
  }
}
