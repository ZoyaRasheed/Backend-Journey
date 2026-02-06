import { Buffer } from "buffer";

// Buffers are acctually temporaray storage for the binary data
// as Node js doesn't support direct binary data manipulation so buffer helps in that
// mainly used in file streams , network data and so on..

// const buf = Buffer.alloc(4)
// // we can work with them as with arrays
// console.log(buf)


const buf = Buffer.from('Hellow Zoya')
console.log(buf.toString())

//read and write to buffer
buf.write('Zoyaaaaaa')
console.log(buf.toString())


// Above what is hppening , writing start from the very beginning and overwrites and doesn;t increase buffer size 

const buf2 = Buffer.from('ZoyaRasheed')
buf2[0] = 0x28
console.log(buf2.toString())


const buf3 = Buffer.from('Hi')
const buf4 = Buffer.from('my name is Zoya')
const merged = Buffer.concat([buf3,buf4])
console.log(merged.toString())

