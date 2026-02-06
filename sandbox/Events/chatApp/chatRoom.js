import EventEmitter from "events";

export default class ChatRoom extends EventEmitter{
    constructor(){
        super()
        this.users = new Set();
    }

    // now we can add functionalities
    join(user){
        this.users.add(user)
        this.emit('join', user)
    }

    // now user can send the messagd too
    sendMessaage(user, message){
        //first validate if the user is active user 
        if(this.users.has(user)){
            this.emit('message',user, message)
        }else{
            console.log(`${user} is not in the chat`)
        }
    }

    //now user can leave too
    leave(user){

        if(this.users.has(user)){
        this.users.delete(user)
        this.emit('left', user)
        }else{
            console.log(`${user} cannot leave as he is not in the chat`)
        }
    }
}

