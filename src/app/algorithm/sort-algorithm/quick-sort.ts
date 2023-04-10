import {SortAlgorithm} from "./sort-algorithm";

export class QuickSort extends SortAlgorithm {
  count: number = 0;
  sort(): void {
    let newArray = this.array.slice();
    this.quickSort(newArray, 0, newArray.length - 1);
  }

  private quickSort(newArray: number[], number: number, number2: number) {
    if (number < number2) {
      let pivot = this.partition(newArray, number, number2);
      this.quickSort(newArray, number, pivot - 1);
      this.quickSort(newArray, pivot + 1, number2);
    }
  }

  private partition(newArray: number[], number: number, number2: number) {
    let pivot = newArray[number2];
    let i = number - 1;
    for (let j = number; j < number2; j++) {
      this.addCompare(j, number2, this.count++);
      if (newArray[j] < pivot) {
        i++;
        this.addSwap(i, j, this.count++);
      }
    }
    this.addSwap(i + 1, number2, this.count++);
    return i + 1;
  }
}
