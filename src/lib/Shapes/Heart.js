class Heart extends Path{
    constructor(canvas){
        super(canvas);
        this.createHeart();
    }
    createHeart(){
        this.addPath("M510.97440437855573,131.7901119707815c-7.57714782305944,0,-14.715948251396428,2.8479662674831125,-20.08048541538067,8.002384089618042l-2.2126106590752084,2.1259466503747175L486.426950274099,139.75238385944905c-5.364537163984235,-5.154417822134928,-12.503337592321225,-8.002384089618042,-20.08048541538067,-8.002384089618042c-7.556274137596468,0,-14.674200880470483,2.8279101670078797,-20.03873804445473,7.982327989142807S438,151.72587584316335,438,159.00624031567293s2.9640633357422623,14.119494734564176,8.32860049972649,19.273912556699106l39.76437080696485,38.20687140531919l0.0834947418518947,0.08022440190093276c0.6888316202781303,0.6618513156826955,1.6072737806489719,0.9827489232864274,2.504842255556841,0.9827489232864274c0.918442160370841,0,1.836884320741682,-0.3409537080789641,2.525715941019815,-1.002805023761659l39.76437080696485,-38.20687140531919c5.364537163984235,-5.154417822134928,8.32860049972649,-11.99354808418947,8.32860049972649,-19.273912556699106s-2.943189650279285,-14.139550835039396,-8.307726814263516,-19.273912556699106C525.6486052590263,134.6180221377895,518.5306785161523,131.7901119707815,510.97440437855573,131.7901119707815z");
        this.fill("red");
    }
}