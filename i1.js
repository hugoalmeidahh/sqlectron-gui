const { fromJS,List } = require('immutable')
var a=[{},{},{}]
const i=List(a)
console.log(i);
var i2=[]
    i.forEach((currentValue, index, arr)=>{
        currentValue.checked
            i2.push(currentValue);
    })
console.log(i2);
// const nested = fromJS({ a: { b: { c: [ 3, 4, 5 ] } } })

// const nested2 = nested.mergeDeep({ a: { b: { d: 6 } } })
// // Map { a: Map { b: Map { c: List [ 3, 4, 5 ], d: 6 } } }

// console.log(nested2.getIn([ 'a', 'b', 'd' ])) // 6

// const nested3 = nested2.updateIn([ 'a', 'b', 'd' ], value => value + 1)
// console.log(nested3);
// // Map { a: Map { b: Map { c: List [ 3, 4, 5 ], d: 7 } } }

// const nested4 = nested3.updateIn([ 'a', 'b', 'c' ], list => list.push(6))
// // Map { a: Map { b: Map { c: List [ 3, 4, 5, 6 ], d: 7 } } }