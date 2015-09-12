/*
Inspired by markE's answer on StackOverflow
http://stackoverflow.com/a/24091727/1137334
I guess it's still not legally OK, tho...
*/

(function main(global){

global.UTILS = global.UTILS||{};
if(!UTILS.traceGrid) return requestAnimationFrame(function(){main(global)});


var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

UTILS.traceImage = function splitImage(img,mapFn){
  var parts = [];
  
  canvas.width  = img.width ;
  canvas.height = img.height;
  
  ctx.drawImage(img, 0, 0);
  
  
  while (true){
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    try{
      var points = UTILS.traceGrid(mapFn);
    }catch(e){ break; }
    
    
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for(var i = 1, l = points.length; i < l; i++){
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    ctx.globalCompositeOperation = "destination-out";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  
  return parts;
  
}



})(this);