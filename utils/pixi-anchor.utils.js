(function main(){
  if(typeof PIXI !== "object") return requestAnimationFrame(main);
  
  //helper function to define getters and setters
  function getSet(obj,prop,get,set){
    Object.defineProperty(obj,prop,{
      enumerable: true,
      configurable: true,
      get: get, set: set
    });
  };
  
  //helper function to remove getters and setters
  function realValue(obj,prop,value){
    Object.defineProperty(obj,prop,{
      enumerable: true,
      configurable: true,
      writable: true,
      value: value
    });
  };
  
  
  
  //apply automatic .anchor property calculation on obj
  function autoAnchor(obj,anchorCache,pivotCache){
    
    var firstRun = true;
    
    /*
     * if WeakMap is not supported by browser,
     * the computed property getter will always
     * return a new object
     */
    if(!anchorCache && typeof WeakMap === "function"){
      anchorCache = new WeakMap;
    }
    if(!pivotCache && typeof WeakMap === "function"){
      pivotCache = new WeakMap;
    }
    
    getSet(obj,"anchor",function getter(){
        
        //if the object exist in cache, return it
        if(!firstRun && anchorCache && anchorCache.has(this)) return anchorCache.get(this);
        
        //else create a new auto-computing point
        var self = this;
        var point;
        if(firstRun && anchorCache && anchorCache.has(this)){
          point = anchorCache.get(this);
        }else{
          point = new PIXI.Point();
        }
        
        getSet(point,"x",function(){ return self.pivot.x/self.width  },function(){});
        getSet(point,"y",function(){ return self.pivot.y/self.height },function(){});
        
        if(anchorCache) anchorCache.set(this,point); //save to cache
        
        /*
         * if the user tries to force change the computed property
         * to pivot, he would logically do `obj.anchor=obj.anchor`
         * this would however result in infinite recursion, therefore
         * we mark the point as possibly recursive so we know we
         * should remove the getters and setters
         */
        point._maybeRecursive = true;
        
        return point;
        
        
      },function setter(newValue){
        
        //remove getsetters from a recursive value
        if(newValue._maybeRecursive){
          realValue(newValue,"x",newValue.x);
          realValue(newValue,"y",newValue.y);
        }
        
        //remove getsetters from anchor
        realValue(this,"anchor",newValue);
        
        //this feature is not compatibile with Sprite
        if(this instanceof PIXI.Sprite) return;
        
        if(pivotCache && this.pivot instanceof PIXI.Point){
          pivotCache.set(this.pivot);
        }
        //enable pivot auto-computation
        autoPivot(this,anchorCache,pivotCache);
        
    });
    
  };
  
  
  
  //apply automatic .pivot property calculation on obj
  //this is essentially the same, so I won't comment it
  function autoPivot(obj,anchorCache,pivotCache){
    
    var firstRun = true;
    
    if(!anchorCache && typeof WeakMap === "function"){
      anchorCache = new WeakMap;
    }
    if(!pivotCache && typeof WeakMap === "function"){
      pivotCache = new WeakMap;
    }
    
    getSet(obj,"pivot",function getter(){
        
        if(!firstRun && pivotCache && pivotCache.has(this)) return pivotCache.get(this);
        
        //else create a new auto-computing point
        var self = this;
        var point;
        if(firstRun && pivotCache && pivotCache.has(this)){
          point = pivotCache.get(this);
        }else{
          point = new PIXI.Point();
        }
        
        getSet(point,"x",function(){ return self.anchor.x*self.width  },function(){});
        getSet(point,"y",function(){ return self.anchor.y*self.height },function(){});
        
        if(pivotCache) pivotCache.set(this,point);
        point._maybeRecursive = true;
        
        return point;
        
        
      },function setter(newValue){
        
        if(newValue._maybeRecursive){
          realValue(newValue,"x",newValue.x);
          realValue(newValue,"y",newValue.y);
        }
        realValue(this,"pivot",newValue);
        
        if(this instanceof PIXI.Sprite) return;
        
        if(anchorCache && this.anchor instanceof PIXI.Point){
          anchorCache.set(this.anchor);
        }
        autoAnchor(this,anchorCache,pivotCache);
        
    });
    
  };
  
  
  
  autoAnchor(PIXI.DisplayObject.prototype);
  
})();