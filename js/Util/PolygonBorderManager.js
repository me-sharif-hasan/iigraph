class PolygonBorderManager{
    constructor(shape){
        this.baseShape=shape;
        this.borderLine1=this.createBorder();
        this.borderLine2=this.createBorder();
        this.borderLine3=this.createBorder();
        this.borderLine4=this.createBorder();

        this.getBase().create(this.borderLine1);
        this.getBase().create(this.borderLine2);
        this.getBase().create(this.borderLine3);
        this.getBase().create(this.borderLine4);
    }
    initBorders(){
        let svgShape=this.getBase().getSVGShape();
        let bounds=svgShape.getBBox();
        console.log(bounds);
        let points={
            0:{
                "x":bounds.x,
                "y":bounds.y
            },
            1:{
                "x":bounds.x,
                "y":bounds.y+bounds.height
            },
            2:{
                "x":bounds.x+bounds.width,
                "y":bounds.y+bounds.height
            },
            3:{
                "x":bounds.x+bounds.width,
                "y":bounds.y
            }

        }
        this.l1=new Points({0:points[0],1:points[1]});
        this.l2=new Points({0:points[0],1:points[3]});
        this.l3=new Points({0:points[3],1:points[2]});
        this.l4=new Points({0:points[1],1:points[2]});
        this.points=new Points(points);

        this.getBase().addParameter("points",this.l1.getSvgPathPoints(),this.borderLine1);
        this.getBase().addParameter("points",this.l2.getSvgPathPoints(),this.borderLine2);
        this.getBase().addParameter("points",this.l3.getSvgPathPoints(),this.borderLine3);
        this.getBase().addParameter("points",this.l4.getSvgPathPoints(),this.borderLine4);
    }
    createBorder(){
        let line=this.getBase().createSVGDOM("polygon");
        this.getBase().addParameter("stroke-width","3",line);
        this.getBase().addParameter("stroke","green",line);
        this.getBase().addParameter("stroke-linejoin","round",line);
        return line;
    }
    redraw(){
        this.initBorders();
    }
    getBase(){
        return this.baseShape;
    }
}