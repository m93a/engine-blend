(function main(global){
  "use strict";
  
  function defGetSet(obj,prop,get,set,conf){
    Object.defineProperty(obj,prop,{
      enumerable: true,
      configurable: !!conf,
      get: get, set:set
    });
  };
  
  function link(obj1,prop1,obj2,prop2){
    
    if(prop2===undefined) prop2=prop1;
    
    defGetSet(obj1,prop1,
              function( ){return obj2[prop2]},
              function(x){ obj2[prop2] = x });
  };
  
  if(!global.THREE){
    return requestAnimationFrame(function(){main(global)});
  }
  
  var PIXI  = global.PIXI  || Object.create(null);
  var Box2D = global.Box2D || Object.create(null);
  
  
  
  
  //#THREE.Vector2
  
  THREE.Vector2.prototype.toClass = function(type){
    type = Object(type);
    
    switch(type){
      
      
      case PIXI.Point:
        var result = new PIXI.Point;
        link(result,"x",this);
        link(result,"y",this);
        return result;
      
      
      case Box2D.Vec2:
        var result = new Box2D.Vec2;
        link(result,"x",this);
        link(result,"y",this);
        return result;
      
      
      default:
        throw new TypeError("Cannot convert to "+(type.name||"this class")+". Operation not supported.");
    }
  };
  
  
  THREE.Vector2.prototype.toNew = function(type){
    type = Object(type);
    
    switch(type){
      
      case PIXI.Point:
        return new PIXI.Point(this.x,this.y);
      
      case Box2D.Vec2:
        return new Box2D.Vec2(this.x,this.y);
      
      default:
        throw new TypeError("can't convert to "+(type.name||"this class")+", operation not supported");
    };
  };
  
  
  THREE.Vector2.from = function(like){
    
    if(like instanceof String)  like=""+like;
    if(like instanceof Number)  like=  +like;
    if(like instanceof Boolean) like= !!like;
    
    switch(typeof like){
      
      case "object":
      case "function":
        if("x" in like && "y" in like)
          return new THREE.Vector2(+like.x,+like.y);
        
        if(0 in like && 1 in like)
          return new THREE.Vector2(+like[0],+like[1]);
        
        if(1 in like && 2 in like)
          return new THREE.Vector2(+like[1],+like[2]);
        
        if("valueOf" in like)
          return THREE.Vector2.from( like.valueOf() );
        
        throw new TypeError("can't convert "+like+" to THREE.Vector2");
      
      case "string":
        var tmp = like..replace(";",",").split(",");
        tmp[0]=+tmp[0]; tmp[1]=+tmp[1];
        
        if(tmp.length===2 && !isNaN(tmp[0]) && !isNaN(tmp[1]))
          return new THREE.Vector2(tmp[0],tmp[1]);
        
        throw new TypeError("can't convert \"+"+string+"\" to THREE.Vector2");
      
      case "number":
        return new THREE.Vector2(like);
      
      default:
        throw new TypeError("can't convert "+like+" to THREE.Vector2");
    }
  };
  
  THREE.Vector2.representing = function(){};
  
})(this);