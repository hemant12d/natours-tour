// let str = "hemant soni real name is hemant soni and also hemant soni";
// 	console.log(str.split('soni').join('sunar'));

let value = val=> {console.log(val)};

// console.log(typeof value) // => return function

// let obj = {};
// let obj1 = obj;
// let obj2 = {};
// let obj2 = obj1; // assingin address of obj1 to obj2

// console.log(obj == obj1) // true


let arr = [3, 4];
let arr1 = arr;
let arr2 = [3, 4];

arr[2] = "new balue";

console.log(arr, arr1) // [ 3, 4, 'new balue' ] [ 3, 4, 'new balue' ]
console.log(arr2 == arr1) // false
console.log(arr == arr1) // true