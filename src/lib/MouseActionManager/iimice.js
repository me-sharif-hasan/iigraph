class iimise{
    constructor(element){
        this.element=element;
    }
    /**
     * Will set a event listener
     * @param {string/ string[]} eventName Name of the event(s).
     * @param {Function(event)/Function(event)[]} functionName The handler function(s).
     * @param {boolean} flag Flag
     */
    on(eventName,functionName,flag){
        if(Array.isArray(eventName)){
            if(Array.isArray(functionName)){
                if(eventName.length!=functionName.length){
                    console.error("Event name array and function array sould be equal in size");
                    return;
                }else{
                    for(let i=0;i<eventName.length;i++){
                        this.on(eventName[i],functionName[i]);
                    }
                }
            }else{
                for(let i=0;i<eventName.length;i++){
                    this.on(eventName[i],functionName);
                }            
            }
            return;
        }
        if(eventName=="drag"){
            this.manageDragEvent(functionName);
        }else{
            this.element.addEventListener(eventName,functionName,flag);
        }
    }

    /**
     * Will remove a event listener
     * @param {string/ string[]} eventName Name of the event(s).
     * @param {Function(event)/Function(event)[]} functionName The handler function(s).
     * @param {boolean} flag Flag
     */
    unset(eventName,functionName,flag){
        if(Array.isArray(eventName)){
            if(Array.isArray(functionName)){
                if(eventName.length!=functionName.length){
                    console.error("Event name array and function array sould be equal in size");
                    return;
                }else{
                    for(let i=0;i<eventName.length;i++){
                        this.unset(eventName[i],functionName[i]);
                    }
                }
            }else{
                for(let i=0;i<eventName.length;i++){
                    this.unset(eventName[i],functionName);
                }            
            }
            return;
        }
        this.element.removeEventListener(eventName,functionName,flag);
    }
    /**
     * This function will manage the drag event
     * @param {Function(event)} functionName - Handler function.
     */
    manageDragEvent(functionName){
        console.log("Drag event handler");
        let ref=this;
        this.d_MouseDownHandler=function(mousedownevent){
            let dragEvent={};
            dragEvent["mouseDown"]=mousedownevent;
            let moved=false;
            let d_MouseMoveHandler=function(mousemoveevent){
                dragEvent["mouseMove"]=mousemoveevent;
                functionName(dragEvent);
                moved=true;
            }
            ref.on("mousemove",d_MouseMoveHandler);
            $(window).on("mousemove",d_MouseMoveHandler);

            let d_MouseUpHandler=function(mouseupevent){
                if(moved){
                    ref.captureClick(window);
                    dragEvent["mouseUp"]=mouseupevent;
                    functionName(dragEvent);
                }
                ref.unset("mousemove",d_MouseMoveHandler);
                $(window).unset(["mouseup","mousemove"],[d_MouseUpHandler,d_MouseMoveHandler]);
            }
            $(window).on("mouseup",d_MouseUpHandler);
        }
        this.on("mousedown",this.d_MouseDownHandler);
    }

    captureClick(elm){
        let clickCapture=function(e){
            e.stopPropagation();
            $(elm).unset("click",clickCapture,true);
        }
        $(elm).on("click",clickCapture,true);
    }
}
/**
* iimise
* @param {HTML/ SVG DOM} element 
* @returns iimise mouse action manager
*/
$=function(element){
    return new iimise(element);
}