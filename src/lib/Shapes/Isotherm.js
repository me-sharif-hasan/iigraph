class Isotherm extends Path{
    constructor(canvas){
        super(canvas);
        this.createIsotherm();
    }
    createIsotherm(){
        this.addPath(`M430.18600275722224,262.4090029321504L513.7762998841952,151.58499940202447l83.59070272791007,110.82400353012584H430.18600275722224L430.18600275722224,262.4090029321504z`);
        this.stroke("black")
        this.fill("transparent")
        this.strokeWidth(4);
    }
}