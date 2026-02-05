import ChatRoom from "./chatRoom.js";

const chat = new ChatRoom()

chat.on('join', (user)=>{
    console.log(`${user} joined the chat`)
})
chat.on('message', (user,message)=>{
    console.log(`${user} sent the message: ${message}`)
})
chat.on('left', (user)=>{
    console.log(`${user} left the chat`)
})


// Now simulating the chat
chat.join('Zoya')
chat.sendMessaage('Zoya','Hello everyone!')
chat.leave('Zoya')
chat.sendMessaage('Zoya','Message wont be sent ')