import {SortAlgorithm} from "./sort-algorithm";

// TODO 这个算法有问题
export class RadixSort extends SortAlgorithm {
  sort(): void {
    // 基数排序
    let max = this.arrayCopy[0];
    for (let i = 1; i < this.arrayCopy.length; i++) {
      if (this.arrayCopy[i] > max) {
        max = this.arrayCopy[i];
      }
    }
    let maxLength = (max + "").length;
    let mod = 10;
    let dev = 1;
    let counter = [];
    for (let i = 0; i < maxLength; i++, dev *= 10, mod *= 10) {
      for (let j = 0; j < this.arrayCopy.length; j++) {
        let bucket = parseInt((this.arrayCopy[j] % mod) / dev + "");
        if (counter[bucket] == null) {
          counter[bucket] = [];
        }
        // @ts-ignore
        counter[bucket].push(this.arrayCopy[j]);
      }
      let pos = 0;
      for (let j = 0; j < counter.length; j++) {
        let value = null;
        if (counter[j] != null) {
          while ((value = counter[j].shift()) != null) {
            this.arrayCopy[pos++] = value;
          }
        }
      }
    }
  }
}
