import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.css']
})
export class SortingComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    this.initArray();
  }
  // 排序的时候，设置的数字最大值
  readonly maxNumber = 50;

  algorithm = [
    {name: "Bubble Sort", value: "bubbleSort", label: "冒泡排序"},
    {name: "Selection Sort", value: "selectionSort", label: "选择排序"},
    {name: "Insertion Sort", value: "insertionSort", label: "插入排序"},
    {name: "Merge Sort", value: "mergeSort", label: "归并排序"},
    {name: "Quick Sort", value: "quickSort", label: "快速排序"},
    {name: "Heap Sort", value: "heapSort", label: "堆排序"},
    {name: "Radix Sort", value: "radixSort", label: "基数排序"},
    {name: "Counting Sort", value: "countingSort", label: "计数排序"},
    {name: "Bucket Sort", value: "bucketSort", label: "桶排序"},
  ];

  sortArray:number[] = [];

  private initArray() {
    for (let i = 0; i < 10; i++) {
      this.sortArray.push(Math.floor(Math.random() * this.maxNumber));
    }
  }

  printArray() {
    console.log(this.sortArray);
  }
}
