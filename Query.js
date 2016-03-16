/**
 * Created by Jack on 3/13/2016.
 */
//4中情况不能用this（行间，套一层，定时器，绑定）
//只有Query元素才可以使用Query方法
//链式操作 最后return this
//绑定事件
function myAddEvent(obj,sev,fn){
    if(obj.attachEvent){
        obj.attachEvent(on+'sev',function(event){
            if(false==fn.call(obj)){
                event.cancelBubble=true;
                return false;
            }
        });
    } else if(obj.addEventListener){
        obj.addEventListener(sev,function (ev){
            if(false==fn.call(obj)) {
                ev.cancelBubble=true;
                ev.preventDefault();
            }
        },false);
    }
}

//获取所需要的class标签
function getMyClass(oParent,sClass){
    var aEle=oParent.getElementsByTagName('*');
    var result=[];
    var i=0;
    for(i=0;i<aEle.length;i++){
        if(aEle[i].className==sClass){
            result.push(aEle[i]);
        }
    }
    return result;
}

//获取非行间的样式
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj,false)[attr];
    }
}

//选择器
function Query(vArg) {
    this.elements=[];//存放选择元素，elements是属性

    switch (typeof vArg) {
        case 'function':
            myAddEvent(window, 'load', vArg);
            break;
        case 'string':
            switch(vArg.charAt(0)){
                case '#':
                   var obj=document.getElementById(vArg.substring(1));
                    this.elements.push(obj);
                    break;
                case '.':
                    this.elements=getMyClass(document,vArg.substring(1));
                    break;
                default :
                    this.elements=document.getElementsByTagName(vArg);
            }
            break;
        case 'object':
            this.elements.push(vArg);
            break;
    }
}

//click()
Query.prototype.click=function(fn){
    var i=0;
    for(i=0;i<this.elements.length;i++){
        myAddEvent(this.elements[i],'click',fn);
    }
};

//show（）
Query.prototype.show=function(){
    var i;
    for(i=0;i<this.elements.length;i++){
        this.elements[i].style.display='block';
    }
};

//hide()
Query.prototype.hide=function(){
    var i;
    for(i=0;i<this.elements.length;i++){
        this.elements[i].style.display='none';
    }
};


//hover()
Query.prototype.hover=function(fnOver,fnOut){
    var i=0;
    for(i=0;i<this.elements.length;i++) {
        myAddEvent(this.elements[i], 'mouseover', fnOver);
        myAddEvent(this.elements[i], 'mouseout', fnOut);
    }
};

//css()
Query.prototype.css=function(attr,value){
  if(arguments.length==2){
      var i;
      for(i=0;i<this.elements.length;i++){
          this.elements[i].style[attr]=value;
      }
  }else {
      if(typeof attr=='string'){
          return getStyle(this.elements[0],attr);
      } else {
          for(i=0;i<this.elements.length;i++){
              var k='';
              for(k in attr){
                  this.elements[i].style[k]=attr[k];
              }
          }
      }
  }
    return this;
};

//toggle()
Query.prototype.toggle=function(){
    var _arguments=arguments; //与this一样复杂
    var i;
    for(i=0;i<this.elements.length;i++){
        addToggle(this.elements[i]);
    }
    function addToggle(obj){
        var count=0;
        myAddEvent(obj,'click',function(){
            _arguments[count%_arguments.length].call(obj);
            count++;
        })
    }
};

//attr()
Query.prototype.attr=function(attr,value){
    if(arguments.length==2){
        var i;
        for(i=0;i<this.elements.length;i++){
            this.elements[i].setAttribute(attr,value);
        }
    } else {
       return this.elements[0].getAttribute(attr);
    }
};

//eq()
Query.prototype.eq=function(n){
    return $(this.elements[n]);
};

//appendArr()
function appendArr(arr1,arr2){
    var i;
    for(i=0;i<arr2.length;i++){
        arr1.push(arr2[i]);
    }
}

//find()
Query.prototype.find=function(str){
    var i=0;
    var aResult=[];
    for(i=0;i<this.elements.length;i++){
        switch(str.charAt(0)){
            case ".":
                var aEle=getMyClass(this.elements[i],str.substring(1));
                aResult=aResult.concat(aEle);
                break;
            default :
                var aEle=this.elements[i].getElementsByTagName(str);  //不是数组，不可用concat()方法
                appendArr(aResult,aEle);
        }
    }
    var newQuery=$();
    newQuery.elements=aResult;
    return newQuery;
};

function getIndex(obj){
    var aBrother=obj.parentNode.children;
    var i=0;
    for(i=0;i<aBrother.length;i++){
        if(aBrother[i]==obj){
            return i;
        }
    }
}

//同辈元素的位置
Query.prototype.index=function(){
    return getIndex(this.elements[0]);
};

//绑定事件
Query.prototype.bind=function(sEv,fn){
    var i=0;
    for(i=0;i<this.elements.length;i++){
        myAddEvent(this.elements[i],sEv,fn);
    }
};

//插件机制
Query.prototype.extend=function(name,fn){
    Query.prototype[name]=fn;
};

//简便记法
function $(vArg) {
    return new Query(vArg);
}




