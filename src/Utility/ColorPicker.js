var colorBlock = document.getElementById('color-block');
var ctx1 = colorBlock.getContext('2d');
var width1 = colorBlock.width;
var height1 = colorBlock.height;

var colorStrip = document.getElementById('color-strip');
var ctx2 = colorStrip.getContext('2d');
var width2 = colorStrip.width;
var height2 = colorStrip.height;
var callback=undefined;
var colorPicker = document.getElementById('color-picker');

var x = 0;
var y = 0;
var drag = false;
var rgbaColor = 'rgba(255,0,0,1)';

ctx1.rect(0, 0, width1, height1);
fillGradient();

ctx2.rect(0, 0, width2, height2);
var grd1 = ctx2.createLinearGradient(0, 0, 0, height1);
grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
ctx2.fillStyle = grd1;
ctx2.fill();

function click(e) {
  x = e.offsetX;
  y = e.offsetY;
  var imageData = ctx2.getImageData(x, y, 1, 1).data;
  rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  fillGradient();
}

function fillGradient() {
  ctx1.fillStyle = rgbaColor;
  ctx1.fillRect(0, 0, width1, height1);

  var grdWhite = ctx2.createLinearGradient(0, 0, width1, 0);
  grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
  grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
  ctx1.fillStyle = grdWhite;
  ctx1.fillRect(0, 0, width1, height1);

  var grdBlack = ctx2.createLinearGradient(0, 0, 0, height1);
  grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
  grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
  ctx1.fillStyle = grdBlack;
  ctx1.fillRect(0, 0, width1, height1);
}


function changeColor(e) {
  x = e.offsetX;
  y = e.offsetY;
  var imageData = ctx1.getImageData(x, y, 1, 1).data;
  rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  if(callback!=undefined) callback(rgbaColor);
}

function toggleColorPicker(flag,callbackfn,x,y){
    if(flag){
        colorPicker.style.display="block";
        colorPicker.style.left=x+"px";
        colorPicker.style.top=y+"px";
        callback=callbackfn;
    }else{
        colorPicker.style.display="none";
        callback=undefined;
    }
}

$(colorStrip).on("drag",function(e){
    e=e.mouseup==undefined?(e.mousemove==undefined?e.mousedown:e.mousemove):e.mouseup;
    if(e.target.isEqualNode(colorStrip))
    {click(e);
    changeColor(e);}
});
$(colorBlock).on("drag",function(e){
    e=e.mouseup==undefined?(e.mousemove==undefined?e.mousedown:e.mousemove):e.mouseup;
    if(e.target.isEqualNode(colorBlock))
    changeColor(e);
});

$(window).on("click",function(e){
    if(e.target.dataset.hidecolorpicker!="false") toggleColorPicker(false);
})
let colorPickerHead=document.getElementById("color-picker-head");
$(colorPickerHead).on("drag",function(e){
    if(e.mousemove!=undefined){
       let p=colorPickerHead.parentNode;
       p.style.top=p.offsetTop-e.difference.y+"px";
       p.style.left=p.offsetLeft-e.difference.x+"px";
    }
});