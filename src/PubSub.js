export class PubSub{
    static instance = null;
    constructor(){
        this.events={}
    }

    static createInstance(){
        if(!PubSub.instance){
            const newInstance = new PubSub()
            PubSub.instance = newInstance
        }
        return PubSub.instance
    }

    subscribe(eventName, fn){
        this.events[eventName] =this.events[eventName]??[]
        this.events[eventName].push(fn)
    }

    unSubscribe(eventName, fn){
        if(this.events[eventName]){
            this.events[eventName] = this.events[eventName].filter(f=>f!==fn)
        }
    }

    publish(eventName, data){
        if(this.events[eventName]) this.events[eventName].forEach(f=>f(data))
    }
}

export const pubSub = PubSub.createInstance();