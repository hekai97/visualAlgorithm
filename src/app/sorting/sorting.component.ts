import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    console.log(form);
    return true;
  }
}
@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.css'],
})

export class SortingComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    this.initArray();
  }
  matcher = new MyErrorStateMatcher();
  /** 正则表达式，输入格式为数字,逗号，数字，逗号*/
  readonly reg = /^(\d+)(,\d+)*$/;

  // 排序的时候，设置的数字最大值
  readonly maxNumber = 50;
  readonly minSpeed = 1;
  readonly maxSpeed = 100;
  speed = 10;
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
  /**
   * 该数据是用来判断用户的输入是否超过了最大值，如果超过最大值的话，该值为true，并且在前端界面会显示错误信息。
   */
  overMaxNumber:boolean = false;
  private initArray() {
    for (let i = 0; i < 10; i++) {
      this.sortArray.push(Math.floor(Math.random() * this.maxNumber));
    }
  }

  printArray() {
    console.log(this.sortArray);
  }

  /**
   * 输入框输入的值，改变数组
   * @param numberStr
   */
  changeArray(numberStr: string) {
    console.log(this.overMaxNumber);
    if (this.reg.test(numberStr)) {
      // 判断拆分的数据是否超过最大值
      if (numberStr.split(",").some((item) => parseInt(item) > this.maxNumber)) {
        this.overMaxNumber = true;
        return;
      }
      this.overMaxNumber = false;
      this.sortArray = numberStr.split(",").map((item) => parseInt(item));
    }
    console.log(this.sortArray);
  }

  /**
   * 生成随机的数据
   */
  randomArray() {
    // 随机一个长度，在10-20整数范围内
    const length = Math.floor(Math.random() * 10) + 10;
    // 根据这个长度生成一个数组，数组的值是0-50的随机数
    this.sortArray = Array.from({length: length}, () => Math.floor(Math.random() * this.maxNumber));
  }
}
