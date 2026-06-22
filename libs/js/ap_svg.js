(function(){
     
   var IE=true;//!!top.execScript;  
   var developments = ['attr','click','mouseover','mouseout','rotate','indicator','scale','flicker','motion','animate'];
   var _temp_input = [];
   //Для создания SVG элементов и установки атрибутов
   var SVG = {      
        //нужные пространства имен
        svgns: 'http://www.w3.org/2000/svg',
        xlink: 'http://www.w3.org/1999/xlink',      
        
        create_text:function(ctx, attr, text)
        {
         var e = this.create('text', get_param.text(attr));
         e.appendChild(document.createTextNode(text));
         return e;              
        },
        //создание svg элемента
        create: function(name, attrs)
        {
            var element = document.createElementNS(SVG.svgns, name);            
            if(typeof attrs == "object") {
                if(name == 'line') delete attrs['box-shadow'];
                SVG.setAttr(element, attrs);
            }
            return element;
        },      
        return_fill:function(fill)
        {
           if(typeof fill == "undefined") return false; 
           var mas = fill.split('-'); 
           if (mas.length > 2 && (fill.indexOf('url')!=0) ){ //Это градиент
             return 'url(#' + SVG.create_gradient(fill)+')';
           }
           else return fill;
        },
        
        //установка атрибутов
        setAttr: function(element, attrs) 
        {
            for(var i in attrs) {
                if(i === 'href') { //путь к изображению приписывается в атрибуте xlink:href
                    element.setAttributeNS(SVG.xlink, 'xlink:href', attrs[i]);
                } else { //обычный атрибут
                    var attr = attrs[i];
                    switch (i.toLowerCase()) {
                        case 'fill': attr = this.return_fill(attrs[i]);  break;
                        case 'box-shadow':attr = this.create_drop_shadow(attrs[i]);  i='filter'; break;
                    }
                  element.setAttribute(i, attr);
                }
            }
            return element;
        },
        //Удаление атрибутов
        removeAttr: function(element, attrs) 
        {
            for(var i in attrs) {
                    element.removeAttribute(i);
            }
            return element;
        },        
        //Получить все атрибуты элемента, либо указанные в attr
        getAttr:function(element, attr){
         var a ={};   

         if( typeof attr !== "undefined" )
         {
            for (let i in attr) 
            {
                a[i] = element.getAttribute(i);
            }
         }
         else
         {
            for (let i=0; i<element.attributes.length; i++) a[element.attributes[i].nodeName] = element.attributes[i].nodeValue;
         }      
         return a;  
        },
        create_gradient: function(str) //Создание градиента ( возвращает идент. созданного градиента )
        {
            var id_str = str.replace(/[\(,\),\,]/g,'');
            if($(id_str)) return id_str; //Такой градиент уже создан
            var index = str.indexOf('-');
            var togle = str.substr(0, index);
            
            if((togle.charAt(0) == 'r')&&(togle.charAt(1) != 'i')) //Градиент радиальный
            {
              togle = togle.substring(togle.indexOf('(')+1,togle.lastIndexOf(')'));
              togle = togle.split(',');
              var cx = togle[0] || 50;
              var cy = togle[1] || 50;
              var r  = togle[2] || 50;
              var g = this.create('radialGradient', {id:id_str, cx:cx+'%',cy:cy+'%',r:r+'%'}); 
            }
            else{//Градиент линейный
                var x1 = 0; var y1 = 0; var x2 = 0; var y2 = 1; //Сверху вниз                
                switch (togle.toLowerCase()) 
                {
                   case 'right': x1 = 0; y1 = 0; x2 = 1; y2 = 0; break; //Слева направо. 
                   case 'left': x1 = 1; y1 = 1; x2 = 0; y2 = 1; break; //справа на лево.
                   case 'bottom' :x1 = 1; var y1 = 1; var x2 = 1; var y2 = 0; break;//снизу в верх  
                }
                
                var g = this.create('linearGradient', {id:id_str, x1:x1,y1:y1,x2:x2,y2:y2});               
            }
            
            this.defs.appendChild(g);
            var mas = str.split(':');   
            var offset = 0;
            var old_offset = 0; 
            var step;
            for(var i = 0; i < mas.length; i++)
            {
               var c = mas[i].split('-'); 
               
               if(mas.length == 1) 
               { 
                 offset = 100;  
                 step = offset / (c.length-2); 
               }
               else
               {
                   if((i+1) < mas.length) 
                   { 
                        old_offset = offset;
                        offset = mas[i+1].split('-')[0];
                   }  
                   else {
                     offset=100;
                   }            
               }               
               for(j = 1; j < c.length; j++ )
               {     
                 var _offset = offset;
                 if((i == 0) && ( j==1 ) )  {_offset = 0; }
                 else
                 {  
                    if(mas.length == 1)
                    {
                       _offset = Number(old_offset) + Number(step);
                       old_offset = _offset;               
                    }
                    else
                    {
                         if(c.length > 2) 
                         {
                             if (j < c.length-1) 
                             { 
                                _offset = offset - old_offset;
                                step = _offset/(c.length-1)*j;
                                _offset = Number(old_offset) + Number(step);  
                             }
                         }     
                    }        
                 }              
                 if((i == mas.length - 1) && (j == c.length-1)) _offset = 100;
                 var stop = SVG.create('stop', {offset:_offset+'%', 'stop-color':c[j]});
                 g.appendChild(stop);
               }
            }
          return id_str;  
        },
        //Создать шаблон для заливки
        create_pattern:function(pattern, elements)
        {
            var p = this.create('pattern', pattern);
            var el = null;
            for(var i in elements)
            {
                el = this.create(i, elements[i]);
                p.appendChild(el);
            }
           this.defs.appendChild(p); 
        },
        //Создать тень
        create_drop_shadow:function(attr)
        {
          attr = attr.split(' ');  
          var dx = (typeof attr[0] == "undefined" )?2:attr[0];   
          var dy = (typeof attr[0] == "undefined" )?2:attr[1]; 
          var std = (typeof attr[0] == "undefined" )?2:attr[2]; 
          var color = attr[3] || 'black';
          var id = 'drop_shadow-'+dx+"-"+dy+"-"+std+"-"+color; 
          if($(id)) return 'url(#' + id+')';  //Такая тень уже создана
          var f = this.create('filter',{id:id,x0:"-50%", y0:"-50%", width:"200%", height:"200%"}); 
          f.appendChild(this.create('feGaussianBlur',{'in':"SourceAlpha", stdDeviation:std}));
          f.appendChild(this.create('feOffset',{dx:dx, dy:dy, result:"blur"})); 
          f.appendChild(this.create('feFlood',{'flood-color':color}));
          f.appendChild(this.create('feComposite',{in2:"blur", operator:"in", result:"colorShadow"}));
          f.appendChild(this.create('feComposite',{'in':"SourceGraphic", in2:"colorShadow", operator:"over"})); 
          this.defs.appendChild(f);
          return 'url(#' + id+')';
        },
        ctx:null, //Ссылка на холст
        defs:null
   };
  //Параметры по умолчанию
   var get_param = {
     text:function(param){
        param.style = param.style || "font-size:14px;";
        param.fill = param.fill || param.f || "#000000";
        return param;
     }
     /*,
     rect:function(param){
        param.style = param.style || "fill:white;stroke-width:1; stroke:black;";
        param.width = param.width || 30;
        param.height = param.height || 15;
        return param;
     }     
     */
   };
   
   function $(id){ return document.getElementById(id); };
   //Вывод в консоль
   function log(text){ console.log(text); };
   //Проверка значения в массиве на присутствие
   function in_array(value, array) 
   {
     for(var i = 0; i < array.length; i++) 
     {
        if(array[i] == value) return true;
     }
     return false;
   }
   //Проверка на массив
   function is_array(mix) 
   {
    return ( mix instanceof Array );
   }
   
   //Возврат булевого значения переменной
   function _boolean(v, def)
   {
     if(typeof v == "undefined") return def;
     if(v === true) return true;
     if(typeof v == "string") { if (v.toLowerCase() == 'true') return true; };
     return false;
   }
   
   //Привязка функции к контексту
   function bind(func, context) 
   {
     return function() { 
    return func.apply(context, arguments); 
    };
   }  

 function init_sign(str)
 {
   var z = str.charAt(0);
   var arr = ['=',str];
   if (in_array(z, ['>','=','>'])) 
   { 
     arr[0] = z;
     arr[1] = str.substr(1);
   }
   return arr;
 }

   
   //Получить смещение элемента 1 
   function getOffsetSum(elem) 
   {
    var top=0; left=0;
    while(elem) {
        top = top + parseFloat(elem.offsetTop);
        left = left + parseFloat(elem.offsetLeft);
        elem = elem.offsetParent;        
    }
    
    return {top: Math.round(top), left: Math.round(left)}
   }

   //Получить смещение элемента 2
   function getOffsetRect(elem) 
   {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var top  = box.top +  clientTop;
    var left = box.left + clientLeft;
    
    return { top: Math.round(top), left: Math.round(left) }
   }
   //Получить смещение элемента
   function getOffset(elem) 
   {
    if (elem.getBoundingClientRect) {
        return getOffsetRect(elem);
    } else {
       return getOffsetSum(elem);
    }
   }

   //Установить для объекта параметры по умолчанию
   function default_param(obj)
   {
     if(!('x' in obj)) obj.x = 1;
     if(!('y' in obj)) obj.y = 1;
   }
   
   
   function drawing(draw, e)
   {
     for(var i1 = 0; i1 < draw.length; i1++)
     {
        var elem = draw[i1].type || '_default';
        var param = draw[i1];
        if(elem == 'pattern')
        {            
            e.pattern(param.attr, param.draw);
            continue;
        };
        if(!(elem in object)) {log('Ошибка: тип объекта '+param.type+' не найден'); continue;};
        //Объект входит в группу классов
        
        if('class' in param)
        {
         var re = /\s* \s*/;
         
         var list = param['class'].split(re);
         for(var i = 0; i < list.length; i++)
         {
            if(e['class'][list[i]])
            {
               for( var n in e['class'][list[i]] )
               {
                  if(typeof param.attr[n] == "undefined")    param.attr[n] = e['class'][list[i]][n];
               } 
            }
            else log("ERROR -> drawing': не найден класс '"+list[i]+"'");
         }            
        };                     
       //append_object(e.ctx,  new object[elem](param || {}, e)); 
        if(in_array(elem,['line','rect','circle','path','poligon','image'])) {
            e.ctx.appendChild(SVG.create(elem, param.attr));  
        }
        else{
           e.ctx.appendChild((new object[elem](param || {}, e)).node); 
        }
     }
   }
   
   function transformation()
   {
     this.c = [
       0,//текущий сдвиг по X
       0,//текущий сдвиг по Y
       0,//текущий градус вращения
       1,//текущий масштаб по X
       1,//текущий масштаб по Y
       0,//текущий наклон по X
       0,//текущий наклон по Y
     ];
     this.m = [false,false,false,false,false]; // текущая матрица анимации: перемещение|поворот|масштабирование|наклон_x|наклон_y
     this.d = [false,false,false,false,false]; // матрица анимации по умолчанию: перемещение|поворот|масштабирование|наклон_x|наклон_y
     this.reset = function(type)
     {
        switch (type) {
            case 'motion':
                this.d[0] = false;
                this.m[0] = false;
                this.c[0] = 0; 
                this.c[1] = 0;
            break;
            case 'scale':
                this.d[2] = false;
                this.m[2] = false;
                this.c[3] = 1; 
                this.c[4] = 1;
            break;            
        }
     }
   }
   
   
   //Создание объекта  name - имя объекта, param - его параметры, e - объект мнемосхемы 
   function create_object(name, param, e)
   {       
        var elem = param.type || '_default';
        
        if(elem == 'pattern')
        {            
            e.pattern(param.attr, param.draw);
            return false;
        }    
            
        if(!(elem in object)) {log('Ошибка: тип объекта '+param.type+' не найден'); return false};        
        param.attr = param.attr || {};
        //Объект входит в группу классов
        if('class' in param)
        {
         var re = /\s* \s*/;
         var list = param['class'].split(re);
         for(var i = 0; i < list.length; i++)
         {
            if(e['class'][list[i]])
            {
               for( var n in e['class'][list[i]] )
               {
                  if(typeof param.attr[n] == "undefined")    param.attr[n] = e['class'][list[i]][n];
               } 
            }
            else log("ERROR -> Объект '"+name+"': не найден класс '"+list[i]+"'");
         }            
        };
        
        
        if( name ) {
            //Если есть имя объета то добавим его в глобальный массив объектов
            e.objects[name] = new object[elem](param, e); 
            e.objects[name].name = name;        
            var obj = e.objects[name];            
        }   
        //имя не задано
        else{
         var obj = new object[elem](param,e);
         var uid = new Date();
         //Все равно нужно дать какое то имя для его идентификации
         obj.name = 'obj_'+uid.getTime();
        };            
        
        //Задаём объект трансформации по умолчанию
        obj._tr = new transformation();
                
        //хранятся ссылки на обекты которые присоединились к этому объекту
        obj.to_inputs = [];
        obj.parent = e;
        for(var i in param) { if ( !in_array(i,developments) )  obj[i] = param[i];  };
        if(('init' in obj)) {  obj.init(); };
        default_param(obj);
        var v = param.value || {}; if( typeof v != "object" ) { v = {value:v} };
        obj.value = value(v, obj);
        if(!('draw' in obj)) obj.draw = function(){}; 
        //add_event(obj, param);
        //активирует динамизацию если она есть
        obj._dynamic = [];
        init_dynamic(obj);
     return obj;                             
   };
   
   //Навешиваем события объекту
   function add_event(obj, param)
   {       
        if(obj.node) 
        { 
            if('click' in param) obj.click(param.click);
            if('mouseover' in param) obj.mouseover(param.mouseover);
            if('mouseout' in param) obj.mouseout(param.mouseout);
            if('rotate' in param) { obj.rotate(param.rotate); }
            if('motion' in param) { obj.motion(param.motion); }
            if('indicator' in param) { obj.indicator = new indicator(obj, param.indicator); }
            if('flicker' in param) { obj.flicker = new flicker(obj, param.flicker); }
            if('scale' in param) { obj.scale(param.scale);}
            if('animate' in param) { obj.animate(param.animate);}
        }        
   }
   
   //Полное добавление объекта в проект
   function add_object(name, param, e)
   {    
     if(name !== null) { if(name in e.objects) { log('Объект с именем '+name+ ' уже создан'); return false; };}
       
        var obj = create_object(name, param, e); //создали объект
        
        if(obj === false) return false;
        
        if(obj.node) 
        { 
            
             if (param.defs === true) 
             { 
                append_object(this.defs, obj); 
             } 
             else 
             {
                //Добавили его на холст
                append_object(e.ctx, obj);
                add_event(obj, param); //Навешали ему событий 
             }  
        } 
        return obj; 
   }
      
   //Добавить объект obj в узел node
   function append_object(node, obj)
   {
     node.appendChild(obj.node);    
     obj.draw();   
   }
   
   function get_scale_object(obj)
   {
     if(obj.node.style.display != 'none' )
     {
         obj.x = obj.x || obj.node.getBBox().x;
         obj.y = obj.y || obj.node.getBBox().y;
         obj.width = obj.node.getBBox().width;
         obj.height = obj.node.getBBox().height;    
         obj.centerX = Number(obj.x) + obj.width/2; 
         obj.centerY = Number(obj.y) + obj.height/2; 
     }
     else return false;
   }

   //Создание всех элементов проекта obj - массив объектов, e объект мнемосхемы
   function create_objects(obj, e)
   {
     for(var el in obj) add_object(el, obj[el], e); 
   };
   
   function set_view_box(arr, e)
   {
     e.ctx.setAttribute('viewBox', arr.join(" "));
   };

  //Добавить обработчик события
  function addEvent(elem, type, handler)
  {
     if (elem.addEventListener){elem.addEventListener(type, handler, false)} 
     else { elem.attachEvent("on"+type, handler)}
  }
  //Удалить обработчик события
  function removeEvent(elem, type, handler){
     if (elem.removeEventListener){elem.removeEventListener(type, handler, false)} 
    else { elem.detachEvent("on"+type, handler)}
  }
  
  function set_interval(timer_listener, delay)
  {
    return window.setInterval(timer_listener, delay);
  }
  function clear_intrerval(timer_id)
  {
    clearInterval(timer_id);
  };
 
 //Методы анимации
 var delta = {
    linear:function(progress) 
    {
       return progress;
    },
    back:function(progress, x) { //эффект стрельбы из лука
      return Math.pow(progress, 2) * ((x + 1) * progress - x)
    },
    quad:function(progress, x) { //в степени x
     return Math.pow(progress, x)
    },
    circ:function(progress) { //описывает дугу
    return 1 - Math.sin(Math.acos(progress))
    },
    bounce:function(progress) { //Отскок
      for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (progress >= (7 - 4 * a) / 11) {
          return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2)
        }
      }
    },
    elastic:function(progress, x) { //Упругая анимация
      return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress)
    }    
        
 };

    function makeEaseOut(delta, x) {  // показать эффект в конце анимации (наоборот)
      return function(progress, x) {
        return 1 - delta(1 - progress, x);
      }
    };
 
     function makeEaseInOut(delta, x) { //показать эффект и в начале и в конце анимации
      return function(progress, x) {
        if (progress < .5)
          return delta(2*progress, x) / 2;
        else
          return (2 - delta(2*(1-progress), x)) / 2;
      }
    };
 
 var animate = 
 {
  timer:null, //Указатель на таймер обновления
  storage:[], //Массив объектов которые анимируются 
  add:function(e, type, opts) // e - ссылка на объект, type - тип анимации, opts - опции анимации
  {
    //this.del(type,e);
    var id = e.parent.id_layer + e.name + type;
    
    var cur = this.get_id_anim(id);
    var restart = _boolean(opts.restart, false);
    if( cur != false ) 
    { 
        if (cur.restart) { this.del( type, e ); }        
    };
   // alert(restart);
    //данной анимации еще нет либо она требует перезагрузки
    if( (cur == false) || (restart == true) )
    {
        opts.count = opts.count || 0;
        var revers = _boolean(opts.revers, false);
        if(revers === true) opts.home = 'true';
        var cnt = opts.count;
        if(revers) cnt = cnt * 2;//
        var effect = opts.effect || '';
        var n = this.storage.push(
           {
            id:id,
            obj: e,
            start: new Date, //Время старта анимации
            delta: opts.delta || delta.linear, //Функция определяющяя тип анимации
            dur: opts.dur || 1000, //Длительность одного цикла анимации
            step:  opts.step,
            count: cnt || 0, //Количество циклов анимации, 0 - значит пока не произойдет удаление
            complete: opts.complete || function(){},
            _c: opts._complete || function(){},
            revers: revers,
            home: _boolean(opts.home, true),
            restart: _boolean(opts.restart, true),
            k:     parseFloat(opts.k) || 2, //коэфициент, нужен для различных анимационных эфектов
            _count:0,
            _r: true // признак направление анимации true - вперед, false - обратно        
          })-1;
          
        if(typeof this.storage[n].delta == "string") { this.storage[n].delta = delta[opts.delta] || delta.linear;  }
        
        if(effect.toLowerCase() == 'out')  this.storage[n].delta = makeEaseOut(this.storage[n].delta, this.storage[n].k);
        if(effect.toLowerCase() == 'in_out')  this.storage[n].delta = makeEaseInOut(this.storage[n].delta, this.storage[n].k);
        if (this.timer == null){ this.start(); }
    }
    else{
        //такая анимация уже есть продолжим её с новыми данными
        cur.dur = opts.dur || 1000; //Длительность одного цикла анимации
        //alert('1');
    }
  },
  //вернуть объект анимации по идентификатору id
  get_id_anim:function(id)
  {
    for(var i = 0; i < this.storage.length; i++ )
    {
      if(this.storage[i].id == id) return this.storage[i];  
    }
    return false;
  },
  del:function(type, obj){ //Удалить объект из хранилища. type - тип анимации, obj - объект
 //   var length = this.storage.length;   
    var id = obj.parent.id_layer+obj.name + type; 
    for(var i = 0; i < this.storage.length; i++ )
    {
      if(this.storage[i].id == id){
        if(this.storage[i].home == 'true') { this.storage[i].step(0); this.storage[i]._c(this.storage[i].home); }
        this.storage.splice(i,1);
      }   
    }
  },
  //Удаляет всю анимацию мнемосхемы с id_layer = id
  delete_sheme:function(id)
  {
    var length = this.storage.length;   
    for(var i = 0; i < this.storage.length; i++ )
    {
      if(this.storage[i].obj.parent.id_layer == id) this.storage.splice(i,1);  
    }    
  },
  start:function() //Старт цикла анимации
  {
     this.stop();
     this.timer = set_interval(function(){animate.cycle()}, 10);
  },  
  stop:function(){
    clear_intrerval(this.timer);
    this.timer = null;
  },
  cycle:function() //Общий цикл всех анимаций
  {
    var count = 0;
    var o = this.storage;
    for(var i = 0; i < o.length; i++ )
    {       
      count += 1;
      if ( o[i].obj.display == true) {
        var progress = (new Date - o[i].start) / o[i].dur; 
        if (progress > 1) progress = 1;
        var k = o[i].k;
        if(o[i]._r) //Если направление анимации в перёд
         { 
            o[i].step( o[i].delta(progress, k) ); 
         } //Направление анимации обратно
         else { o[i].step( o[i].delta(1-progress, k) ); }
        
        if(progress == 1) //Если прошел цикл анимации
        {
           o[i]._count += 1; 
           if(o[i].count == o[i]._count) //если анимация закончилась
           {
             //if(o[i].home == 'true') { o[i].step(0); } else o[i].step(1);
             o[i]._c(o[i].home);
             o[i].complete(o[i].obj);
             o.splice(i,1);  //удалим анимацию из хранилища                            
             continue;                    
           }
           else{
            o[i].start = new Date(); 
            if(o[i].revers) { o[i]._r = !o[i]._r; }             
           }
        }
        matrix.set(o[i].obj); //Преобразуем матрицу трансфомаций
      }  
    }  
    if ( count == 0 ) { animate.stop(); }
  }
 };

//Объект для управлением значением цвета
var Tcolor = {
    //Является ли значение цветом
    check:function(v)
    {
        return ( typeof v == "string" && ( v.charAt(0) == '#' || v.indexOf('rgb(') === 0 ) )?true:false;
    },
    hex2r_g_b:function(hex) // 16-тиричный в массив rgb 
    { 
        var m = hex.replace("#","").match(/.{2}/g);
        for (var i in m) m[i] = Number('0x'+m[i]);
        return m;
    },
    rgb2r_g_b:function(rgb) //rgb в массив rgb
    {
       var pars = rgb.indexOf(','); 
       var m = [];
       m[0] = parseInt(rgb.substr(4,pars));
       m[1] = parseInt(rgb.substr(pars+1,rgb.indexOf(',',pars)));
       m[2] = parseInt(rgb.substr(rgb.indexOf(',',pars+1)+1,rgb.indexOf(')')));
       return m;
    },
    r_g_b:function(color) //Любой цвет в массив rgb
    { 
       if(color.charAt(0) == '#'){
         return this.hex2r_g_b(color)
       };
       if(color.indexOf('rgb(') === 0){
         return this.rgb2r_g_b(color);
       } 
    }
};

function clone(o)
{
  var newObj = (o instanceof Array) ? [] : {};  
    for (i in o) {   
        //if (o[i] && typeof o[i] == "object") {  
        //    alert(o[i]);
        //    newObj[i] = clone(o[i]);  
       // } 
       // else 
        newObj[i] = o[i];  
    } 
    return newObj;    
}
function init_animate(obj, type, setup, stop )
{
         var begin = setup.begin || null; //Событие начала анимации    
         var end = setup.end || null;    //Событие конец анимации   
                  
         if(typeof stop != "function") stop = function(){};
         var func_start = function()
         {            
           animate.add(obj, type, setup); 
         };
         var func_stop = function()
         { 
           stop(); 
         };
         if(begin) {
            addEvent(obj.node, begin, func_start);
         }
         else{
            func_start();
         };
         if(end)
         {
            addEvent(obj.node, end, func_stop);
         };     
}

//Объект для управлением анимацией атрибутов
var animate_attr = {
    init:function(attr, setup)
    {
        var obj = setup.obj || null;
        setup.count = setup.count || 1;  
        var end = setup.end || null;    //Событие конец анимации  
        var revers = _boolean(setup.revers);
        for(name in attr)
        {  
         (function(n, f){  
              var to = attr[n] || 1; //Конечное значение анимации  
              setup.home = setup.home || 'false';
              if( Tcolor.check(to) ) //Анимируется цвет
              { 
                to = to.replace(/\s+/g,''); // удаление пробелов
                from = obj.attr(n) || '#000000'; //Начальное значение цвета
                from = from.replace(/\s+/g,''); // удаление пробелов                
                var srgb = Tcolor.r_g_b(from); 
                var frgb = Tcolor.r_g_b(to);
                setup.step = function(progress){                    
                     var sp = 1 - progress;                     
                     R = Math.floor( (srgb[0]) * sp + (frgb[0]) * progress );
                     G = Math.floor( (srgb[1]) * sp + (frgb[1]) * progress );
                     B = Math.floor( (srgb[2]) * sp + (frgb[2]) * progress );                     
                     var o = {}; o[n] = 'rgb('+R+ ',' + G + ',' + B +')'; //'#'+i.toString(16);
                     obj.attr(o);  
                  };                
              }
              else{
                  var from = Number(obj.attr(n)) || 0; 
                  var _to = from; var _from = to;
                  to = to - from;
                  setup.step = function(progress){
                     var i = to * progress + from;
                     var o = {}; o[n] = i;
                     obj.attr(o);  
                  };  
                  if((end != null) && revers)
                  {
                      _to = _to - _from;
                      var stop = function(progress){
                         var i = _to * progress + _from;
                         var o = {}; o[n] = i;
                         obj.attr(o);                     
                      }  
                  }
                  else{
                    var stop = function(){
                        var o = {}; o[n] = from;
                        obj.attr(o);
                    }
                  }             
              };
              if((end != null) && revers) setup.revers = false; //Значит обратный путь анимации сделаем по событию end
              var _setup =  clone(setup);
              _setup.step = stop; 
              if((end != null) && revers) _setup.restart = true;
              init_animate(obj, n, setup, function()
              {
                animate.add(obj, n, _setup); 
              });
          })(name); 
        };
        
    },
    //Узнаёт какой тип отрибута , (число, палитра )
    _type:function(a){
        
    }
};
  
  //Объект для управлением масштабированием объектов
  var scale = function(setup) { 
       var obj = setup.obj || null;
       var from = setup.from || [obj._tr.c[3], obj._tr.c[4]]; //Начальное значение анимации
       var to = ('to' in setup)?setup.to:[2, 2]; //Конечное значение анимации
       var from = getXY(from, 1);
       var to = getXY(to, 1);        
       var accumulate = (setup.accumulate === true)?true:false;
       if(accumulate) {from[0] += obj._tr.c[3]; from[1] += obj._tr.c[4];} 
       to[0] = to[0] - from[0];
       to[1] = to[1] - from[1];
       //alert(to+"="+from);
       setup.step = function(progress)
       {            
            var x = to[0] * progress + from[0]; obj._tr.c[3] = x;  
            var y = to[1] * progress + from[1]; obj._tr.c[4] = y;        
            obj._tr.m[2] = matrix.scale(x, y, obj.centerX, obj.centerY);             
       };  
       setup._complete=function(home)
       {
            if(home){
                var x = from[0]; var y = from[1];
            }
            else{
                var x = to[0] + from[0];  var y = to[1] + from[1]; 
            }           
            obj._tr.m[2] = matrix.scale(x, y, obj.centerX, obj.centerY);             
            matrix.set(obj);         
       }     
       init_animate(obj, 'scale', setup);   
   };
 
 //Перемещение объекта
  var motion = function(setup) {
        var obj  = setup.obj || null;  
        var from = setup.from || 0; //Начальное значение анимации  
        var to   = setup.to || 0; //Конечное значение анимации
        var restart = setup.restart || 'true';  //Перезагрузка анимации          
        var from = getXY(from, from);
        var to = getXY(to, to); 
        var accumulate = (setup.accumulate === true)?true:false;
        
        if(accumulate) { from[0] += obj._tr.c[0]; from[1] += obj._tr.c[1];}
                     
        if(restart == 'true' && !accumulate) obj.motion(false);

        setup.step = function(progress)
        {
          var x = to[0] * progress + from[0]; obj._tr.c[0] = x;
          var y = to[1] * progress + from[1]; obj._tr.c[1] = y; 
          obj._tr.m[0] = matrix.move(x, y);                   
        };  
        setup._complete=function(home)
        {
            if(home){
                var x = from[0]; var y = from[1];
            }
            else{
                var x = to[0] + from[0];  var y = to[1] + from[1]; 
            }           
            obj._tr.m[0] = matrix.move(x, y);             
            matrix.set(obj);    
        }        
       init_animate(obj, 'motion', setup);                      
  };   
   
   //анимация вращения
   var rotate = function (setup)
   {
         var obj = setup.obj || null;    
         var restart = setup.restart || 'true';  //Перезагрузка анимации 
         var rotation = setup.rotation || 'right'; //Направление вращения
             rotation = (rotation == 'right')?true:false; 
         var from = ('from' in setup)?parseInt(setup.from):obj._tr.c[2]; //Начальное значение градуса
         var to = ('to' in setup)?parseInt(setup.to):360; //Конечное значение градуса      
         if(!rotation) { var t = from; from = to; to = t; };
         var rx = setup.rx || obj.centerX;
         var ry = setup.ry || obj.centerY;   
         to = to - from; 
         var accumulate = (setup.accumulate === true)?true:false;
         
         if(accumulate) from += obj._tr.c[2];
         
         if(restart == 'true' && !accumulate) obj.rotate(false); 
          
         setup.step = function(progress)
         {
            var i = to * progress + from; obj._tr.c[2] = i;
            obj._tr.m[1] = matrix.rotate(i, rx, ry);        
         };
         setup._complete=function(home)
         {
            obj._tr.m[1] = matrix.rotate((home)?from:(to+from), rx, ry);             
            matrix.set(obj);     
            if(!home) { obj._tr.c[2] = to+from; } else   obj._tr.c[2] = from;  
         }
         init_animate(obj, 'rotate', setup);         
   };      
  
  //Таймер мерцания объекта
  var flicker_timer = {
      timer:null, //Указатель на таймер обновления
      storage:[], //Массив объектов которые мерцают 
      add:function(e, opts) // e - ссылка на объект, opts - опции мерцания
      {
        var id = e.parent.id_layer+e.name;
        if(id in this.storage) return true;
        var n = this.storage.push(
           {
            id:id,
            obj: e,
            delay: opts.delay || 500, //задержка
            old_attr: opts.old_attr || null,
            attr: opts.attr || null,
            fn:opts.fn || null,
            flic:1,
            time: new Date //Время старта анимации
          })-1;                 
        if (this.timer == null){ this.start(); }
      },
      del:function(obj){ //Удалить объект из хранилища. obj - объект
        var id = obj.parent.id_layer+obj.name; 
        for(var i = 0; i < this.storage.length; i++ )
        {
          if(this.storage[i].id == id) this.storage.splice(i,1);  
        }
      },
      //Удаляет все мерцания мнемосхемы с id_layer = id
      delete_sheme:function(id)
      {
        var length = this.storage.length;   
        for(var i = 0; i < this.storage.length; i++ )
        {
          if(this.storage[i].obj.parent.id_layer == id) this.storage.splice(i,1);  
        }    
      },
      start:function() //Старт цикла мерцания
      {
         this.stop();
         this.timer = set_interval(function(){flicker_timer.cycle()}, 50);
      },  
      stop:function(){
        clear_intrerval(this.timer);
        this.timer = null;
      },
      cycle:function() //Общий цикл всех мерцаний
      {
        var count = 0;
        var o = this.storage;
        for(var i = 0; i < o.length; i++ )
        {       
          count += 1;  
          if(((new Date) - o[i].time ) >= o[i].delay )
          {
                 if(o[i].flic == 1){
                  if(o[i].fn) o[i].fn(o[i].flic);
                  if(o[i].attr) SVG.setAttr(o[i].obj.node, o[i].attr);  
                  if(o[i].fn == null && o[i].attr == null)  o[i].obj.show();
                    o[i].flic = 0;                
                }
                else{
                   if(o[i].fn) o[i].fn(o[i].flic);
                   if(o[i].old_attr) SVG.setAttr(o[i].obj.node, o[i].old_attr);                 
                   if(o[i].fn == null && o[i].attr == null) o[i].obj.hide();
                   o[i].flic = 1;
                } 
             o[i].time = new Date;   
           }         
        }
        if ( count == 0 ) { flicker_timer.stop(); }
      }
  };
  
  
  var matrix = {
    //поворот на угол a
    rotate:function(angle, x, y)
    {
      var cos = Math.cos(angle*Math.PI/180).toPrecision(3);
      var sin = Math.sin(angle*Math.PI/180).toPrecision(3);
      var m1 = [cos, sin, -sin, cos ,x, y];      
      var m2 = [1, 0, 0, 1 ,-x,-y];
      var m =  this.transform(m1, m2);
      return m;    
    },
    //масштабирование с коэффициентами kx и ky и центром rx
    scale:function(kx, ky, rx, ry)
    {
      var m = [kx,0,0,ky,(-rx*(kx-1)).toPrecision(3),(-ry*(ky-1)).toPrecision(3)];              
      return m; 
    },
    move:function(x, y)
    {
       var m = [1,0,0,1,x,y];
       return m;
    },
    //наклон вдоль X на угол a
    skewX:function(a)
    {
      return  [1,0,Math.tg(a).toPrecision(3),1,0,0];
    },  
    //наклон вдоль X на угол a
    skewY:function(a)
    {
      return  [1,Math.tg(a).toPrecision(3),0,1,0,0];
    },
    //Сброс всех преоброзований
    reset:function(){
      return [1,0,0,1,0,0];  
    },
    //Преоброзование двух матриц
    transform:function(s1, s2)
    {
      return [s1[0]*s2[0]+s1[2]*s2[1], s1[1]*s2[0]+s1[3]*s2[1], s1[0]*s2[2]+s1[2]*s2[3], s1[1]*s2[2]+s1[3]*s2[3], s1[0]*s2[4]+s1[2]*s2[5]+s1[4]*1, s1[1]*s2[4]+s1[3]*s2[5]+s1[5]*1];  
    },
    set:function(e)
    {
      var m = [1,0,0,1,0,0];  //Тождественное преобразование 
      var t = e._tr.d;
      //Матрицы по умолчанию
      for(var i in t) if ( t[i]!= false) m = this.transform(m, t[i]);

      var t = e._tr.m;
      //Текущие матрица
      for(var i in t) if ( t[i]!= false) m = this.transform(m, t[i]);

      /*      
      if(e._motion != false) m = e._motion; //Текущая матрица
      if(e.__motion) m = this.transform(m, e.__motion); //Матрица по умолчанию
      
      if(e._rotate != false) m = this.transform(m, e._rotate); 
      if(e.__rotate) m = this.transform(m, e.__rotate); 
       
      if(e._scale != false) m = this.transform(m, e._scale);
      if(e.__scale) m = this.transform(m, e.__scale); 
      */
      e.attr({transform:'matrix('+m.join(",")+')'});                  
    }            
  }
  
 
  //объект для управления мерцаниями елементов
  var flicker = function(e,param) 
  {    
    if(!e || !param) return this.status;     
    this.delay = param.delay || 500; //
    this.status = null;    
    this.old_attr = null;
    this.timer = null; //указатель на таймер
    this.attr = param.attr || null;
    this.obj = e;
    this.fn = param.fn || null;
        
    var value = param.value || '0';   
    value = init_sign(value);
    this.sign = value[0];
    this.val = value[1];
       
    if(this.fn) this.fn = bind(this.fn,e); 
    //Если при включении фликера свои атрибуты то сохраним старые чтобы потом их вернуть обратно
    if(this.attr)  this.old_attr = SVG.getAttr(e.node, this.attr);
    
    //console.log( this.attr );

    //Стартуем фликер
    this.start = function()
    {    
      flicker_timer.add(this.obj, { attr:this.attr, old_attr:this.old_attr, delay:this.delay, fn:this.fn })  
    };
    //Останавливаем фликер
    this.stop = function()
    {
        this.obj.show();
        this.obj.draw();
        flicker_timer.del(this.obj);
    };
    
    this.check = function(){        
        var start = false;
        
        switch (this.sign)
        {
            case '=': if ( e.value() == this.val ) start = true; break;
            case '>': if ( e.value() > this.val ) start = true; break;
            case '<': if ( e.value() < this.val ) start = true; break;
        }
        
        if(this.status != start){
          if(start){ this.start(); } else this.stop();  
        }  
        this.status = start;       
    };
    this.check();
  };
  /****/ 
  
  /*Объект управления индикатором*/
  var indicator = function(e,param) {
    
    if(!e || !param) return this.status; 
    
    this.status = null;    
    this.attr = null;
    this.attr_on = param.attr || null;
    this.caption_on = param.caption || null;
    var value = param.value || '0';   
    value = init_sign(value);
    this.sign = value[0];
    this.val = value[1];
    
    //Если при включении индикатора свои атрибуты то сохраним старые чтобы потом их вернуть обратно
    if(this.attr_on)  this.attr = SVG.getAttr(e.node);
    if(this.caption_on)  this.caption = e.text() || null;
    
    //Индикатор включен
    this.on = function()
    {
        if(this.attr_on) SVG.setAttr(e.node, this.attr_on);
        if(this.caption) { if ('caption' in e) { e.text(this.caption_on); } }
        e.display = true;
        e.show();
    };
    //Индикатор выключен
    this.off = function(){
        if(this.attr_on)
        {
          SVG.removeAttr(e.node, this.attr_on);
          SVG.setAttr(e.node, this.attr);
        }
        else { e.display = false; e.hide(); }
        if(this.caption) { if ('text' in e) e.text(this.caption); }
        
    };
    this.check = function(){        
        var on = false;
        
        switch (this.sign)
        {
            case '=': if ( e.value() == this.val ) on = true; break;
            case '>': if ( e.value() > this.val ) on = true; break;
            case '<': if ( e.value() < this.val ) on = true; break;
        }
                
        if(this.status != on){
          if(on){ this.on(); } else this.off();  
        }  
        this.status = on;       
    };
    this.check();
  };
  
  //Подключение всех входов объекта
  function connection_inputs(e)
  {
    for(var i in _temp_input)
    {
      connect_input(e.get_object(i), e.get_object(_temp_input[i]));  
    }
    _temp_input = {};    
  };
  
  //Подключить объекты друг к другу
  function connect_input(from_object, to_object)
  {
    if((from_object != false)&&(to_object != false))
    {
      to_object.to_inputs.push(from_object);   
    }
    else{
       log("Ошибка соединения объектов");             
    }    
  }

  
 //Конструктор для управления значением
  function value(param, obj)
  {
    var value = param.value || 0;
    var old_value = null;
    var before = param.before || '';    //текст до значение
    var after = param.after || ''; // текст после значения
    //var type  = param.type  || 'int';// тип значения int|float|string|boolean
    
    var type   = ('type' in param)?param.type : (param.input?'s':'int');
    
    var bit   = ('bit' in param)?param.bit : null;// вернуть бит значения
    var max   = ('max' in param)?param.max : null;// верхний парог значения
    var min   = ('min' in param)?param.min : null;// нижний парог значения
    var divisor   = ('divisor' in param)?param.divisor : null;// делитель значения
    var factor   = ('factor' in param)?param.factor : null;// множитель значения
    var precision = param.precision || 1;// кол-во знаков после запятой
    var obj = obj;
    
    if (param.input && obj.name ) { _temp_input[obj.name] = param.input; }

    return function(v)
    {    
        if(v === 0) { set_val(v); return obj; }
        if (!arguments.length) {
        if('get_value' in obj) { return obj.get_value(value);}  else return  value;
        }
        else if(v == '\f'){
            return format();
        }
        else{
           set_val(v); 
           return obj; 
        }  
        function format()
        {
           return before + value + after; 
        }
        //Приводит к задонному типу
        function set_type()
        {
           if(divisor != null) value = value / divisor; //разделить число на делитель
           if(factor != null) value = value * factor;// умножить число
           if(bit == null)
           {       
               switch(type){
                case 'int': value = parseInt(value);  break;
                case 's':break;
                case 'float':value = parseFloat(value);value = value.toFixed(precision); break;
                case 'boolean': value = (value)?true:false; break;
                case 'string':break;
                default: console.log(obj + ' => Не известный формат: '+type); break;
               }       
               if(min !== null){if(value < min ) value = min;}        
               if(max !== null){if(value > max ) value = max;}                             
           }
           else{ //присвоить статус бита
            if(value & Math.pow(2, bit)){ value = 1}else {value = 0;}
           }                
        } 
        function set_val(v)
        {
            value = v;
            set_type();
            if(value != old_value)
            {  
                if (obj.flicker != null) //К объекту привязано управление мерцанием
                {
                  obj.flicker.check();
                }
                if(obj.indicator != null) //К объекту привязан индикатор
                {
                  obj.indicator.check();                  
                }
                obj.change();
                obj.draw();
                old_value = value;
                //если к объекту присосались другие объекты то раздадим им это значение
                if(obj.to_inputs.length > 0) for(var i in  obj.to_inputs) obj.to_inputs[i].value(value);
                if(obj._dynamic.length > 0) { for(var i = 0; i < obj._dynamic.length; i++ ) obj._dynamic[i](value);  }
            }           
        }   
    };
  };
  
  
  var canvas = 
  {
     text:function(style)
     {  
        var e = SVG.create('text', style);
        if(IE) e.appendChild(document.createTextNode(''));  
        return e;                
     }
   };
  
  //Возвращает массив [x,y] из строки "x,y"
  function getXY(val, def)
  {
    if(+val || val === 0)
    {
       return [val,val]; 
    }
    else if(is_array(val)){
       var m = val; 
    }
    else
    {
     var m = (typeof val == "string")?val.split(','):[def, def]; 
    }     
    m[0] = (typeof m[0] != "undefined")?parseFloat(m[0]):def;  
    m[1] = (typeof m[1] != "undefined")?parseFloat(m[1]):def; 
    return m;
  }
  
   //"Абстрактный класс объекта"
   var abstract_elem = function(){
   };
  abstract_elem.prototype = {
       name:null,
       node:null, //Главный узел объекта в DOM
       svg:SVG, //Объект для работы с svg
       change:function(){}, // Срабатывает при изменении значения элемента
       draw:function(){},  // Вывод на холст  
       display:true,  //вывод на экран
       indicator:null, //объект индикатора
       flicker:null,// объект мерцания
       canvas:canvas,
       x:null, y:null, width:null, height:null, //координаты, размеры
       get_object:function(name){ //вернуть ссылку на элемент с названием name
         if ( typeof this.parent.objects[name] != "undefined" ) {return this.parent.objects[name]; } else { log(this.name+" => "+' объект '+name+' не найден'); return false; }
       },      
       show:function(){ if(this.display) this.node.style.display = 'block'; return this; }, //Показать элемент
       hide:function(){ this.node.style.display = 'none'; return this; }, //Скрыть элемент
       //Добовляет объект в свой главный узел
       append_object:function(obj){
         append_object(this.node, obj);
         return this;
       },
       //Добовляет объект svg в свой главный узел
       append:function(node){
         this.node.appendChild(node);
         return this;
       },
       attr:function(attr)
       {
         if(typeof attr == "string") return (typeof this.node.attributes[attr] == "undefined")?null:this.node.attributes[attr].nodeValue;
         this.svg.setAttr(this.node, attr);
         return this;
       },
       /*------------=============Анимация==========-------------------*/
       rotate:function(setup, rx, ry) //Вращение
       { 
          get_scale_object(this); //Узнаем размеры объекта на холсте
          if(typeof setup == "object"){
            if("angle" in setup){
                var rx = ("rx" in setup)?parseInt(setup.rx):this.centerX; 
                var ry = ("ry" in setup)?parseInt(setup.ry):this.centerY;
                setup =  parseInt(setup.angle);
            }
          }
          if(+setup || setup === 0) //Если передано число значит нужно просто повернуть объект на угол setup
          {
             var rx = (typeof rx != "undefined")?parseInt(rx):this.centerX; 
             var ry = (typeof ry != "undefined")?parseInt(ry):this.centerY;
             this._tr.m[1] = matrix.rotate(setup, rx, ry); 
             matrix.set(this);          
          }      
          else if(setup === false){
            animate.del('rotate', this);
          }
          else{
              setup = setup || {};
              setup.obj = this;
              rotate(setup);
          }
          return this;
       },
       scale:function(setup) //масштабирование
       {
         get_scale_object(this); //Узнаем размеры объекта на холсте
         if(+setup || setup === 0 || ( typeof setup == "string") )  //Если передано число значит нужно просто изменить масштаб
         {
            var m = getXY(setup, setup);
            this._tr.d[2] = matrix.scale(m[0], m[1], this.centerX, this.centerY);
            matrix.set(this);
         }
         else if(setup === false){
            animate.del('scale', this);
            this._tr.reset('scale');
            matrix.set(this);  
         }
         else if(typeof setup == "object" ){ //Значит изменение масштаба запрогроммированно
              setup = setup || {};
              setup.obj = this;
              scale(setup);
         }
         return this;
       },
       motion:function(setup)
       {
         get_scale_object(this); //Узнаем размеры объекта на холсте
         if(+setup || setup === 0 || ( typeof setup == "string") )
         {
           var m = getXY(setup, setup);            
           this._tr.d[0] = matrix.move( m[0], m[1] ); 
           matrix.set(this);
         }
         else if(setup === false){//отменить перемещение
           animate.del('motion', this);
           this._tr.reset('motion');
           matrix.set(this);            
         }
         else{
            setup = setup || {};
            setup.obj = this;
            motion(setup);
         }
         return this;
       },
       animate:function(attr, setup, delta)
       {         
         if(+setup || setup === 0){
            setup = {dur:setup};         
            if(typeof delta == "string") { setup.delta = delta;};
            if(typeof setup != "object") setup = {};
         }  
         else{
           var setup = attr;
           var attr = attr.attr || {};
           delete setup['attr'];           
         }     
         setup.obj = this;
         animate_attr.init(attr, setup);

         //console.log( attr );
         //console.log( setup );

         return this;
       },
       /*--------------===========События===========-------------------*/
       click:function(fn){
         this.node.onclick = bind(fn, this); 
         return this; 
       }, 
       mouseover:function(fn){
         this.node.onmouseover = bind(fn, this);
         return this; 
       },
       mouseout:function(fn){
         this.node.onmouseout = bind(fn, this);
         return this; 
       },   
        /*--------------======================-------------------*/        
       style:{}, 
       bind:function(func){
         bind(func, this);
       },    
       add_object:function(param, e) // e - указатель на мнемосхему
       {
         //console.log( e );
         var obj =  create_object(null,param, e);
         this.append_object(obj);
         add_event(obj, param); //Навешали ему событий 
         return obj;
       },
       //Зацепиться за объект obj и получать от него данные
       connect_to:function(obj){
         connect_input(this, obj);
         return this;
       }
       /*
       _curR:0, //текущий градус вращения
       _curMX:0, //текущий сдвиг по X
       _curMY:0, //текущий сдвиг по Y
       _curS:1,
       _motion:false, //текущая матрица анимации
       _scale:false,//
       _rotate:false, //
              
       __motion:false, //матрица перемещения по умолчанию
       __scale:false,//матрица масштаба по умолчанию
       __rotate:false //матрица поворота по умолчанию
      */ 
   }; 
    
   inner_text = function(node, text)
   {
      if(IE){ node.removeChild(node.childNodes[0]); node.appendChild(document.createTextNode(text)); }
       else
       node.innerHTML = text;          
   };    
   //Все обекты управления системы         
   var object = {
     _default:function() { this.node = this.svg.create('g', {});},
     use:function(param, parent)
     {
        this.node = this.svg.create('use', param.attr);
     },
     path:function(param, parent)
     {
         this.node = this.svg.create('path', param.attr);  
     },
     line:function(param, parent)
     {
         this.node = this.svg.create('line', param.attr);  
     }, 
     image:function(param, parent){
        this.node = this.svg.create('image', param.attr);
     },    
     circle:function(param, parent){
        this.node = this.svg.create('circle', param.attr);
     },
     rect:function(param, parent){
        this.node = this.svg.create('rect', param.attr);
     },     
     //Создание текста
     text:function(param, parent)
     {         
        
       this.node = canvas.text(get_param.text(param.attr || {})); 
       var text = param.text || null;
       this.draw = function() 
       { 
          inner_text(this.node, text || this.value('\f'));
       };
       this.text = function(str) { if (!arguments.length) return text;  text = str; this.draw(); };
       if(text) inner_text(this.node, text);
     },
     //Текст в рамке
     label:function(param, parent)
     {
        var attr = param.attr || {}; 
        var background = attr.background || {};
        var caption = attr.caption || {};
        this.node = this.svg.create('g', {'cursor':'pointer',fill:background.fill,title:attr.title || ''});
        background.x = attr.x || 0; 
        background.y = attr.y || 0; 
        background.height = attr.height  || 0; 
        background.width = attr.width  || 0; 
        //delete background.fill;
        var text = param.caption || 0;
        var rect = this.svg.create('rect', background || {});
        SVG.removeAttr(rect,{fill:''});
        caption['text-anchor'] = 'middle'; //Выравнивание по середине
        caption = canvas.text(get_param.text(caption || {}));
        this.node.appendChild(rect);
        this.node.appendChild(caption);
        if( !caption.style.fontSize ) caption.style.fontSize = '14px';
       //Устанавливает координаты текста
        var set_cor_text = function()
        {
         var x = Number(rect.getAttribute("x")) + Number(rect.getAttribute("width")/2);
         var y = Number(rect.getAttribute("y")) + Number(rect.getAttribute("height")/2) + parseInt(caption.style.fontSize)/3;
         caption.setAttribute("x", x);
         caption.setAttribute("y", y);
        };
        
       this.draw = function() { set_cor_text(); inner_text(caption, text || this.value('\f'));};
       
       this.text = function(str) { if (!arguments.length) return text;  text = str; this.draw(); };
       this.color = function(color){ SVG.setAttr(caption, {fill:color}); };
       this.fon = function(fill) { SVG.setAttr(rect, {'fill':fill}); };               
       if(text) { set_cor_text(); inner_text(caption, text); };
     },
     track:function(param)
     {
        
         var attr = param.attr || {};
         var path = "M "+ attr.x+" "+attr.y;
         var H = attr.width || null;
         var napr = null;
         var R = 0;
         var r = 0;         
         if(attr.round_corners){ if(H){ R = H*2;} else { R = parseInt(attr.round_corners); } r = R/2; }
         var type_angle;
         
         var get_h = function get_h(d, m1, m2)
         {
           var h = 0; 
           var f = 1.5;
           if(!m1) { m1 = new Array(null); f = 1}
           if(!m2) { m2 = new Array(null); f = 1}
           switch (d)
           {           
             case 'd': if(m1[0] == 'l') h+=H; if(m1[0] == 'r') h-=H; if(m2[0] == 'r') h+=H;  if(m2[0] == 'l') h-=H;   break;
             case 'l': if(m1[0] == 'd') h-=H; if(m1[0] == 'u') h+=H; if(m2[0] == 'd') h+=H;  if(m2[0] == 'u') h-=H;   break;
             case 'u': if(m1[0] == 'r') h+=H; if(m1[0] == 'l') h-=H; if(m2[0] == 'l') h+=H;  if(m2[0] == 'r') h-=H;   break;
             case 'r': if(m1[0] == 'u') h-=H; if(m1[0] == 'd') h+=H; if(m2[0] == 'u') h+=H;  if(m2[0] == 'd') h-=H;   break;
           };
          return h;
         };        
         // Определяет тип угла ( true - внешний, false - внутренний )
         var get_angle = function (n1,n2,inv)
         {
           if(R)
           {
                if(n2 && n1){
                  n1=n1[0]; n2=n2[0]; var mas = new Array; 
                  if(!inv)
                  {
                      if(n1 == 'd' && n2 == 'r') { mas = [0,R,R,R]; type_angle = 'n';  };
                      if(n1 == 'd' && n2 == 'l') { mas = [0,r,-r,r]; type_angle = 'v';  };
                      if(n1 == 'r' && n2 == 'd') { mas = [r,0,r,r]; type_angle = 'v';};
                      if(n1 == 'r' && n2 == 'u') { mas = [R,0,R,-R]; type_angle = 'n';};
                      if(n1 == 'u' && n2 == 'r') { mas = [0,-r,r,-r]; type_angle = 'v';};
                      if(n1 == 'u' && n2 == 'l') { mas = [0,-R,-R,-R]; type_angle = 'n';};
                      if(n1 == 'l' && n2 == 'd') { mas = [-R,0,-R,R]; type_angle = 'n';};
                      if(n1 == 'l' && n2 == 'u') { mas = [-r,0,-r,-r]; type_angle = 'v';};
                  }
                  else{
                      if(n1 == 'd' && n2 == 'r') {mas = [-r,0,-r,-r]; type_angle = 'v';} 
                      if(n1 == 'd' && n2 == 'l') {mas = [R,0,R,-R]; type_angle = 'n';};                     
                      if(n1 == 'l' && n2 == 'd') {mas = [0,-r,r,-r]; type_angle = 'v';};
                      if(n1 == 'l' && n2 == 'u') {mas = [0,R,R,R]; type_angle = 'n';};                      
                      if(n1 == 'r' && n2 == 'd') {mas = [0,-R,-R,-R]; type_angle = 'n';} 
                      if(n1 == 'r' && n2 == 'u'){ mas = [0,r,-r,r]; type_angle = 'v'; } 
                      if(n1 == 'u' && n2 == 'r') { mas = [-R,0,-R,R]; type_angle = 'n';}
                      if(n1 == 'u' && n2 == 'l') { mas = [r,0,r,r]; type_angle = 'v';}                      
                  }
                  return 'q '+mas.join(" ");
                }
                else{
                   //Значит конец трубы 
                }
            }
            return '';
         };
         
         for(var i = 0; i < attr.line.length; i++)
         {
            var an = get_angle(attr.line[i], attr.line[i+1], false); //Находим угол          
            var L = Number(attr.line[i][1]) - (type_angle=='n'?R:r);             
            attr.line[i][1] = L;           
            switch (attr.line[i][0])
            {
                case 'u': path += ' v' + (L*-1); napr='u'; break;
                case 'r': path += ' h'+ L; napr='r';break;
                case 'd': path += ' v' + L; napr='d';break;
                case 'l': path += ' h'+ (L*-1); napr='l';break;
            }   
              path += an;     
         };
         if(H)
         {
             attr.line.reverse();         
             switch (napr)
             {
               case 'l': path += ' l 0 '+H; break; 
               case 'r': path += 'l 0 '+(H*-1); break; 
               case 'u': path += 'l '+(H*-1)+' 0'; break; 
               case 'd': path += 'l '+H+' 0'; break; 
                
             }        
             for(var i = 0; i < attr.line.length; i++)
             {
                var an = get_angle(attr.line[i+1],attr.line[i],true);
                var L = Number(attr.line[i][1]); 
                if(!R) L += Number(get_h(attr.line[i][0], attr.line[i-1], attr.line[i+1]));
                switch (attr.line[i][0])
                {
                    case 'd': path += ' v' + (L*-1) ; break;
                    case 'l': path += ' h'+ L; break;
                    case 'u': path += ' v' + L; break;
                    case 'r': path += ' h'+ (L*-1); break;
                }  
               path += an;           
             }                  
             path += ' Z';   
         };            
         delete attr.line; delete attr.x; delete attr.y; delete attr.round_corners; delete attr.width;
         attr.d = path;           
         this.node = this.svg.create('path', attr);        
     },
     scale:function(param, parent)
     {
         var attr = param.attr || {};
         var scale = attr.scale || {'fill':'black'}; //цвет шкалы  
         var background = attr.background || {'fill':'white', 'stroke':'black'}; //цвет фона     
         var label = attr.caption || null;
         var mark  = attr.mark  || 'vertical';
         var x = background.x = attr.x || 0; 
         var y = background.y = attr.y || 0; 
         var height = background.height = attr.height || 0; 
         var width = background.width = attr.width || 0;  
         this.node  = this.svg.create('g', {});
         background  = this.svg.create('rect', background);
         scale       = this.svg.create('rect', scale);
         this.node.appendChild(background);
         this.node.appendChild(scale);
         var before, after = '';
         if(label)
         {
            var label_x = 0; var label_y = 0;
            if(typeof label != "object") label = {};
            before = label.before || ''; delete label.before;
            after = label.after || ''; delete label.after;
            label['text-anchor'] = 'middle'; //Выравнивание по середине
            if(!('x' in label)) { label_x = Number(x) + (width/2); } else label_x += x;
            if(!('y' in label)) { label_y = Number(y) + (height/2); if(mark == 'horizontal')  label_y += (height/4);   } else label_y += y; 
            label = canvas.text(get_param.text(label));
            SVG.setAttr(label,{x:label_x, y:label_y});
            this.node.appendChild(label);
         };
         var max = attr.max || 1;
         var min = attr.min || 0;
       var K = background.getAttribute("stroke-width") || 1;  
           K = K / 2;
           var _x = x + K;
       this.draw = function()
       {       
          var v = this.value();
          if(v > max) v = max;
          if(v < min) v = min;
          if(min<0) {
                v = Number(max)+Number(v);
                var _max = max + (min*-1);
                }  
                else{
                    var _max = max;
                }    
              var p = Math.round((v/_max)*100); // получаем процент         
    
              if(mark == 'horizontal'){
                var h = Math.round( p/100* width ); //высота шкалы
                var _y = y + K; var _w = h - K * 2; var _h = height - K *2;
                if(_w <=0) _w = 0.1;                 
              }
              else{
                var h = Math.round( p/100 * height ); //высота шкалы      
                var pos = y + height - h;            
                var _y = pos + K/2; var _w = width - K * 2; var _h = h - K; 
                if(_h <=0) _h = 0.1;
              }   
             
             scale.setAttribute("x", _x);
             scale.setAttribute("y", _y); 
             scale.setAttribute("width", _w); 
             scale.setAttribute("height", _h);    
             if(label) inner_text(label, before+this.value()+after);    
        }  
     },
     //Задвижка, заслонка, клапан и тд. (картинка)
     flap:function(param, parent)
     {
       var attr = param.attr || {}; 
       var path = param.path || '';
       var input = param.input || null; // от кого берем занчение для передачи его объектам которые прицепятся к задвижке
       
       this.node  = this.svg.create('image', param.attr || {}); 
       this.image = function(name){
         SVG.setAttr(this.node, {href:path+name});
       };
       this.state = 0;
       this.get_value = function(v){
         this.state = v;
         if(v > 0) { if(input) return this.get_object(input).value(); } else return 0;
       };                
     }
   };
 /*Функции для работы с детьми*/
 
 /*Создать ребёнка с идентификатором id и данными data*/  
 function create_child(obj, e)
 {
    var _old_id = obj.box || null;
    var uid = new Date();
    var id = obj.box || uid.getTime();
    id = 'child_'+ id;
    if(id in e.children) {
         e.children[id].window.jolt();
         return;
    }
    obj.box = id;
    obj.data_parent = (obj.data_parent == false )?false:true;
    var w = obj.style.width+'px'; 
    var w_m = null;       
    var body = '<div id="'+id+'" style="position: relative;margin:0;width:'+w+'; border: solid 1px black;"></div>';   
    var WM = winModal.create( {w:w_m, position:'absolute', onClose:function(){ new_child.remove();  }, fon:'false'} );
    WM.html(body); 
    var new_child = new $$(obj, e);
    new_child.scheme = 'child'; //Признак дочерней схемы
    e.children[id]={
        obj: new_child, //объект ребёнка
        window: WM, //объект модального окна ребенка
        data_parent:(obj.data_parent == false )?false:true, //Признак того что дитя будет получать данные от родителя       
    };
    obj.box = _old_id;
    if(obj.data_parent != false) {
        
        rec_data_object(id, new_child.points);
      
    }
    return new_child;           
 };

 var points = {}; //все внешние точки схемы
 var connection = {}; //массив объектов получающие данные из внешних точек
 var array_connection = {}; //массив объектов получающие данные из нескольких внешних точек
 var array_input = {}; //массив объектов получающие данные из нескольких объектов
 //Настройка внешних точек
 function create_points(id, p)
 {
    points[id] = {};
    var n = points[id];
    for(var i in p)
    {
      n[i] = {value:0, name:p[i]}; 
    }
 }
 //Запись новых данных в схему с идентификатором id
 function new_data(id, e)
 {
   // var a = Date.now();
    var p = points[id];
    //console.log(p);
    //Запишем в локальные точки
    for(var i in p)
    {
        if(p[i].name in e) p[i].value = e[p[i].name];
    };
    
   rec_data_object(id, p);
   
  // var b = Date.now();
  // var res = b - a; 
  // log("new_data: "+res+" ms");  
 }
 
 //Запись данных в объекты из точек p
 function rec_data_object(id, p)
 {

    //console.log( array_connection );

    var o = connection[id];
    //Запишем в объекты
    for(var i = 0; i<o.length; i++) o[i].value(p[o[i].connect].value);
    
    var o = array_connection[id];
    for(var i = 0; i<o.length; i++) {
        var arr = [];        
        for(var j=0; j<o[i].arr.length; j++) {  arr.push(p[o[i].arr[j]].value);}        
        o[i].obj.change_array(arr);
    };
    
    var input = array_input[id];
    for(var i = 0; i<input.length; i++) {
        var arr = [];        
        for(var j=0; j<input[i].arr.length; j++) { arr.push(input[i].arr[j].value());}        
        input[i].obj.change_array_input(arr);
    };    
 }
 
 
 //Установка соединений объектов с точками
 function create_connection(id, objects, point)
 {
    function get_arr_obj(arr)
    {
      var mas = [];  
      for(var j = 0; j<arr.length; j++)
      {
         if(arr[j] in objects){
            mas.push(objects[arr[j]]); 
         }
         else log('create_connection->get_arr_obj (не найден объект): '+arr[j]);               
      }
      return mas;        
    };
    
    connection[id] = [];
    array_connection[id] = [];
    array_input[id] = [];
    var a = array_connection[id];
    var o = connection[id];
    var input = array_input[id];
    for(var i in objects)
    {
       if(typeof objects[i].connect != "undefined") {
        
         if (objects[i].connect in point){
            o.push(objects[i]);
         }
         else log(objects[i].name + ' => Ошибка установки соединения: '+objects[i].connect);
       };
       //если задан массив точек
       if(typeof objects[i].array_connect != "undefined") 
       {
            a.push({
               obj:objects[i],
               arr:objects[i].array_connect.slice() //копируем массив
            });

           // console.log( a );
       };
       //если задан массив входов от объектов
       if(typeof objects[i].array_input != "undefined") 
       {
            input.push({
               obj:objects[i],
               arr:get_arr_obj(objects[i].array_input)
            });
       };             
    }
 };
  
 function init_dynamic(obj)
 {
    if('dynamic' in obj)
    {
        for(var i in obj.dynamic)
        {  
          for(var j = 0; j < obj.dynamic[i].settings.length; j++)  
          {
            var arr = init_sign(obj.dynamic[i].settings[j][0]);
            obj.dynamic[i].settings[j][2] = arr[0];
            obj.dynamic[i].settings[j][0] = arr[1];
          };     
            obj._dynamic.push(
               function(method){
                 var set = obj.dynamic[i].settings;
                 return function(v){                
                    for(var j = 0; j < set.length; j++)
                    {
                        var value = null;
                        switch (set[j][2]){
                            case '=': if ( v == set[j][0] ) value = set[j][1]; break;
                            case '>': if ( v > set[j][0] ) value = set[j][1]; break;
                            case '<': if ( v < set[j][0] ) value = set[j][1]; break;
                        }
                        if(value) 
                        {
                           if(method in obj) 
                           {
                            obj[method](value); return;
                           }
                           else{
                            var n_o = {};
                            n_o[method] = value;
                            SVG.setAttr(obj.node, n_o); return;
                           }
                        }
                    }                
                 }
               }(i)
              );  
        }
       for(var i = 0; i < obj._dynamic.length; i++ ) obj._dynamic[i](obj.value());         
    }
 };
 
 
 var lighthouse = function(e) {
    this.parent = e;
    this.msg = '';
    this.obj = SVG.create('circle',{fill:'r-white-gray',cx:20,cy:20,r:10,cursor:'pointer'});
    this.obj.onclick = bind(function(){alert(this.msg)},this);
    this.parent.ctx.appendChild(this.obj);
    

    this.text_status = SVG.create_text(this, {x: 50, y:20, fill:'red'}, '');
    this.parent.ctx.appendChild(this.text_status);

    this.set_color = function(color)
    {
       SVG.setAttr(this.obj, {fill:color}); 
    };
    this.blink = function(color)
    {
      this.set_color(color);
      window.setTimeout( bind(function(){this.set_color('r-white-gray')},this)  , 200 );  
    };
    this.message = function(msg, type)
    {

        var color = 'yellow';
        if( type == 0 )
        {
            color = 'yellow';
        }
        else if( type == 1 )
        {
            color = 'red';
        }
        else if( type == 10)
        {
            color = '#00FF00';
        }

        this.msg = msg;
        inner_text(this.text_status, msg);
        SVG.setAttr( this.text_status, { fill:color } );
    };
 };
  
  //Установить масштаб мнемосхемы
  function set_scale(layer, svg)
  {
    var parent = layer.parentNode;

   // layer.style.width = parent.offsetWidth + 'px';
   // layer.style.height = parent.offsetHeight + 'px';
    svg.style.width = '100%';
    svg.style.height = '100%';
    
  }
  
/*----------------*/
   var $$ = function (project, p) { return new $$.svg_ap.init(project, p); };            
   $$.svg_ap = {
       init:function(project, p)
       {
         this.objects = {};
         this.light = project.light || null;  //маяк
         this.id_layer = project.box; // Можно даже сказать идентификатор мнемо схемы
         this.layer = $(project.box); // объект в котором находится svg      
         
         var a = project.style || {width:'500', height:'500', fill:'white', stroke:'white' } 
         
         this.ctx = SVG.create('svg', {width:a.width, height:a.height, preserveAspectRatio:"none", transform:'scale(1)'}); 
         var ar = new Array(0, 0, Number(a.width), Number(a.height));
         set_view_box(ar, this);
         
        set_scale(this.layer, this.ctx);
         
         if(typeof p == "object") //Схема потомок
         {
            this.defs = p.defs;           
            this.parent = p;
         }
         else{ //Схема главная
             this.defs = SVG.create('defs',{});
             this.ctx.appendChild(this.defs);
         }
         
         SVG.defs = this.defs;
         this.svg = SVG;
         
         var fon = SVG.create('rect', a);
         this.ctx.appendChild(fon);
         this.layer.appendChild(this.ctx);
         
         //Зарегистрируем классы
         this['class'] = project['class'] || {};
         
         if(typeof project.drawing == "object" )
         {
           //Рисование графики на холсте
           drawing(project.drawing, this);
         };
         
        // console.timeEnd('test');
                  
         create_objects(project.objects, this); //создадим все объекты
         connection_inputs(this); //Соединим привязанные объекты
         //Массив с детьми
         this.children = {};  
         this.load_data_timer = null; //Указатель на таймер обновления данных   
         this.coordinates = canvas.text({x:a.width-50,y:a.height-7,'font-size':'12px',fill:'yellow'});
         this.ctx.appendChild(this.coordinates);  
         
         addEvent(this.ctx,'mousemove', bind(function(e){
           var offset = getOffset(this.layer); 
           var X = e.clientX - offset.left;
           var Y = e.clientY - offset.top;       
           inner_text(this.coordinates, X+":"+Y);              
         },this));
         
           /*Удаляет мнемо - схему, и все дочерние схемы рекурсивно*/
         this.remove = function()
         {
             clear_intrerval(this.load_data_timer);
             if('disconnect' in this.websocket) {this.websocket.disconnect(); }
             animate.delete_sheme(this.id_layer);
             flicker_timer.delete_sheme(this.id_layer);
             delete points[this.id_layer];
             delete connection[this.id_layer];
             for(var i in this.children )
             {
                this.children[i].obj.remove();
                this.children[i].window.close();
             }
             this.children = {};
             //Если родитель это главноя мнемосхема
             if(this.parent.scheme !== 'child') { delete this.parent.children[this.id_layer]; }
          }; 
       
         if(project.data_parent == true) 
         {
           //Если родитель это главноя мнемосхема 
           if(p.scheme !== 'child') {
             this.points = points[p.id_layer];
           }
           else{
             this.points = p.points;
           }
           create_connection(this.id_layer, this.objects, this.points);
         }
         else{          
             //настроим точки входа данных в схему 
             create_points(this.id_layer, project.points || []); 
             //Соединим точки с объектами
             create_connection(this.id_layer, this.objects, points[this.id_layer]);
         }
         
         if(project.lighthouse) {
            this.lighthouse = new lighthouse(this);
         }
         else{ this.lighthouse = false; }; 
         
         //переданы данные для соединения с сервером через websocket
         if( typeof project.websocket == 'object') this.websocket(project.websocket);
         
         this.create_child = function(obj)
         {
           return create_child(obj, this);
         };
         return this;
       },
        /*Спрятать всех детей*/
       hide_child:function()
       {
         for ( var i in this.children ) { this.children[i].obj.hide(); this.children[i].window.hide(); }
       },
       /*Отобразить всех детей*/
       show_child:function()
       {
         for ( var i in this.children ) { this.children[i].obj.show(); this.children[i].window.show(); }
       },
       /*Спрятать схему*/
       hide:function()
       {
         this.layer.style.display = 'none';
         this.hide_child();
       },
        /*Отобразить схему*/
       show:function()
       {
         this.layer.style.display = 'block';
         this.show_child();
       },
       /*Запуск мнемосхемы*/
       start:function()
       {
         animate.start();
         flicker_timer.start();
         if('start' in this.websocket) this.websocket.start();
         for ( var i in this.children ) this.children[i].obj.start(); 
       },
       /*Остановка мнемосхемы (анимация обновление данных и тд.)*/
       stop:function()
       {
         animate.stop();
         flicker_timer.stop();
         if('stop' in this.websocket) this.websocket.stop();
         for ( var i in this.children ) this.children[i].obj.stop();
       },
       /*Загрузка новых данных в проект*/
       new_data:function(e)
       {  
        if(this.lighthouse != false) this.lighthouse.blink('r-white-lime');
        this.last_data = e; //сохраним последний пришедший пакет
        new_data(this.id_layer, e); 
        this.give_value_children(e);
       },
       //Раздаёт значения от родителя детям если они в них нуждаются
       give_value_children:function(e)
       {
         for (var i in this.children)
         {
           if ( this.children[i].data_parent == true )
           {
              rec_data_object(i, this.children[i].obj.points);
           }
         }
       },
       //Новый объект на холсте
       new_object:function(name, attr)
       {                       
         var o = add_object(name, attr, this); 
         if(o) connection_inputs(this);
         return o;                           
       },
       //Создание нового объекта
       create_object:function(attr)
       {
         return create_object(null, attr, this);
       },
       obj:function(attr)
       {
         if(typeof attr == "string" ) { attr = {type:attr}; };
         var o = add_object(null, attr, this); 
         if(o) connection_inputs(this);
         return o; 
       },
       //Добовляет объект svg на холст
       append:function(node)
       {
        // append(SVG.ctx, obj);
        this.ctx.appendChild(node);
       },
       //Создать шаблон для заливки
       pattern:function(attr, draw)
       {
         SVG.create_pattern(attr, draw);
       },
       //Добовляет новый конструктор объектов
       new_constructor:function(obj){       
        for(name in obj)
        {
            if(name in object){
                log('Объект '+name+' перезаписан');
            }
            object[name] = obj[name];    
            extend(object[name], abstract_elem);        
        }
       }, 
       get_param: get_param,
       load_data:function(setup)
       {
         var load = setup.load || function(){}; //Функция для загрузки данных
         var interval = setup.interval || 1000; //интервал
         clear_intrerval(this.load_data_timer );        
         this.load_data_timer = set_interval(bind(load, this), interval);         
       },
       //Соединение с сервером через веб сокет
       websocket:function(setup)
       {
          setup.obj = this;
          this.websocket = new websocket(setup);
         // this.websocket.connect();
       },
       get_object:function(id){ //ссылка на элемент с названием id
         if ( typeof this.objects[id] != "undefined" ) {return this.objects[id]; } else { log("get_object => "+' объект '+id+' не найден'); return false }
       },      

       calcPercent:function(num, percentage) {  
            const result = num * (percentage / 100);  
            return parseFloat(result.toFixed(2));  
        },

        get_bit:function(value, bit)
        {
            return (value & Math.pow(2, bit))?1:0;
            //return (value & (1 << bit)) !== 0; 
        },

       temp:function()
       {
        
         var str = '';
         for(var i in animate.storage)
         {
            str+=animate.storage[i].id+" => "+animate.storage[i].dur + "\r\n";
         }
         alert(str);       
       }                  
   };


  //Встроенный объект для получения данных через технологию websocket
  function websocket(setup)
  {
    
    this.obj = setup.obj;
    this.ip  = setup.ip;
    this.cmd_send = setup.cmd_send || ''; //Команда для отправки на сервер
    this.cmd_disconnect = setup.cmd_disconnect || null; 
    this.command = setup.command || '';
    this.data_consol = true, //Вывод считынных данных с сокета в консоль
    this.ws = null,
    this.server = 'ws://'+this.ip;
    this.connect = function(func_on_open)
    {    
       if (window.WebSocket)
       { 

            if( !document.getElementById(this.obj.id_layer) )
            {
                return false;
            }

            this.ws = new WebSocket(this.server);   
            this.obj.lighthouse.message('Подключение к серверу '+this.server+'...', 0);
            func_on_open = func_on_open || function(){};
            this.ws.onopen = bind(function() 
                 { 
                   this.obj.lighthouse.message('Соединение установлено: '+this.server, 10); 
                   log('Установлено соединение с сервером => '+this.server); 
                   this.ws.send(this.cmd_send+"\r\n");
                   func_on_open();
                 },this);
            
            this.ws.onclose = bind(function(event) 
            { 
              if (event.wasClean){  
                log('Закрыто соединение с сервером => '+this.server); 
                this.obj.lighthouse.message('Закрыто соединение с сервером => '+this.server, 1);
                this.obj.lighthouse.blink('r-white-red');
                }
                else
                {                
                    this.obj.lighthouse.message('Обрыв соединения. Код: ' + event.code, 1);
                    log('Обрыв соединения'); // например, "убит" процесс сервера
                    log('Код: ' + event.code + ' причина: ' + event.reason);
                    if( document.getElementById(this.obj.id_layer) )
                    {
                        setTimeout(()=>{ this.connect(); this.obj.lighthouse.blink('r-white-red'); }, 2000);
                    }
                    
                }
            },this);   
                
            this.ws.onerror  = bind( function(error) { log("Ошибка " + error.message); }, this);
            
            this.ws.onmessage = bind(function(event) 
            { 

                if( document.getElementById(this.obj.id_layer) )
                {
                    if(event.data != 'ok')
                    {
                       data = JSON.parse(event.data); 
                       this.obj.new_data(data['var']);
                      
                    }
                }
                else
                {
                    this.disconnect();
                }

             }, this);
        }
        //return this.enabled;
    },
    this.disconnect = function()
    {
       if(this.cmd_disconnect) this.ws.send(this.cmd_disconnect); 
       this.ws.close();
    },
    this.stop = function()
    {
        this.ws.send('subscription off'+"\r\n"); 
    },
    this.start = function()
    {
        this.ws.send('subscription'+"\r\n"); 
    },
    this.send = function(str){
       this.ws.send(str); 
    }
  };
  /*=============-------------===============*/
    
    function extend(Child, Parent) {
        var F = function() { };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.superclass = Parent.prototype;
    }

      
   function __extend()
   {
     var F = function() { };
     F.prototype = abstract_elem.prototype;    
     for(var i in object)
     {
        object[i].prototype = new F();
        object[i].prototype.constructor = object[i];   
        object[i].superclass = abstract_elem.prototype; 
     };      
   };   
    __extend();    
    $$.svg_ap.init.prototype = $$.svg_ap;
    window.svg_ap = $$;
})();




