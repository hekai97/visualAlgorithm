import {SortAlgorithm} from "./sort-algorithm";

export class QuickSort extends SortAlgorithm {
  sort(): void {
    // let newArray = this.array.slice();
    this.quickSort(this.arrayCopy, 0, this.arrayCopy.length - 1);
  }

  private quickSort(newArray: number[], left: number, right: number) {
    if (left < right) {
      let pivot = this.partition(newArray, left, right);
      this.quickSort(newArray, left, pivot - 1);
      this.quickSort(newArray, pivot + 1, right);
    }
  }

  private partition(newArray: number[], left: number, right: number) {
    let pivot = newArray[left];
    while (left < right) {
      while (left < right && newArray[right] >= pivot) {
        this.addCompare(right, left, this.count++);
        right--;
      }
      this.swapWithCopy(left, right);
      this.addSwap(left, right, this.count++);
      while (left < right && newArray[left] <= pivot) {
        this.addCompare(left, right, this.count++);
        left++;
      }
      this.swapWithCopy(left, right);
      this.addSwap(left, right, this.count++);
    }
    return left;
  }
}
