import {SortAlgorithm} from "./sort-algorithm";

export class CountingSort extends SortAlgorithm {
  sort(): void {
    // 计数排序
    let max = this.arrayCopy[0];
    for (let i = 1; i < this.arrayCopy.length; i++) {
      if (this.arrayCopy[i] > max) {
        max = this.arrayCopy[i];
      }
    }
    let bucket = new Array(max + 1);
    bucket.fill(0);
    for (let i = 0; i < this.arrayCopy.length; i++) {
      bucket[this.arrayCopy[i]]++;
    }
    let index = 0;
    for (let i = 0; i < bucket.length; i++) {
      while (bucket[i] > 0) {
        this.arrayCopy[index++] = i;
        bucket[i]--;
      }
    }
  }
}
