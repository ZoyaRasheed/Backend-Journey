import EventEmitter from "events";

class Chat extends EventEmitter
{
    sendMessage(msg){
        console.log(`Message : ${msg}`)
        this.emit('msgReceived', msg)
    }
}

const chat = new Chat()
chat.on('msgRecieved', (msg)=>{
    console.log(`Message ${msg}`)
})
//trigger the event
chat.sendMessage('Hello zoya`')