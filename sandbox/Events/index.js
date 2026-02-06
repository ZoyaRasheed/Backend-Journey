import EventEmitter from 'events';

// Creating and Using Event Emitters in Node js 
// Events are like actions whoch trigger the responses in node js , and it sis handled by event emitter class which is included int he events module
// We use events beacuse it really helps in asynchronous programming anr in real time applications and core modules use events internally 


// New instance of event
const emitter = new EventEmitter();

//1..... create an event and then attach listener to it 
emitter.on('first', ()=>{
    console.log('Helllow')
})
emitter.on('second', (username)=>{
    console.log(`Helllow ${username}`)
})

//2..... Emit the event (while emitting the event you can aslo pass arguments)
emitter.emit('first')
//now here zoya is passed as an argument
emitter.emit('second', 'zoya')

// applying listeners
const myListener = () => console.loh('My first listener')
emitter.on('first', myListener)
emitter.emit('first')
// To remove the listeners 

emitter.removeListener('first',myListener )
emitter.emit('first') // now here after removing the listener we won't be able to emit the event again



// we can list the listeners on events too , its gives us arrays for multicallable and one listener for single callable
console.log(emitter.listeners('first'))


// we can handle the errors also using the event and event emitter 

emitter.on('error', (err)=>{
    console.error(`Error occured : ${err.message}`)
})
emitter.emit('error',new Error('Something went wrong'))
