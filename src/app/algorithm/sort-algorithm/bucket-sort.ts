import {SortAlgorithm} from "./sort-algorithm";

export class BucketSort extends SortAlgorithm {
  sort(): void {
    // 桶排序
    let max = this.arrayCopy[0];
    let min = this.arrayCopy[0];
    for (let i = 1; i < this.arrayCopy.length; i++) {
      if (this.arrayCopy[i] > max) {
        max = this.arrayCopy[i];
      }
      if (this.arrayCopy[i] < min) {
        min = this.arrayCopy[i];
      }
    }
    let bucketSize = 5;
    let bucketCount = Math.floor((max - min) / bucketSize) + 1;
    let bucket = new Array(bucketCount);
    for (let i = 0; i < bucketCount; i++) {
      bucket[i] = [];
    }
    for (let i = 0; i < this.arrayCopy.length; i++) {
      let index = Math.floor((this.arrayCopy[i] - min) / bucketSize);
      bucket[index].push(this.arrayCopy[i]);
    }
    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
      if (bucket[i].length > 0) {
        bucket[i].sort((a: number, b: number) => a - b);
        for (let j = 0; j < bucket[i].length; j++) {
          this.arrayCopy[index++] = bucket[i][j];
        }
      }
    }
  }
}
