(function($){
    
  var constructor = {

    conus:function( param, e )
    {
      this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
      e.append(this.node); 

          var x = param.attr.x || 0;
          var y = param.attr.y || 0;
          var width = param.attr.width || 100;
          var height = param.attr.height || 70;          
          var togle1 = [x, x + height] ;         
          var factor = param.factor || 35;  
          var corners = [[x,y], [Number(x + width), y], [Number(x + width), Number(y+height)], [x, Number(y+height)] ];

          var title = param.title || null;

        var _color = param.color || '004184';
          _color=_color.replace(/#/,''); 

         var points = corners[3].join(' ')+',';                  
             points += corners[2].join(' ')+',';                       
             points += Number(x + width - (width/factor)) + ' ' + Number((y + height) + (height / factor) ) + ',';                      
             points += Number(x + (width/factor)) + ' ' + Number((y + height) + (height / factor) ) + ',';
             //end = this.svg.create('polygon', { points:points} );
            //'100 200,200 200,180 220,120 220'
             var points = x+' '+y+','; 
                 points += (x + width)+ ' ' + y +',';
                 points += Number(x + (width-factor)) + ' ' + ( y + height ) + ',';
                 points += (x + factor) + ' ' + ( y + height )


             end = this.svg.create('polygon', { points:points} );
             this.append(end);

            if( title )
              {
                 title = title.split('&');

                var node_title = this.svg.create('g', {fill:'none' });                   

                var txt_title = this.svg.create('text', {
                   x:x,
                   y:y,
                   fill:'white',style:'font-size:14px; font-weight:bold',
                   'text-anchor':'middle'
                 });

                 let _x = x + ( width / 2 );
                 let _y = y;

                 for (var i in title) 
                 {
                   let tspan = this.svg.create('tspan', {x:_x,dy:'1.3em'});
                   tspan.appendChild(document.createTextNode(title[i].trim()));
                   txt_title.appendChild( tspan );
                 }


                 txt_title.setAttribute("x", _x);
                 txt_title.setAttribute("y", _y);

                 node_title.appendChild( txt_title );

                 this.append(node_title);
              }

          function get_color(color)
          {
            var c = parseInt(color,16)+2698273;
            return 'right-black:15-#'+color+':40-#'+c.toString(16)+':70-#'+color;
          }

          
             this.svg.setAttr(end,{fill:get_color( _color )}); 
          

    },

  transport_line:function(param,e)
    {
      this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
      e.append(this.node); 

      var xo = param.attr.x || 0;
      var yo = param.attr.y || 0;  
      var width = param.attr.width || 300;
      var height = param.attr.height || 20;
      var caption = param.caption || {};
      var on_array_connect = param.on_array_connect || function(){};

      this.e = e;

      this.conveier = this.add_object({
        type:'rect',
        value:{bit:0},
        attr:{
         x:xo, y:yo, width:width, height:height,
         fill:'gray',
         stroke:'black',
         'stroke-dasharray': '7,7',
         rx:"10", 
        }, 
       dynamic:{ fill:{ settings:[ ['0', 'gray'],['1','#207B74'] ] } },
       flicker:{value:'=1',delay:700, attr:{ 'stroke-dashoffset': '7' }}        
      }, e);

      this.append_object( this.conveier );

      let caption_percent = caption.percent || 80;

      caption = e.create_object({
            type:'label', 
            value:{
                type:caption.type || 'float',
                precision:caption.precision || 2,
                after:caption.after || '', 
                before:caption.before || '', 
            },
            attr:{
                x:xo + ( width - e.calcPercent( width, caption_percent ) ) /2,
                y:yo+2,
                width:e.calcPercent( width, caption_percent ), 
                height:height - 4,
                caption:{
                    style:'font-weight:bold',
                    fill:'white',
                }, 
                background:{fill:'#9457EB',stroke:'white','stroke-width':1}    
            },
      });

      this.append_object( caption );

          this.rezhim = e.create_object({
            type:'label', 
            value:{bit:0}, 
            attr:{
                x:xo + (width / 2) - 8,
                y:yo - height + 10,
                width:15, 
                height:15,
                caption:{
                    style:'font-weight:bold',
                    fill:'white',
                }, 
                background:{fill:'lime',stroke:'white','stroke-width':2}    
            },
            caption:'Р',
            dynamic:{ 
                 fon:{settings:[['0','red'],['1','lime']]},
                 text:{settings:[['0','Р'],['1','А']]},
            },
        });

      this.append_object( this.rezhim );

      this.indicator_err = this.add_object({
            type:'circle',
            value:{bit:0},
            attr:{
                cx:xo + width - 10,
                cy:yo + height / 2,
                fill:'r-white-red',
                r:10,cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);


      this.change_array = function( arr )
      {
         if( caption )
         {
              caption.value( arr[0] ); //Скорость
         }

         on_array_connect( this, arr );

      }
    },

    /** */
    tank:function(param, e)
    {        
          this.node = this.svg.create('g',param.attr);
          e.append(this.node);
          
          var caption = param.caption || false;

          var x = param.attr.x || 0;
          var y = param.attr.y || 0;
          var width = param.attr.width || 100;
          var height = param.attr.height || 100;          
          var togle1 = [x, x + height] ;         
          var factor = 5;          
          var end = null;
          var title = param.title || null;
          var _color = param.color || '004184';
          _color=_color.replace(/#/,''); 
          var level = param.level || null;
          delete param.color;
          var corners = [[x,y], [Number(x + width), y], [Number(x + width), Number(y+height)], [x, Number(y+height)] ];
          
          var on_array_connect = param.on_array_connect || function(){};

          this.end_cone = function() //Îêîí÷àíèå êîíóñíîå ïðÿìîóãîëüíîå
          {
             var points = corners[3].join(' ')+',';                  
                 points += corners[2].join(' ')+',';                       
                 points += Number(x + width - (width/factor)) + ' ' + Number((y + height) + (height / factor) ) + ',';                      
                 points += Number(x + (width/factor)) + ' ' + Number((y + height) + (height / factor) ) + ',';
                 end = this.svg.create('polygon', { points:points} );
                 this.append(end);
          }
          var rect = this.svg.create('rect', {x:x, y:y, width:width, height:height } );    
          this.append(rect);      
          if(param.cone == true) this.end_cone();         
          
          function get_color(color)
          {
            var c = parseInt(color,16)+2698273;
            return 'right-black:15-#'+color+':40-#'+c.toString(16)+':70-#'+color
          }
          
          this.color = function(c)
          {
            this.svg.setAttr(rect,{fill:get_color(c)});
            if(end != null) { this.svg.setAttr(end,{fill:"bottom-black-#"+c}); }
          }
          if( title )
          {
             title = title.split('&');
            var background_title = {
                fill:'left-black-gray-black', 
                opacity:0.6,
                x:x,
                y:y,
                width:width,
                height:50 
              };

            var node_title = this.svg.create('g', {fill:background_title.fill });
            var rect_title = this.svg.create('rect', background_title );
            this.svg.removeAttr(rect,{fill:''});
            node_title.appendChild(rect_title);


           

            var txt_title = this.svg.create('text', {
               x:x,
               y:y,
               fill:'white',style:'font-size:14px; font-weight:bold',
               'text-anchor':'middle'
             });

             let _x = Number(rect_title.getAttribute("x")) + Number(rect_title.getAttribute("width")/2);
             let _y = Number(rect_title.getAttribute("y")) + Number(rect_title.getAttribute("height")/(5.5* title.length));

             for (var i in title) 
             {
               let tspan = this.svg.create('tspan', {x:_x,dy:'1.3em'});
               tspan.appendChild(document.createTextNode(title[i].trim()));
               txt_title.appendChild( tspan );
             }


             txt_title.setAttribute("x", _x);
             txt_title.setAttribute("y", _y);

             node_title.appendChild( txt_title );

             this.append(node_title);
          }

          //Уровень танка
          if(level)
          {
              if(typeof level.x == "undefined") { level.x = x + width/20; } else {level.x = x +level.x; };
              if(typeof level.y == "undefined") { level.y = (y+55); } else {level.y = y +level.y; }; 
              level.width = level.width || (width - width/20*2);
              level.height = level.height || (height - height / 25 - 50);
              level.background = level.background || {};
              level.background.fill = level.background.fill || 'none';
              level.background.stroke = level.background.stroke || 'none';    
              //level.caption = {};         
              var level = e.create_object({type:'scale',value:{type:'float'},attr:level});  
           this.append_object(level);              
          }
 
         this.svg.setAttr(rect,{fill:get_color(_color)});
         if(end != null) { this.svg.setAttr(end,{fill:'top-black-#'+_color}); }
         
        /*Объект caption для вывода результата*/
         if( caption )
         {
             caption = e.create_object( {
                  type:'label', 
                  attr:{ 
                    width:70, height:30,
                    x:x+50, 
                    y:y+ ( height / 2 ) - 5, 
                    caption:{style:'font-size:16px; font-weight:bold'}, 
                    background:{fill:'yellow',stroke:'black','stroke-width':2}
                  },
              value: param.value || {type:'float', precision:1 }
            });
            this.append_object( caption );
        }
          /*--------------------------------*/

        /*Объект индикатор*/
             this.indicator_err = this.add_object({
                type:'circle',
                value:{bit:0},
                attr:{
                    cx:x+width-30,
                    cy:y+height-15,
                    fill:'r-white-gray',
                    r:10,
                    cursor:'pointer'
                },
                flicker:{value:'=1',delay:300},
                dynamic:{ 
                     fill:{settings:[['0','r-white-gray'],['1','r-white-red']]},
                }
            },e);

          /*--------------------------------*/


         this.change_array = function( arr )
         {
            //console.log( arr );
            this.value( arr[0] );
            if( caption ) caption.value( arr[0] );
            //if( this.indicator )  this.indicator.value( arr[1] );
            on_array_connect( this, arr );
         }


          this.draw = function()
          {
            if(level) 
            {
               level.value(this.value());
            }
          }              
    },

     //Конструктор 
    ptl_table:function(param,e){
      this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
      e.append(this.node); 
      

        var xo = param.attr.x || 0;
        var yo = param.attr.y || 0;  

         this.append_object( e.create_object( {
               type:'label',
               caption:'НАСТРОЙКА ПАРАМЕТРОВ ШИХТА/ СТЕКЛОБОЙ',

               attr:{
                   x:xo,
                   y:yo,
                   height:20, width:720,
                   caption:{style:'font-size:12px; font-weight:bold', fill:'white'}, 
                   background:{fill:'left-black-gray-black',stroke:'black','stroke-width':2, opacity:"0.6"},

               }
             } ) );

         this.append( this.svg.create('rect', {
               x:xo,
               y:yo + 22,
               width:350, height:65,
               fill:'gray',opacity:"0.6"
             }));

         this.append( this.svg.create('rect', {
               x:xo,
               y:yo + 85,
               width:350, height:100,
               fill:'gray',opacity:"0.6"
             }));

         this.append( this.svg.create('rect', {
               x:xo+351,
               y:yo + 22,
               width:370, height:163,
               fill:'gray',opacity:"0.6"
             }));

             this.append( this.svg.create_text(this, {
                   x:xo + 50,
                   y:yo + 33,
                   style:'font-size:16px; font-weight:bold',
                   fill:'#000000',
                   //'text-anchor':'middle',
                 }, 'Задание производительности') );  

            this.append( this.svg.create_text(this, {
                   x:xo + 50,
                   y:yo + 105,
                   style:'font-size:16px; font-weight:bold',
                   fill:'#000000',
                   //'text-anchor':'middle',
                 }, 'Расчетные данные') );  

            this.append( this.svg.create_text(this, {
                   x:xo + 550,
                   y:yo + 35,
                   style:'font-size:14px; font-weight:bold',
                   fill:'green',
                   //'text-anchor':'middle',
                 }, 'Текущая') );  

            this.append( this.svg.create_text(this, {
                   x:xo + 640,
                   y:yo + 35,
                   style:'font-size:14px; font-weight:bold',
                   fill:'green',
                   //'text-anchor':'middle',
                 }, 'Последняя') ); 

         let _t = ['Общая производительность (в печи) т/ч', 'Процент соотношения (в печи)%', 'Процент угара шихты (в печи)%'];
         let _y = yo + 50;
         for( let i in _t )
         {
             this.append( this.svg.create_text(this, {
                   x:xo + 5,
                   y:_y + i * 15,
                   style:'font-size:14px; font-weight:bold',
                   fill:'#AD0000',
                   //'text-anchor':'middle',
                 }, _t[i]) );            
         }

          _t = ['Процент соотношения стеклобоя (в печи)%', 'Общая производительность (на ленте) т/ч', 'Производительность ДНВД 90 т/ч', 'Производительность ДНВД 89 т/ч'];
          _y = yo + 125;
         for( let i in _t )
         {
             this.append( this.svg.create_text(this, {
                   x:xo + 5,
                   y:_y + i * 15,
                   style:'font-size:14px; font-weight:bold',
                   fill:'green',
                   //'text-anchor':'middle',
                 }, _t[i]) );            
         }

          _t = ['Нач. загрузки (час/ мин; д/м)', 
                 'Кон. загрузки (час/ мин; д/м)',
                 'Загруженно в левый кг.',
                 'Загруженно в правый кг.',
                 'Загруженно шихты в печь кг.',
                 'Загруженно с/боя в печь кг.',
                 'Загруженно всего в печь кг.',
                 'Соотношение шихты в %',
                 'Соотношение с/боя в %',
               ];
          _y = yo + 55;
         for( let i in _t )
         {
             this.append( this.svg.create_text(this, {
                   x:xo + 355,
                   y:_y + i * 15,
                   style:'font-size:14px; font-weight:bold',
                   fill:'#AD0000',
                   //'text-anchor':'middle',
                 }, _t[i]) );            
         }

         var _tobj = function(x, y, value)
         {

            if( typeof value == "undefined" )
            {
                value = { type:'float', precision:2 };
            }
            

            return {
                type:'label', 
                'class':'ptl_label1',
                value:value,
                attr:{ x:xo + x, y:yo + y}               
            }
         }


         /*Общая производительность*/
            var v1 = e.create_object( _tobj(300, 34) );
            this.append_object( v1 );
         /*--------------------------------*/
         /*Процент соотношения (в печи)%*/
            var v2 = e.create_object( _tobj(300, 49) );
            this.append_object( v2 );
         /*--------------------------------*/
         /*Процент угара шихты (в печи)%*/
            var v3 = e.create_object(_tobj(300, 64) );
            this.append_object( v3 );
         /*--------------------------------*/

         /*Процент соотношения стеклобоя (в печи)%*/
            var v4 = e.create_object(_tobj(300, 108) );
            this.append_object( v4 );
         /*--------------------------------*/

         /*Общая производительность (на ленте) т/ч*/
            var v5 = e.create_object(_tobj(300, 123) );
            this.append_object( v5 );
         /*--------------------------------*/
         /*Производительность ДНВД 90 т/ч*/
            var v6 = e.create_object(_tobj(300, 138) );
            this.append_object( v6 );
         /*--------------------------------*/
         /*Производительность ДНВД 89 т/ч*/
            var v7 = e.create_object(_tobj(300, 154) );
            this.append_object( v7 );
         /*--------------------------------*/

          var date_tek = e.create_object(_tobj(560, 38, { //Текущая дата загрузки
            type:'string'
          }) ); //Дата начала последней загрузки
            this.append_object( date_tek ); 

          var date_begin = e.create_object(_tobj(650, 38, {
            type:'string'
          }) ); //Дата начала последней загрузки
            this.append_object( date_begin );            
          var date_end = e.create_object(_tobj(650, 53, {
            type:'string'
          }) ); //Дата начала последней загрузки
            this.append_object( date_end );  

        /*Загруженно в левый кг.*/
            var v10 = e.create_object(_tobj(570, 68) );
            this.append_object( v10 );
            var v10p = e.create_object(_tobj(650, 68) ); //Последняя
            this.append_object( v10p );            
         /*--------------------------------*/

        /*Загруженно в правый кг.*/
            var v11 = e.create_object(_tobj(570, 83) );
            this.append_object( v11 );
            var v11p = e.create_object(_tobj(650, 83) ); //Последняя
            this.append_object( v11p );            
         /*--------------------------------*/

        /*Загруженно шихты в печь кг.*/
            var v12 = e.create_object(_tobj(570, 98) );
            this.append_object( v12 );
            var v12p = e.create_object(_tobj(650, 98) ); //Последняя
            this.append_object( v12p );            
         /*--------------------------------*/

        /*Загруженно с/боя в печь кг.*/
            var v13 = e.create_object(_tobj(570, 113) );
            this.append_object( v13 );
            var v13p = e.create_object(_tobj(650, 113) ); //Последняя
            this.append_object( v13p );            
         /*--------------------------------*/

        /*Загруженно всего в печь кг.*/
            var v14 = e.create_object(_tobj(570, 128) );
            this.append_object( v14 );
            var v14p = e.create_object(_tobj(650, 128) ); //Последняя
            this.append_object( v14p );            
         /*--------------------------------*/

        /*Соотношение шихты в %*/
            var v15 = e.create_object(_tobj(570, 143) );
            this.append_object( v15 );
            var v15p = e.create_object(_tobj(650, 143) ); //Последняя
            this.append_object( v15p );            
         /*--------------------------------*/

        /*Соотношение с/боя в %*/
            var v16 = e.create_object(_tobj(570, 158) );
            this.append_object( v16 );
            var v16p = e.create_object(_tobj(650, 158) ); //Последняя
            this.append_object( v16p );            
         /*--------------------------------*/

     this.change_array = function( arr )
     {
            v1.value(arr[0]);
            v2.value(arr[1]);
            v3.value(arr[2]);

            v4.value(arr[3]);
            v5.value(arr[4]);
            v6.value(arr[5]);
            v7.value(arr[6]);

            v10.value(arr[7]);  v10p.value(arr[14]); 
            v11.value(arr[8]);  v11p.value(arr[15]);
            v12.value(arr[9]);  v12p.value(arr[16]);
            v13.value(arr[10]); v13p.value(arr[17]);
            v14.value(arr[11]); v14p.value(arr[18]);
            v15.value(arr[12]); v15p.value(arr[19]);
            v16.value(arr[13]); v16p.value(arr[20]);

            date_begin.value( String(arr[21]).padStart(2, "0") + '.' +String(arr[22]).padStart(2, "0") + ' ' + String(arr[23]).padStart(2, "0")+':'+String(arr[24]).padStart(2, "0") );
            date_end.value( String(arr[25]).padStart(2, "0") + '.' +String(arr[26]).padStart(2, "0") + ' ' + String(arr[27]).padStart(2, "0")+':'+String(arr[28]).padStart(2, "0") );

            date_tek.value( String(arr[29]).padStart(2, "0") + ':' +String(arr[30]).padStart(2, "0") );

     }

     }
    
  }
   
  $.new_constructor(constructor); 
    
})(svg_ap.svg_ap)