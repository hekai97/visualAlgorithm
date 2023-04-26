export class BinaryTree {
  constructor(
    public value: number,
    public left?: BinaryTree,
    public right?: BinaryTree,
  ) {
  }

  // 二叉搜索树的插入
  insert(value: number): BinaryTree {
    if (value < this.value) {
      if (this.left) {
        this.left.insert(value);
      } else {
        this.left = new BinaryTree(value);
      }
    } else {
      if (this.right) {
        this.right.insert(value);
      } else {
        this.right = new BinaryTree(value);
      }
    }
    return this;
  }

  // 二叉搜索树的查找
  find(value: number): BinaryTree | null {
    if (value < this.value) {
      if (this.left) {
        return this.left.find(value);
      } else {
        return null;
      }
    } else if (value > this.value) {
      if (this.right) {
        return this.right.find(value);
      } else {
        return null;
      }
    } else {
      return this;
    }
  }

  // 二叉搜索树的删除
  delete(value: number): BinaryTree | null {
    if (value < this.value) {
      if (this.left) {
        // @ts-ignore
        this.left = this.left.delete(value);
      }
    } else if (value > this.value) {
      if (this.right) {
        // @ts-ignore
        this.right = this.right.delete(value);
      }
    } else {
      if (this.left && this.right) {
        this.value = this.right.getMinValue();
        // @ts-ignore
        this.right = this.right.delete(this.value);

        // 将右节点提上来，然后将左节点插入到右节点的最左边,再删除该节点

      } else if (this.left) {
        return this.left;
      } else if (this.right) {
        return this.right;
      } else {
        return null;
      }
    }
    return this;
  }

  getMinValue(): number {
    if (this.left) {
      return this.left.getMinValue();
    } else {
      return this.value;
    }
  }

  // 二叉搜索树的遍历
  traverseInOrder(): number[] {
    const traverse: number[] = [];
    if (this.left) {
      traverse.push(...this.left.traverseInOrder());
    }
    traverse.push(this.value);
    if (this.right) {
      traverse.push(...this.right.traverseInOrder());
    }
    return traverse;
  }

  traversePreOrder(): number[] {
    const traverse: number[] = [];
    traverse.push(this.value);
    if (this.left) {
      traverse.push(...this.left.traversePreOrder());
    }
    if (this.right) {
      traverse.push(...this.right.traversePreOrder());
    }
    return traverse;
  }

  traversePostOrder(): number[] {
    const traverse: number[] = [];
    if (this.left) {
      traverse.push(...this.left.traversePostOrder());
    }
    if (this.right) {
      traverse.push(...this.right.traversePostOrder());
    }
    traverse.push(this.value);
    return traverse;
  }

  // 二叉搜索树的层序遍历
  traverseLevelOrder(): number[] {
    const traverse: number[] = [];
    const queue: BinaryTree[] = [];
    queue.push(this);
    while (queue.length) {
      const current = queue.shift() as BinaryTree;
      traverse.push(current.value);
      if (current.left) {
        queue.push(current.left);
      }
      if (current.right) {
        queue.push(current.right);
      }
    }
    return traverse;
  }

  // 二叉搜索树的最大深度
  getDepth(): number {
    if (!this.left && !this.right) {
      return 1;
    }
    if (this.left && this.right) {
      return 1 + Math.max(this.left.getDepth(), this.right.getDepth());
    }
    if (this.left) {
      return 1 + this.left.getDepth();
    }
    // @ts-ignore
    return 1 + this.right.getDepth();
  }

  // 二叉搜索树的最小深度
  getMinDepth(): number {
    if (!this.left && !this.right) {
      return 1;
    }
    if (this.left && this.right) {
      return 1 + Math.min(this.left.getMinDepth(), this.right.getMinDepth());
    }
    if (this.left) {
      return 1 + this.left.getMinDepth();
    }
    // @ts-ignore
    return 1 + this.right.getMinDepth();
  }

  // 二叉搜索树的最大宽度
  getWidth(): number {
    const queue: BinaryTree[] = [];
    queue.push(this);
    let maxWidth = 0;
    while (queue.length) {
      const length = queue.length;
      maxWidth = Math.max(maxWidth, length);
      for (let i = 0; i < length; i++) {
        const current = queue.shift() as BinaryTree;
        if (current.left) {
          queue.push(current.left);
        }
        if (current.right) {
          queue.push(current.right);
        }
      }
    }
    return maxWidth;
  }

  // 二叉搜索树的最小宽度
  getMinWidth(): number {
    const queue: BinaryTree[] = [];
    queue.push(this);
    let minWidth = Infinity;
    while (queue.length) {
      const length = queue.length;
      minWidth = Math.min(minWidth, length);
      for (let i = 0; i < length; i++) {
        const current = queue.shift() as BinaryTree;
        if (current.left) {
          queue.push(current.left);
        }
        if (current.right) {
          queue.push(current.right);
        }
      }
    }
    return minWidth;
  }

  // 二叉搜索树的节点个数
  getSize(): number {
    let size = 1;
    if (this.left) {
      size += this.left.getSize();
    }
    if (this.right) {
      size += this.right.getSize();
    }
    return size;
  }

  // 二叉搜索树的叶子节点个数
  getLeafSize(): number {
    if (!this.left && !this.right) {
      return 1;
    }
    let leafSize = 0;
    if (this.left) {
      leafSize += this.left.getLeafSize();
    }
    if (this.right) {
      leafSize += this.right.getLeafSize();
    }
    return leafSize;
  }

  // 二叉搜索树的第k层节点个数
  getKLevelSize(k: number): number {
    if (k === 1) {
      return 1;
    }
    let size = 0;
    if (this.left) {
      size += this.left.getKLevelSize(k - 1);
    }
    if (this.right) {
      size += this.right.getKLevelSize(k - 1);
    }
    return size;
  }

  // 二叉搜索树的节点值之和
  getSum(): number {
    let sum = this.value;
    if (this.left) {
      sum += this.left.getSum();
    }
    if (this.right) {
      sum += this.right.getSum();
    }
    return sum;
  }

}
