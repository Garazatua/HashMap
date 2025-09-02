class Node {
  constructor(key = null, value = null) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(head = null) {
    this.head = head;
  }

  size() {
    let count = 0;
    let node = this.head;
    while (node) {
      count++;
      node = node.next;
    }
    return count;
  }

  clear() {
    this.head = null;
  }

  tail() {
    let lastNode = this.head;
    if (lastNode) {
      while (lastNode.next) {
        lastNode = lastNode.next;
      }
      return lastNode;
    } else return null;
  }

  getHead() {
    return this.head;
  }

  append(key, value) {
    let lastNode = this.tail();
    let newNode = new Node(key, value);
    if (!lastNode) {
      this.head = newNode;
    } else {
      lastNode.next = newNode;
    }
  }

  prepend(key, value) {
    let newNode = new Node(key, value);
    newNode.next = this.head;
    this.head = newNode;
  }

  at(index) {
    if (index < 0) return null;
    let currentNode = this.head;
    for (let i = 0; i < index; i++) {
      currentNode = currentNode.next;
      if (!currentNode) return null;
    }
    return currentNode;
  }

  insertAt(key, value, index) {
    const size = this.size();
    if (index < 0 || index > size) return null;
    else if (index === 0) {
      this.prepend(key, value);
      return true;
    } else if (index === size) {
      this.append(key, value);
      return true;
    }
    const newNode = new Node(key, value);
    const prevNode = this.at(index - 1);
    newNode.next = prevNode.next;
    prevNode.next = newNode;
    return true;
  }

  removeAt(index) {
    const highestIndex = this.size() - 1;
    if (index < 0 || index > highestIndex) return null;
    if (index === 0) {
      this.head = this.head.next;
      return true;
    }
    if (index === highestIndex) {
      this.pop();
      return true;
    }
    const prevNode = this.at(index - 1);
    const removedNode = prevNode.next;
    prevNode.next = removedNode.next;
    return true;
  }

  pop() {
    let size = this.size();
    if (size === 1) {
      this.head = null;
    } else if (size === 0) {
      return;
    } else {
      let indexPrev = size - 2;
      let prevNode = this.at(indexPrev);
      prevNode.next = null;
    }
  }

  containsValue(value) {
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) {
        return true;
      }
      currentNode = currentNode.next;
    }
    return false;
  }

  find(value) {
    let currentNode = this.head;
    let index = 0;
    while (currentNode) {
      if (currentNode.value === value) {
        return index;
      }
      currentNode = currentNode.next;
      index++;
    }
    return null;
  }

  findNodeByKey(key) {
    let current = this.head;
    while (current) {
      if (current.key === key) return current;
      current = current.next;
    }
    return null;
  }

  toString() {
    let current = this.head;
    let parts = [];
    while (current) {
      parts.push(`(${current.value})`);
      current = current.next;
    }
    parts.push("null");
    return parts.join(" -> ");
  }
}

class HashMap {
  constructor(capacity = 16, loadFactor = 0.8, size = 0) {
    this.capacity = capacity;
    this.loadFactor = loadFactor;
    this.buckets = new Array(capacity);
    this.size = size;
  }

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }

    return hashCode;
  }

  resize() {
    this.capacity = this.capacity * 2;
    const newBuckets = new Array(this.capacity);
    for (let i = 0; i < this.buckets.length; i++) {
      const bucket = this.buckets[i];
      if (!bucket) continue;
      let currentNode = bucket.head;
      while (currentNode) {
        let newIndex = this.hash(currentNode.key);
        if (newIndex < 0 || newIndex >= this.capacity) {
          throw new Error("Trying to access index out of bounds");
        }
        if (!newBuckets[newIndex]) {
          newBuckets[newIndex] = new LinkedList();
          newBuckets[newIndex].append(currentNode.key, currentNode.value);
        } else {
          const list = newBuckets[newIndex];
          const node = list.findNodeByKey(currentNode.key);
          if (node) {
            node.value = currentNode.value;
          } else {
            list.append(currentNode.key, currentNode.value);
          }
        }
        currentNode = currentNode.next;
      }
    }
    this.buckets = newBuckets;
  }

  set(key, value) {
    let index = this.hash(key);
    if (index < 0 || index >= this.capacity) {
      throw new Error("Trying to access index out of bounds");
    }

    if (!this.buckets[index]) {
      this.buckets[index] = new LinkedList();
      this.buckets[index].append(key, value);
      this.size++;
    } else {
      const list = this.buckets[index];
      const node = list.findNodeByKey(key);
      if (node) {
        node.value = value;
      } else {
        list.append(key, value);
        this.size++;
      }
    }
    if (this.size >= this.capacity * this.loadFactor) {
      this.resize();
    }
  }

  get(key) {
    let index = this.hash(key);
    if (index < 0 || index >= this.capacity) {
      throw new Error("Trying to access index out of bounds");
    }
    if (!this.buckets[index]) {
      return null;
    } else {
      const list = this.buckets[index];
      const node = list.findNodeByKey(key);
      if (node) return node.value;
      else return null;
    }
  }

  has(key) {
    let index = this.hash(key);
    if (index < 0 || index >= this.capacity) {
      throw new Error("Trying to access index out of bounds");
    }
    if (!this.buckets[index]) {
      return false;
    } else {
      const list = this.buckets[index];
      const node = list.findNodeByKey(key);
      if (node) return true;
      else return false;
    }
  }
}

const hashMap = new HashMap(4, 0.75);

hashMap.set("Messi", 10);
hashMap.set("C. Ronaldo", 7);
hashMap.set("Neymar Jr.", 11);
hashMap.set("Xavi", 6);
hashMap.set("Iniesta", 8);

console.log(hashMap.get("Messi"));
console.log(hashMap.has("C. Ronaldo"));
console.log(hashMap.buckets);
console.log(hashMap.size);
console.log(hashMap.capacity);
