import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AnimationBuilder, state, style, trigger} from "@angular/animations";
import {SortAlgorithm} from "../algorithm/sort-algorithm/sort-algorithm";
import {BubbleSort} from "../algorithm/sort-algorithm/bubble-sort";
import {QuickSort} from "../algorithm/sort-algorithm/quick-sort";
import {SelectionSort} from "../algorithm/sort-algorithm/selection-sort";
import {InsertionSort} from "../algorithm/sort-algorithm/insertion-sort";
import {MergeSort} from "../algorithm/sort-algorithm/merge-sort";
import {HeapSort} from "../algorithm/sort-algorithm/heap-sort";
import {RadixSort} from "../algorithm/sort-algorithm/radix-sort";
import {CountingSort} from "../algorithm/sort-algorithm/counting-sort";
import {BucketSort} from "../algorithm/sort-algorithm/bucket-sort";


@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.css'],
  animations: [
    trigger('swap', [
      // state('left',style({
      // //   左边的上移，右边的下移，然后左边的移动到右边位置，下移，右边的移动到左边位置，上移
      //   transform:'translateX(-100%)'
      //
      // })),
      // state('right',style({
      //   transform:'translateX(100%) translateY(-100%)'
      // })),
      // state('up',style({
      //   transform:'translateY(-100%)'
      // })),
      // state('down',style({
      //   transform:'translateY(100%)'
      // })),
      // transition('*=>*',[
      //   animate('0.5s')
      // ]),
      // state('start', style({
      //   transform: 'translateY(0) translateX(0)'
      // })),
      // transition('start => up', [
      //   animate('{{speed1}}s ease-in-out', keyframes([
      //     style({ transform: 'translateY(0) translateX(0)', offset: 0 }),
      //     style({ transform: 'translateY(-50px) translateX(0)', offset: 0.3 }),
      //     style({ transform: 'translateY(-50px) translateX(50px)', offset: 0.6 }),
      //     style({ transform: 'translateY(0) translateX(50px)', offset: 1.0 })
      //   ])),
      // ],{
      //   params:{
      //     speed:1,
      //     length:50,
      //     direction:0 //0代表从左到右，1代表从右到左
      //   }
      // }),
      // transition('up => right', [
      //   animate('1s ease-in-out', keyframes([
      //     style({ transform: 'translateY(-50px) translateX(50px)', offset: 0 }),
      //     style({ transform: 'translateY(-50px) translateX(0)', offset: 0.3 }),
      //     style({ transform: 'translateY(0) translateX(0)', offset: 1.0 })
      //   ]))
      // ]),
      // transition('right => down', [
      //   animate('1s ease-in-out', keyframes([
      //     style({ transform: 'translateY(0) translateX(0)', offset: 0 }),
      //     style({ transform: 'translateY(50px) translateX(0)', offset: 0.3 }),
      //     style({ transform: 'translateY(50px) translateX(50px)', offset: 0.6 }),
      //     style({ transform: 'translateY(0) translateX(50px)', offset: 1.0 })
      //   ]))
      // ])
    ])
  ]
})
/**
 * 排序组件
 * 需求：1.输入一串数字，用逗号分隔，最大值为50，最小值为1
 *     2.输入速度，最大值为100，最小值为1，该速度可以控制动画的快慢，也可以控制排序的速度，但是不能控制排序的时间，目前的思路是
 *     将这个值传递到排序算法中，然后在排序算法中，使用定时器，并且可以随时停止定时器，这样就可以控制排序的速度
 *     3.动画，使用Angular的动画，目前的想法是获取两个待交换的元素的位置，然后将其中一个元素移动到另一个元素的位置，
 *     然后将另一个元素移动到第一个元素的位置，难点在于，如何获取两个元素的位置，以及如何移动元素。因此，获取位置的时候，
 *     可以使用getBoundingClientRect()方法，该方法返回一个DOMRect对象，该对象包含了元素的位置信息，包括left，top，right，bottom等
 */
export class SortingComponent implements OnInit {
  constructor(private animationBuilder: AnimationBuilder) {
  }

  ngOnInit(): void {
    this.initArray();
  }

  /** 正则表达式，输入格式为数字,逗号，数字，逗号*/
  readonly reg = /^((\d+)(,)?)*$/;
  // 排序的时候，设置的数字最大值
  readonly maxNumber = 50;
  readonly minSpeed = 1;
  readonly maxSpeed = 100;
  speed = 50;
  algorithm = [
    {name: "Bubble Sort", value: "bubbleSort", label: "冒泡排序"},
    {name: "Selection Sort", value: "selectionSort", label: "选择排序"},
    {name: "Insertion Sort", value: "insertionSort", label: "插入排序"},
    {name: "Quick Sort", value: "quickSort", label: "快速排序"},
    {name: "Heap Sort", value: "heapSort", label: "堆排序"},
    // {name: "Merge Sort", value: "mergeSort", label: "归并排序"},
    // {name: "Radix Sort", value: "radixSort", label: "基数排序"},
    // {name: "Counting Sort", value: "countingSort", label: "计数排序"},
    // {name: "Bucket Sort", value: "bucketSort", label: "桶排序"},
  ];
  sortAlgorithm: SortAlgorithm | null = null;
  sortArray: number[] = [];
  sortArrayString: string = '';
  inputControl = new FormControl('',[
     Validators.required,
    this.validInputFormatFunction,
    this.validInputNumberFunction
  ]);

  costMinute = 0;
  costSecond = 0;
  costMillisecond = 0;
  timerInterval: any = null;

  /**
   * 该验证规则为验证输入的格式，是不是符合要求，如果符合要求的话，返回null，否则返回一个对象，该对象的key为formatError，value为true
   * @param control
   */
  validInputFormatFunction(control: FormControl): { [key: string]: any } | null {
    if(/^((\d+)(,)?)*$/.test(control.value)){
      return null;
    }else{
      return {formatError:true};
    }
  }

  /**
   * 该验证规则为验证输入的数字是否超过了最大值，如果超过最大值的话，返回一个对象，该对象的key为overMaxNumber，value为true
   * @param control
   */
  validInputNumberFunction(control: FormControl): { [key: string]: any } | null {
    let max = 50;
    let min = 0;
    let array = control.value.split(',');
    for(let i = 0;i < array.length;i++){
      if(array[i] > max || array[i] < min){
        return {overMaxNumber:true};
      }
    }
    return null;
  }
  /**
   * 该数据是用来判断用户的输入是否超过了最大值，如果超过最大值的话，该值为true，并且在前端界面会显示错误信息。
   */

  private initArray() {
    for (let i = 0; i < 10; i++) {
      this.sortArray.push(Math.floor(Math.random() * this.maxNumber));
    }
    this.sortArrayString = this.sortArray.toString();
  }

  printArray() {
    console.log(this.sortArray);
  }

  /**
   * 输入框输入的值，改变数组
   */
  changeArray() {
    // 将输入的obj转成字符串
    console.log(this.sortArrayString);
    // console.log(this.sortArrayString);
    if(this.inputControl.hasError('formatError')){
      return;
    }
    if(this.inputControl.hasError('overMaxNumber')){
      return;
    }
    let array = this.sortArrayString.split(',');
    let copyArray = [];
    for (let i = 0; i < array.length; i++) {
      if(array[i] != ""){
        copyArray.push(parseInt(array[i]));
      }
    }
    this.sortArray = copyArray;

    // console.log(numberStr);
    // if (this.reg.test(numberStr)) {
    //   // 判断拆分的数据是否超过最大值
    //   if (numberStr.split(",").some((item) => parseInt(item) > this.maxNumber)) {
    //     console.log("超过最大值");
    //     this.inputControl.setErrors({overMaxNumber: true});
    //     return;
    //   }
    //   // this.overMaxNumber = false;
    //   // this.sortArray = numberStr.split(",").map((item) => parseInt(item));
    //   let array = numberStr.split(",");
    //   let copyArray = [];
    //   for (let i = 0; i < array.length; i++) {
    //     if(array[i] != ""){
    //       copyArray.push(parseInt(array[i]));
    //     }
    //   }
    //   this.sortArray = copyArray;
    //   // this.printArray();
    // }else{
    //   this.inputControl.setErrors({formError: true});
    //   console.log("输入格式错误");
    // }
    // console.log(this.sortArray);
  }

  /**
   * 生成随机的数据
   */
  randomArray() {
    // 随机一个长度，在10-20整数范围内
    const length = Math.floor(Math.random() * 10) + 10;
    // 根据这个长度生成一个数组，数组的值是0-50的随机数
    this.sortArray = Array.from({length: length}, () => Math.floor(Math.random() * this.maxNumber));
    this.sortArrayString = this.sortArray.toString();
  }

  // playAnimation(index1: number, index2: number) {
  //   // 这块创建了动画，不过需要抽离出来，因为每个排序算法都需要创建动画
  //   console.log("playAnimation");
  //   // 找到class=sort-item,id=index的div元素
  //   let div1 = document.querySelector(`.sort-item[id="${index1}"]`);
  //   let div2 = document.querySelector(`.sort-item[id="${index2}"]`);
  //   console.log(div1);
  //   console.log(div2);
  //   let width = div1!.getBoundingClientRect().width;
  //   let height = div1!.getBoundingClientRect().height;
  //   console.log(div1!.getBoundingClientRect());
  //   console.log(div2!.getBoundingClientRect());
  //   let left = div1!.getBoundingClientRect().x>div2!.getBoundingClientRect().x?div2:div1;
  //   let right = div1!.getBoundingClientRect().x>div2!.getBoundingClientRect().x?div1:div2;
  //   const factory = this.animationBuilder.build([
  //     animate(`${this.speed*100}ms ease-in-out`, keyframes([
  //         // 左边的div先向上移动，然后向右移动，最后向下移动
  //         style({transform: `translateY(-${height}px) translateX(0)`, offset: 0}),
  //         style({transform: `translateY(-${height}px) translateX(${right!.getBoundingClientRect().x-left!.getBoundingClientRect().x}px)`, offset: 0.4}),
  //         style({transform: `translateY(0) translateX(${right!.getBoundingClientRect().x-left!.getBoundingClientRect().x}px)`, offset: 1}),
  //       ])
  //     )]);
  //   const factory2 = this.animationBuilder.build([
  //     animate(`${this.speed*100}ms ease-in-out`, keyframes([
  //         // 右边的div先向下移动，然后向左移动，最后向上移动
  //         style({transform: `translateY(${height}px) translateX(0)`, offset: 0}),
  //         style({transform: `translateY(${height}px) translateX(${left!.getBoundingClientRect().x-right!.getBoundingClientRect().x}px)`, offset: 0.4}),
  //         style({transform: `translateY(0) translateX(${left!.getBoundingClientRect().x-right!.getBoundingClientRect().x}px)`, offset: 1}),
  //         ])
  //     )]);
  //   const player = factory.create(left!);
  //   const player2 = factory2.create(right!);
  //   player.play();
  //   player2.play();
  //   // 更改div的id
  //   left!.setAttribute("id", index2.toString());
  //   right!.setAttribute("id", index1.toString());
  // }
  // test() {
  //   this.sortAlgorithm = new BubbleSort(this.sortArray, this.speed,this.animationBuilder);
  //   this.sortAlgorithm.startSort();
  // }
  startSort(index: number) {
    console.log(index);
    switch (index) {
      case 0:
        this.sortAlgorithm = new BubbleSort(this.sortArray, this.speed,this.animationBuilder);
        break;
      case 1:
        this.sortAlgorithm = new SelectionSort(this.sortArray, this.speed,this.animationBuilder);
        break;
      case 2:
        this.sortAlgorithm = new InsertionSort(this.sortArray, this.speed,this.animationBuilder);
        break;
      case 3:
        this.sortAlgorithm = new QuickSort(this.sortArray, this.speed,this.animationBuilder);
        break;
      case 4:
        this.sortAlgorithm = new HeapSort(this.sortArray, this.speed,this.animationBuilder);
        break;
      // case 5:
      //   this.sortAlgorithm = new MergeSort(this.sortArray, this.speed,this.animationBuilder);
      //   break;
      // case 6:
      //   this.sortAlgorithm = new RadixSort(this.sortArray, this.speed,this.animationBuilder);
      //   break;
      // case 7:
      //   this.sortAlgorithm = new CountingSort(this.sortArray, this.speed,this.animationBuilder);
      //   break;
      // case 8:
      //   this.sortAlgorithm = new BucketSort(this.sortArray, this.speed,this.animationBuilder);
      //   break;
    }
    this.sortAlgorithm?.stopSort();
    this.sortAlgorithm!.startSort();
    this.startCostTime();
  }
  changeSpeed() {
    if(this.sortAlgorithm){
      this.sortAlgorithm.speed=this.speed;
    }
  }

  replay() {
    // 首先，停止所有的动画，然后，重新生成数据
    this.stop();
    this.randomArray();
    this.resetTime();
  }

  startCostTime() {
    this.resetTime();
    this.timerInterval = setInterval(() => {
      this.costMillisecond++;
      if (this.costMillisecond >= 100) {
        this.costSecond++;
        this.costMillisecond = 0;
      }
      if (this.costSecond >= 60) {
        this.costMinute++;
        this.costSecond = 0;
      }
      if(this.sortAlgorithm&&this.sortAlgorithm.isEnd||this.sortAlgorithm==null){
        this.stopCostTime();
      }
    }, 10);
  }
  stopCostTime() {
    clearInterval(this.timerInterval);
  }

  resetTime() {
    this.costMinute = 0;
    this.costSecond = 0;
    this.costMillisecond = 0;
  }

  stop() {
    if(this.sortAlgorithm){
      this.sortAlgorithm.stopSort();
      this.sortAlgorithm.removeBackGroundColor();
    }
    this.sortAlgorithm = null;
  }
  TabChanged(index: number) {
    this.stop();
  }
}
