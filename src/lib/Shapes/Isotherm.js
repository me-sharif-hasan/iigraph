class Isotherm extends Path{
    constructor(canvas){
        super(canvas);
        this.createIsotherm();
    }
    createIsotherm(){
        this.addPath("M348.18600198896183,207.40900113612236L402.77637114265235,76.58499912586626L457.3670015245917,207.40900113612236H348.18600198896183H348.18600198896183Z");
        this.stroke("black")
        this.fill("white")
        this.strokeWidth(4);
    }
}