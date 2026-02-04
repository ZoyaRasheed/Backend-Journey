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


// To remove the listeners 

