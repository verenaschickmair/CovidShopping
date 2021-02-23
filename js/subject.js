
export default class Subject {
    #changeListeners;

    constructor() {
        //assoziativer Array
        this.#changeListeners = [];
    }

    //Anmelden an den Newsletter
    subscribe(topic, listenerObj,callbackFct){
        if(this.#changeListeners[topic] == undefined){
            this.#changeListeners[topic] = [];
        }
        this.#changeListeners[topic].push({
            obj:listenerObj,
            fct: callbackFct
        });
    }

    //Abmelden
    unsubscribe(topic, listenerObj){
        let observersForTopic = this.#changeListeners[topic];
        if(observersForTopic){
            for(let i=0; i<observersForTopic.length;i++){
                if(observersForTopic[i].obj==listenerObj){
                    observersForTopic.splice(i,1);
                    break;
                }
            }
        } else {
            throw "ERROR: Could not find any observers for topic " + topic;
        }
    }

    notify(topic,param){
        let observersForTopic = this.#changeListeners[topic];
        if(observersForTopic){
            for(let listener of observersForTopic){
                //call allows to explicitly set this in the callback
                listener.fct.call(listener.obj,param);
            }
        }else {
            throw "ERROR: Could not find any observers for topic " + topic;
        }
    }
}
