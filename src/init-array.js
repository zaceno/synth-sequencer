export default function  (length, fn) {
    const arr = []
    for(var i = 0; i < length; i ++) arr.push(fn(i))
    return arr
}