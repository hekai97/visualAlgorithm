import {Component, OnInit} from '@angular/core';
import G6, {Graph, TreeGraph} from "@antv/g6";
import {BinaryTreeData} from "../data-structure/binary-tree-data";
import {BinaryTree} from "../data-structure/binary-tree";
import {MatSnackBar} from "@angular/material/snack-bar";

interface AnimationQueue {
  type: 'node' | 'edge';
  operation?: 'add' | 'delete' | 'search';
  value: string;
  color?: 'red' | 'green' | 'blue';
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  constructor(private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.initGraph();
    this.generateBinarySearchTree();
  }

  binarySearchTree?: BinaryTree;
  binarySearchTreeData?: BinaryTreeData;
  graph?: Graph;
  treeTabs = [
    {name: 'binarySearchTree', value: 'binarySearchTree', tab: '二叉搜索树'},
    {name: 'avlTree', value: 'avlTree', tab: 'AVL树'},
  ]
  binarySearchTreeNodeValue?: number;
  waitDeleteBinarySearchTreeNodeValue?: number;
  waitSearchBinarySearchTreeNodeValue?: number;
  animationQueue: AnimationQueue[][] = [];
  // 用来存放遍历的结果，展示在页面上,由于需要定时更新，所以该值将由outputNumbers来更新
  outputString?: string;
  // 用来存放遍历的结果
  outputNumbers: number[] = [];

  speed: number = 100;

  private initGraph() {
    G6.registerEdge(
      'circle-running',
      {
        afterDraw(cfg, group) {
          // get the first shape in the group, it is the edge's path here=
          const shape = group?.get('children')[0];
          // the start position of the edge's path
          const startPoint = shape.getPoint(0);

          // add red circle shape
          const circle = group?.addShape('circle', {
            attrs: {
              x: startPoint.x,
              y: startPoint.y,
              fill: '#1890ff',
              r: 3,
            },
            name: 'circle-shape',
          });

          // animation for the red circle
          circle?.animate(
            (ratio: any) => {
              // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
              // get the position on the edge according to the ratio
              const tmpPoint = shape.getPoint(ratio);
              // returns the modified configurations here, x and y here
              return {
                x: tmpPoint.x,
                y: tmpPoint.y,
              };
            },
            {
              repeat: true, // Whether executes the animation repeatly
              duration: 1000, // the duration for executing once
            },
          );
        },
      },
      'cubic-vertical', // extend the built-in edge 'cubic'
    );
    this.graph = new TreeGraph({
      container: 'container',
      width: 1500,
      height: 500,
      animate: true,
      // modes: {
      //   // behavior
      //   default: ['drag-node'],
      // },
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
        ]
      },
      layout: {
        type: 'compactBox',
        direction: 'TB', // H / V / LR / RL / TB / BT
        nodeSep: 40,
        rankSep: 100,
      },
      // defaultNode: {
      //   size: 26,
      //   anchorPoints: [
      //     [0, 0.5],
      //     [1, 0.5],
      //   ],
      // },
      defaultEdge: {
        type: 'cubic-vertical',
        // type: 'circle-running',
        style: {
          stroke: '#A3B1BF',
        },
      },
    });
    this.graph?.node((node) => {
      return {
        label: node.id,
        style: {
          fill: 'white',
        },
        labelCfg: {
          // position: node.children && node.children.length > 0 ? 'left' : 'right',
          position: 'center',
          offset: 5,
        },
      };
    });
    // this.graph.edge((edge) => {
    //   return {
    //     label: edge.id,
    //     labelCfg: {
    //       position: 'center',
    //       autoRotate: true,
    //     },
    //   };
    // });
  }

  tabSelectionChanged(index: number) {
    this.graph?.clear();
    if (index == 0) {
      this.initBinaryTreeGraph();
    }
  }

  private initBinaryTreeGraph() {
    this.generateBinarySearchTree();
  }

  // private addToBinarySearchTree(binarySearchTreeData: BinaryTreeData | undefined, binarySearchTreeNodeValue: number) {
  //   if(!binarySearchTreeData){
  //     this.binarySearchTreeData = {id:binarySearchTreeNodeValue.toString(),children:[]};
  //     this.graph!.data(this.binarySearchTreeData);
  //     this.graph!.render();
  //     this.graph!.fitView();
  //   }else{
  //     if(parseInt(binarySearchTreeData.id)>binarySearchTreeNodeValue){
  //       // 当没有节点的时候
  //       if(binarySearchTreeData.children.length==0){
  //         binarySearchTreeData.children[0] = {id:binarySearchTreeNodeValue.toString(),children:[]};
  //         this.graph?.changeData();
  //         this.graph!.fitView();
  //       }
  //       // 当只有一个节点的时候
  //       else if(binarySearchTreeData.children.length==1){
  //         if(parseInt(binarySearchTreeData.children[0].id)>binarySearchTreeNodeValue){
  //           binarySearchTreeData.children[1] = binarySearchTreeData.children[0];
  //           binarySearchTreeData.children[0] = {id:binarySearchTreeNodeValue.toString(),children:[]};
  //         }else{
  //           binarySearchTreeData.children[1] = {id:binarySearchTreeNodeValue.toString(),children:[]};
  //         }
  //         this.graph?.changeData();
  //         this.graph!.fitView();
  //       }
  //       // 当有两个节点的时候
  //       else{
  //         this.addToBinarySearchTree(binarySearchTreeData.children[0],binarySearchTreeNodeValue);
  //       }
  //     }
  //     else{
  //       // 当没有节点的时候
  //       if(binarySearchTreeData.children.length==0){
  //         binarySearchTreeData.children[0]={id:binarySearchTreeNodeValue.toString(),children:[]};
  //         this.graph?.changeData();
  //         this.graph!.fitView();
  //       }
  //       // 当只有一个节点的时候
  //       else if(binarySearchTreeData.children.length==1){
  //         if(parseInt(binarySearchTreeData.children[0].id)>binarySearchTreeNodeValue){
  //           binarySearchTreeData.children[0] = {id:binarySearchTreeNodeValue.toString(),children:[]};
  //         }else{
  //           binarySearchTreeData.children[0] = binarySearchTreeData.children[1];
  //           binarySearchTreeData.children[1] = {id:binarySearchTreeNodeValue.toString(),children:[]};
  //         }
  //         this.graph?.changeData();
  //         this.graph!.fitView();
  //       }
  //       // 当有两个节点的时候
  //       else{
  //         this.addToBinarySearchTree(binarySearchTreeData.children[1],binarySearchTreeNodeValue);
  //       }
  //     }
  //   }
  // }

  addBinarySearchTreeNode() {
    if (this.binarySearchTreeNodeValue) {
      if (!this.checkValidValue()) {
        this._snackBar.open('节点值已存在', '关闭', {
          duration: 2000,
        });
        return;
      }
      this.clearNodeColorAndEdgeStatus();
      this.insertBinarySearchTree(this.binarySearchTreeNodeValue);
      this.binarySearchTreeNodeValue = undefined;
      this.graph?.data(this.binarySearchTreeData);
      this.graph?.changeData();
      this.graph?.fitView();
    }
    console.log(this.binarySearchTreeData);
  }

  private insertBinarySearchTree(binarySearchTreeNodeValue: number) {
    if (!this.binarySearchTree) {
      this.binarySearchTree = new BinaryTree(binarySearchTreeNodeValue);
    } else {
      this.binarySearchTree.insert(binarySearchTreeNodeValue);
    }
    this.binarySearchTreeData = this.toBinarySearchTreeData();
  }

  private toBinarySearchTreeData() {
    if (this.binarySearchTree) {
      return this.toBinarySearchTreeDataHelper(this.binarySearchTree);
    }
    return undefined;
  }

  private toBinarySearchTreeDataHelper(binarySearchTree: BinaryTree) {
    const data: BinaryTreeData = {id: binarySearchTree.value.toString(), children: []};
    if (binarySearchTree.left) {
      data.children.push(this.toBinarySearchTreeDataHelper(binarySearchTree.left));
    }
    if (binarySearchTree.right) {
      data.children.push(this.toBinarySearchTreeDataHelper(binarySearchTree.right));
    }
    return data;
  }

  private checkValidValue() {
    if (this.binarySearchTree) {
      return !this.binarySearchTree.find(this.binarySearchTreeNodeValue!);
    }
    return true;
  }

  deleteBinarySearchTreeNode() {
    if (this.binarySearchTree) {
      if (this.waitDeleteBinarySearchTreeNodeValue) {
        if (this.binarySearchTree.find(this.waitDeleteBinarySearchTreeNodeValue)) {
          /**
           * 这里需要进行判断，如果删除的是根节点，那么需要将根节点置空
           * */
          if (this.binarySearchTree.value == this.waitDeleteBinarySearchTreeNodeValue && this.binarySearchTree.left == undefined && this.binarySearchTree.right == undefined) {
            this.binarySearchTree = undefined;
            this.binarySearchTreeData = undefined;
            this.graph?.clear();
          } else {
            this.binarySearchTree.delete(this.waitDeleteBinarySearchTreeNodeValue);
            this.binarySearchTreeData = this.toBinarySearchTreeData();
            console.log(this.binarySearchTreeData);
            this.graph?.data(this.binarySearchTreeData);
            this.graph?.render();
            this.graph?.fitView();
          }
        } else {
          this._snackBar.open('节点值不存在', '关闭', {
            duration: 2000,
          });
        }
      } else {
        this._snackBar.open('请输入节点值', '关闭', {
          duration: 2000,
        });
      }
    } else {
      this._snackBar.open('二叉查找树为空', '关闭', {
        duration: 2000,
      });
    }
    this.waitDeleteBinarySearchTreeNodeValue = undefined;
  }

  searchBinarySearchTreeNode() {
    // this.graph?.findById('10:6').setState('highlight',true);
    // this.graph?.findById('10:6').update({defaultEdge:{stroke:'red',type:'circle-running'}});
    // this.graph?.update(this.graph?.findById('10:6'),{defaultEdge:{stroke:'red',type:'circle-running'}});

    /************************************************/
    // 设置边的样式为circle-running
    // this.graph?.findById('10:6').update({type:'circle-running'});
    // console.log(this.graph?.findById('10:6'));

    this.clearNodeColorAndEdgeStatus();

    // 对BinarySearchTreeData进行搜索，并且将节点的颜色变为红色
    if (this.binarySearchTreeData) {
      if (this.waitSearchBinarySearchTreeNodeValue) {
        if (this.binarySearchTree!.find(this.waitSearchBinarySearchTreeNodeValue)) {
          this.searchBinarySearchTreeNodeHelper(this.binarySearchTreeData, this.waitSearchBinarySearchTreeNodeValue);
          console.log(this.animationQueue);
          this.playSearchBinarySearchTreeNodeAnimation();
        } else {
          this._snackBar.open('节点值不存在', '关闭', {
            duration: 2000,
          });
        }
      } else {
        this._snackBar.open('请输入节点值', '关闭', {
          duration: 2000,
        });
      }
    }
  }

  private clearNodeColorAndEdgeStatus() {
    this.graph?.getNodes().forEach((node) => {
      node.update({style: {fill: 'white'}});
      node.setState('selected', false);
    });
    this.graph?.getEdges().forEach((edge) => {
      edge.update({type: 'cubic-vertical'});
    });
    this.outputString = undefined;
  }

  private clearAnimationQueueHasSameNodeEdge() {
    const animationQueue: AnimationQueue[][] = [];
    this.animationQueue.forEach((animationQueueItem) => {
      if(animationQueueItem.length==2) {
        if(animationQueueItem[1].value.split(':')[0]!=animationQueueItem[1].value.split(':')[1]) {
          animationQueue.push(animationQueueItem);
        }
      }else {
        animationQueue.push(animationQueueItem);
      }
    });
    this.animationQueue = animationQueue;
  }

  private searchBinarySearchTreeNodeHelper(binarySearchTreeData: BinaryTreeData, waitSearchBinarySearchTreeNodeValue: number) {
    // 变色
    // binarySearchTreeData.style={fill:'red'};
    // if(parseInt(binarySearchTreeData.id)==waitSearchBinarySearchTreeNodeValue){
    //   binarySearchTreeData.style = {fill:'green'};
    // }else{
    //   if(binarySearchTreeData.children.length==1){
    //     this.searchBinarySearchTreeNodeHelper(binarySearchTreeData.children[0],waitSearchBinarySearchTreeNodeValue);
    //   }else if(binarySearchTreeData.children.length==2){
    //     if(parseInt(binarySearchTreeData.children[0].id)>waitSearchBinarySearchTreeNodeValue){
    //       this.searchBinarySearchTreeNodeHelper(binarySearchTreeData.children[0],waitSearchBinarySearchTreeNodeValue);
    //     }else{
    //       this.searchBinarySearchTreeNodeHelper(binarySearchTreeData.children[1],waitSearchBinarySearchTreeNodeValue);
    //     }
    //   }
    // }
    if (parseInt(binarySearchTreeData.id) == waitSearchBinarySearchTreeNodeValue) {
      this.addToAnimationQueue(binarySearchTreeData.id, "green");
      // this.animationQueue.push([{type:'node',value:binarySearchTreeData.id,operation:"search",color:'green'}]);
      return;
    }
    if (binarySearchTreeData.children.length == 0) {
      return;
    }
    if (binarySearchTreeData.children.length == 1) {
      this.addToAnimationQueue(binarySearchTreeData.id);
      this.searchBinarySearchTreeNodeHelper(binarySearchTreeData.children[0], waitSearchBinarySearchTreeNodeValue);
    }
    if (binarySearchTreeData.children.length == 2) {
      this.addToAnimationQueue(binarySearchTreeData.id);
      // this.animationQueue.push({type:'search',value:binarySearchTreeData.id});
      if (parseInt(binarySearchTreeData.id) > waitSearchBinarySearchTreeNodeValue) {
        this.searchBinarySearchTreeNodeHelper(binarySearchTreeData.children[0], waitSearchBinarySearchTreeNodeValue);
      } else {
        this.searchBinarySearchTreeNodeHelper(binarySearchTreeData.children[1], waitSearchBinarySearchTreeNodeValue);
      }
    }
  }

  private addToAnimationQueue(value: string, color: 'red' | 'green' | 'blue' = 'red') {
    if (this.animationQueue.length > 0) {
      let temp: string;
      let lastNode = this.animationQueue[this.animationQueue.length - 1];
      if (lastNode[0].type == 'node') {
        temp = lastNode[0].value;
      }
      // 首先，给上个节点添加一个边，代表是从上个点到这个点的边，然后，把当前这个点放进去
      this.animationQueue[this.animationQueue.length - 1].push({
        type: 'edge',
        value: temp! + ':' + value,
        operation: "search"
      });
      this.animationQueue.push([{type: 'node', value: value, operation: "search", color: color}]);
    } else {
      this.animationQueue.push([{type: 'node', value: value, operation: "search", color: color}]);
    }
  }

  generateBinarySearchTree() {
    const length = Math.random() * 40;
    // 确保生成的节点值不重复
    const set = new Set<number>();
    this.binarySearchTree = new BinaryTree(Math.floor(Math.random() * 100));
    set.add(this.binarySearchTree.value);
    for (let i = 0; i < length; i++) {
      let value = Math.floor(Math.random() * 100);
      while (set.has(value)) {
        value = Math.floor(Math.random() * 100);
      }
      this.binarySearchTree.insert(value);
      set.add(value);
    }
    this.binarySearchTreeData = this.toBinarySearchTreeData();
    this.graph?.data(this.binarySearchTreeData);
    this.graph?.render();
    this.graph?.fitView();
  }

  deleteBinarySearchTree() {
    this.binarySearchTree = undefined;
    this.binarySearchTreeData = undefined;
    this.graph?.clear();
  }

  timer?: number;

  private getCalculateSpeed() {
    return 1000 / this.speed;
  }

  private playSearchBinarySearchTreeNodeAnimation() {
    // this.timer = setInterval(()=>{
    //   if(this.animationQueue.length>1){
    //     const animation = this.animationQueue.shift();
    //     if(animation?.type=='search'){
    //       this.graph?.update(animation.value,{style:{fill:'red'}});
    //     }
    //   }else if(this.animationQueue.length==1){
    //     const animation = this.animationQueue.shift();
    //     if(animation?.type=='search'){
    //       this.graph?.update(animation.value,{style:{fill:'green'}});
    //     }
    //   }
    //   else{
    //     clearInterval(this.timer);
    //   }
    // },1000);
    if (this.animationQueue.length > 0) {
      const animation = this.animationQueue.shift();
      if (animation) {
        animation.forEach((item) => {
          if (item.type == 'node') {
            this.graph?.update(item.value, {style: {fill: item.color}});
          } else if (item.type == 'edge') {
            this.graph?.findById(item.value)?.update({type: 'circle-running'});
          }
        })
      }
      this.timer = setTimeout(() => {
        this.playSearchBinarySearchTreeNodeAnimation();
      }, this.getCalculateSpeed());
    } else {
      clearInterval(this.timer);
    }
  }

  traverseTimer?: number;

  private playTraverseSearchTreeNodeAnimation() {
    if (this.animationQueue.length > 0) {
      const animation = this.animationQueue.shift();
      if (animation) {
        animation.forEach((item) => {
          if (item.type == 'node') {
            // this.graph?.findById(item.value)?.setState('selected', !this.graph?.findById(item.value)?.getStates().find((state) => state == 'selected'));
            this.graph?.findById(item.value)?.setState('selected', false);
            if (parseInt(item.value) == this.outputNumbers[0]) {
              // this.graph?.update(item.value, {style: {fill: item.color}});
              this.graph?.findById(item.value)?.setState('selected', true);
              const number = this.outputNumbers.shift();
              if (number) {
                if (this.outputString) {
                  this.outputString = this.outputString + ',' + number.toString();
                } else {
                  this.outputString = number.toString();
                }
              }
            }
          } else if (item.type == 'edge') {
            this.graph?.findById(item.value)?.update({type: 'circle-running'});
          }
        })
      }
      this.traverseTimer = setTimeout(() => {
        this.playTraverseSearchTreeNodeAnimation();
      }, this.getCalculateSpeed());
    } else {
      clearInterval(this.traverseTimer);
      this.traverseTimer = undefined;
    }
  }

  // 先序遍历
  preOrderTraversal() {
    if (this.binarySearchTreeData) {
      this.clearNodeColorAndEdgeStatus();
      this.animationQueue = [];
      this.outputString = undefined;
      this.outputNumbers = [];
      this.preOrderTraversalHelper(this.binarySearchTreeData);
      this.playTraverseSearchTreeNodeAnimation();
      this.outputString = '先序遍历结果：';
      // this.outputNumberToStringAndOutput();
    }
  }

  private preOrderTraversalHelper(binarySearchTreeData: BinaryTreeData) {
    this.addToAnimationQueue(binarySearchTreeData.id);
    this.outputNumbers.push(parseInt(binarySearchTreeData.id));
    if (binarySearchTreeData.children.length == 1) {
      this.preOrderTraversalHelper(binarySearchTreeData.children[0]);
    } else if (binarySearchTreeData.children.length == 2) {
      this.preOrderTraversalHelper(binarySearchTreeData.children[0]);
      this.addToAnimationQueue(binarySearchTreeData.id, "green");
      this.preOrderTraversalHelper(binarySearchTreeData.children[1]);
      this.addToAnimationQueue(binarySearchTreeData.id, "green");
    }
    this.addToAnimationQueue(binarySearchTreeData.id, "green");
  }

  // 中序遍历
  inOrderTraversal() {
    if (this.binarySearchTreeData) {
      this.clearNodeColorAndEdgeStatus();
      this.animationQueue = [];
      this.outputString = undefined;
      this.outputNumbers = [];
      this.inOrderTraversalHelper(this.binarySearchTreeData);
      // this.clearAnimationQueueHasSameNodeEdge();
      this.playTraverseSearchTreeNodeAnimation();
      this.outputString = '中序遍历结果：';
      // this.outputNumberToStringAndOutput();
    }
  }

  // timer2?: number;
  // private outputNumberToStringAndOutput() {
  //   if(this.outputNumbers){
  //     const number = this.outputNumbers.shift();
  //     if(number){
  //       if(this.outputString){
  //         this.outputString = this.outputString + ',' + number.toString();
  //       }else{
  //         this.outputString = number.toString();
  //       }
  //     }
  //   }else{
  //     clearInterval(this.timer2);
  //   }
  //   this.timer2 = setTimeout(()=>{
  //     this.outputNumberToStringAndOutput();
  //   },this.getCalculateSpeed());
  // }
  private inOrderTraversalHelper(binarySearchTreeData: BinaryTreeData) {
    this.addToAnimationQueue(binarySearchTreeData.id);
    if (binarySearchTreeData.children.length == 1) {
      // 判断是左节点还是右节点
      if (binarySearchTreeData.children[0].id < binarySearchTreeData.id) {
        this.inOrderTraversalHelper(binarySearchTreeData.children[0]);
        this.addToAnimationQueue(binarySearchTreeData.id);
        this.outputNumbers.push(parseInt(binarySearchTreeData.id));
      }else{
        this.addToAnimationQueue(binarySearchTreeData.id);
        this.outputNumbers.push(parseInt(binarySearchTreeData.id));
        this.inOrderTraversalHelper(binarySearchTreeData.children[0]);
      }
    } else if (binarySearchTreeData.children.length == 2) {
      this.inOrderTraversalHelper(binarySearchTreeData.children[0]);
      this.addToAnimationQueue(binarySearchTreeData.id);
      this.outputNumbers.push(parseInt(binarySearchTreeData.id));
      this.inOrderTraversalHelper(binarySearchTreeData.children[1]);
    }
    if (binarySearchTreeData.children.length == 0) {
      this.addToAnimationQueue(binarySearchTreeData.id);
      this.outputNumbers.push(parseInt(binarySearchTreeData.id));
    }
    this.addToAnimationQueue(binarySearchTreeData.id, "green");
  }
}
