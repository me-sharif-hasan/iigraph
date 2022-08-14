class Face extends Path{
    constructor(canvas){
        super(canvas);
        this.createFace();
    }
    createFace(){
        this.addPath("M351,163.5a59,58.5,0,1,0,118,0a59,58.5,0,1,0,-118,0");
        this.fill("white",0);
        this.addPath("M364.24439834024844,169.47136929460595C364.24439834024844,180.986887966805,372.96464730290467,191.6285477178419,387.124647302905,197.38630705394195C401.27975103734457,203.1440663900413,418.7202489626558,203.1440663900413,432.87535269709565,197.38630705394195C447.0353526970961,191.6285477178419,455.7556016597513,180.986887966805,455.7556016597513,169.47136929460595");
        this.fill("none",1);
        this.addPath("M370.2668049792536,165.8885477178422L358.2268879668054,173.04933609958488");
        this.fill("black",2);
        this.addPath("M449.7331950207472,165.8885477178422L461.77311203319437,173.04933609958488");
        this.fill("black",3);
        this.addPath("M379.89893443983476,146.78502074688805a3.612268879668048,9.551035269709553,0,1,0,7.2244887966804905,0a3.612268879668048,9.551035269709553,0,1,0,-7.2244887966804905,0");
        this.fill("black",4);
        this.addPath("M432.87652780082936,146.78502074688805a3.612268879668048,9.551035269709553,0,1,0,7.2244887966804905,0a3.612268879668048,9.551035269709553,0,1,0,-7.2244887966804905,0");
        this.fill("black",5);

        this.stroke("black");
        this.strokeWidth(4);
    }
}