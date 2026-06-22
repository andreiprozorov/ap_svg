 (function($){
  var constructor = {
    
    //Конструктор объекта задвижка
    valve1:function(param,e){
      this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
      e.append(this.node); 
      var x = param.attr.x || 0;
      var y = param.attr.y || 0;     
      var valve = this.svg.create('path',{ stroke:'black', d:'M '+x + ' ' + y +'h15 l-5 20 l5 20h-15l5-20 z'});
      var vint = this.svg.create('path',{ stroke:'black', d:'M '+Number(x+10)+ ' ' +Number(y+18)+'h12v-7h5v18h-5v-7h-12 z'});
      
      this.append(valve);  
      this.append(vint);   
    },
    label2:function(param,e){
      this.node = this.svg.create('g');
      e.append(this.node); 
      var x = param.attr.x || 0;
      var y = param.attr.y || 0;
      var height = param.attr.height || 0;
      var width = param.attr.width || 0;
      var rect = this.svg.create('rect', param.attr);
      var text = param.text; 
      this.append(rect);
      this.append_object(e.create_object({
        type:'label',attr:{x:x,y:y,height:height/2,width:width,caption:{fill:'white',style:'font-size:11px'},background:{fill:'none'}},caption:text[0]
      }));
      this.append_object(e.create_object({
        type:'label',attr:{x:x,y:Number(y+height/2)-2,height:height/2,width:width,caption:{fill:'white',style:'font-size:11px'},background:{fill:'none'}},caption:text[1]
      }));      
    }
  }
   
  $.new_constructor(constructor); 
  })(svg_ap.svg_ap);   

(function($){
    
  var constructor = {
    
    //Трубы газовые
    pech_pipe:function(param, e)
    {
        this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
        e.append(this.node); 

        var x = param.attr.x || 0;
        var y = param.attr.y || 0;     
        
        var truba1 = this.add_object({ 
            type:'track', 
            value:{bit:11}, 
            attr:{x:x, y:y, line:[['r',50],['d', 125], ['r', 20]]},
           'class':'pipe1',
            dynamic:{
               fill:{ settings:[['1','bottom-yellow-yellow-yellow-#F4CA16'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
           }, e);

        var truba2 = this.add_object({ 
            type:'track', 
            value:{bit:14}, 
            attr:{x:x, y:y+30, line:[['r',30],['d', 265], ['r', 40]]},
           'class':'pipe1',
            dynamic:{
               fill:{ settings:[['1','bottom-yellow-yellow-yellow-#F4CA16'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
           }, e);


        var valv1 = this.add_object({ 
              type:'valve1',
               value:{bit:11},
               attr:{x:x-30,y:y-30},
               dynamic:{
                  fill:{settings:[['0','left-black-gray-black'],['1','left-black-yellow-black']]}
              },
               rotate:270
           }, e);

        var valv2 = this.add_object({ 
              type:'valve1',
               value:{bit:14},
               attr:{x:x-30,y:y},
               dynamic:{
                  fill:{settings:[['0','left-black-gray-black'],['1','left-black-yellow-black']]}
              },
               rotate:270
           }, e);

        var fire1 = this.add_object({ 
            type:'image', 
            value:{bit:11}, 
            attr:{
               x:x+50, 
               y:y+50,
               href:"./images/fire1.gif",
               width:150, 
               height:110
            },
            rotate:90,
            indicator:{value:'=1'},
            dynamic:{
               //fill:{ settings:[['1','bottom-yellow-yellow-yellow-#F4CA16'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
           }, e);

        var fire2 = this.add_object({ 
            type:'image', 
            value:{bit:14}, 
            indicator:{value:'=1'},
            attr:{
               x:x+50, 
               y:y+220,
               href:"./images/fire1.gif",
               width:150, 
               height:110
            },
            rotate:90,
            dynamic:{
               //fill:{ settings:[['1','bottom-yellow-yellow-yellow-#F4CA16'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
           }, e);

        this.change_array = function( arr )    
        {
             truba1.value(arr[0]);
             truba2.value(arr[0]);
             valv1.value(arr[0]);
             valv2.value(arr[0]);
             fire1.value(arr[0]);
             fire2.value(arr[0]);
        }
    },

    ler:function(param, e)
    {        
        this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
        e.append(this.node); 

        var x = param.attr.x || 0;
        var y = param.attr.y || 0;     

        var height = 80;

        var box = this.svg.create('rect',{x:x, y:y, height:80,width:360 ,fill:'#18A240',stroke:'black','stroke-width':2});

        this.append(box);  


        for( var i = 1; i <= 8; i++ )
        {

          this.append( this.svg.create('line',{
                style:"fill: none; stroke: rgb(0, 0, 0);",  
                'stroke-width':2, 
                x1:x+(45 * i), 
                y1:y, 
                x2:x+(45 * i), 
                y2:y+height
          }) );     
    
        this.append( this.svg.create_text('text', {
              x:(x-20)+(45 * i), 
              y:(y-5), 
              style:"font-size:16px; font-weight:bold",
              fill:'orange'
          }, i ) ); 
        }

        this.draw = function () {
          //console.log('oops');
        }



        var t1 = this.add_object({ type:'label', attr:{x:x+5,y:y+3}, 'class':'label4' }, e);
        var t1z = this.add_object({ type:'label', attr:{x:x+5,y:y+23}, 'class':'label5' }, e);
        var t11e = this.add_object({
            type:'circle',
            value:{bit:0},
            attr:{
                cx:x,
                cy:y+25,
                fill:'r-white-red',
                r:10,
                cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);

        var t12 = this.add_object({ type:'label', attr:{x:x+5,y:y+43}, 'class':'label4' }, e);
        var t12z = this.add_object({ type:'label', attr:{x:x+5,y:y+63}, 'class':'label5' }, e);
        var t12e = this.add_object({
            type:'circle',
            value:{bit:1},
            attr:{
                cx:x,
                cy:y+60,
                fill:'r-white-red',
                r:10,cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);
       
        var t2 = this.add_object({ type:'label', attr:{x:x+50,y:y+25}, 'class':'label4' }, e);
        var t2z = this.add_object({ type:'label', attr:{x:x+50,y:y+45}, 'class':'label5' }, e);
        var t2e = this.add_object({
            type:'circle',
            value:{bit:2},
            attr:{
                cx:x+67,
                cy:y+12,
                fill:'r-white-red',
                r:10,cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);

        var t3 = this.add_object({ type:'label', attr:{x:x+95,y:y+25}, 'class':'label4' }, e);
        var t3z = this.add_object({ type:'label', attr:{x:x+95,y:y+45}, 'class':'label5' }, e);
        var t3e = this.add_object({
            type:'circle',
            value:{bit:3},
            attr:{
                cx:x+112,
                cy:y+12,
                fill:'r-white-red',
                r:10,cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);

        var t4 = this.add_object({ type:'label', attr:{x:x+140,y:y+25}, 'class':'label4' }, e);
        var t4z = this.add_object({ type:'label', attr:{x:x+140,y:y+45}, 'class':'label5' }, e);
        var t4e = this.add_object({
            type:'circle',
            value:{bit:4},
            attr:{
                cx:x+157,
                cy:y+12,
                fill:'r-white-red',
                r:10,cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);


        var t5 = this.add_object({ type:'label', attr:{x:x+185,y:y+25}, 'class':'label4' }, e);
        var t5z = this.add_object({ type:'label', attr:{x:x+185,y:y+45}, 'class':'label5' }, e);
        var t5e = this.add_object({
            type:'circle',
            value:{bit:5},
            attr:{
                cx:x+203,
                cy:y+12,
                fill:'r-white-red',
                r:10,cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);

        var t6 = this.add_object({ type:'label', attr:{x:x+230,y:y+25}, 'class':'label4' }, e);
        var t6z = this.add_object({ type:'label', attr:{x:x+230,y:y+45}, 'class':'label5' }, e);
        var t6e = this.add_object({
            type:'circle',
            value:{bit:6},
            attr:{
                cx:x+250,
                cy:y+12,
                fill:'r-white-red',
                r:10,cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);

        var t7 = this.add_object({ type:'label', attr:{x:x+275,y:y+25}, 'class':'label4' }, e);
        var t7z = this.add_object({ type:'label', attr:{x:x+275,y:y+45}, 'class':'label5' }, e);
        var t7e = this.add_object({
            type:'circle',
            value:{bit:7},
            attr:{
                cx:x+293,
                cy:y+12,
                fill:'r-white-red',
                r:10,cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);

        var t8 = this.add_object({ type:'label', attr:{x:x+320,y:y+25}, 'class':'label4' }, e);
        var t8z = this.add_object({ type:'label', attr:{x:x+320,y:y+45}, 'class':'label5' }, e);
        var t8e = this.add_object({
            type:'circle',
            value:{bit:8},
            attr:{
                cx:x+337,
                cy:y+12,
                fill:'r-white-red',
                r:10,cursor:'pointer'
            },
            flicker:{value:'=1',delay:300},
            indicator:{value:'=1'},
        },e);

        this.change_array = function( arr )
        {
          t1.value(arr[0]);
          t1z.value(arr[1]);
          t12.value(arr[2]);
          t12z.value(arr[3]);

          t2.value(arr[4]);
          t2z.value(arr[5]);

          t3.value(arr[6]);
          t3z.value(arr[7]);

          t4.value(arr[8]);
          t4z.value(arr[9]);

          t5.value(arr[10]);
          t5z.value(arr[11]);

          t6.value(arr[12]);
          t6z.value(arr[13]);

          t7.value(arr[14]);
          t7z.value(arr[15]);

          t8.value(arr[16]);
          t8z.value(arr[17]);

          t11e.value(arr[18]);
          t12e.value(arr[18]);
          t2e.value( arr[18] );
          t3e.value( arr[18] );
          t4e.value( arr[18] );
          t5e.value( arr[18] );
          t6e.value( arr[18] );
          t7e.value( arr[18] );
          t8e.value( arr[18] );

        }

    },
    round_scale_bg:function(param, e)
    {
       this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
       e.append(this.node);     
       var x = param.attr.x || 0;
       var y = param.attr.y || 0;         
        var angle = 0;
        var color = 'red'; 
        var _colors = [ 
            {
                color:'red',
                start:0,
                end:70 
            }, 
            {
                color:'orange',
                start:71,
                end:100 
            }, 
            {
                color:'yellow',
                start:121,
                end:130 
            }, 
            {
                color:'#00E800',
                start:145,
                end:360 
            }, 

           ];

        var colors = param.scheme_color || _colors;
        var scheme_val = param.scheme_val || [];


        while (angle < 260) {
            (function (t, c, ctx) { 

               let point = ctx.svg.create(
                    'circle', 
                    {
                        cx:x, 
                        cy:y, 
                        r:3, 
                        fill:c, 
                        stroke: c,
                        transform:"rotate("+t+", "+(x+60)+", "+(y+50)+")",
                        test:angle,
                        //'box-shadow':'-2 -2 1 black'
                    });            
                    ctx.append(point);  
        

            })(angle, color, this);

            for( let i in colors )
            {
                if( angle >= colors[i].start && angle <= colors[i].end )
                {
                    color = colors[i].color;
                }
            }

            angle += 4;
        }

    },

    //Конструктор круглая шкала
    round_scale:function(param,e){
      this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
      e.append(this.node); 
      
      var xo = param.attr.x || 0;
      var yo = param.attr.y || 0;     
      var min = param.min || 0;
      var max = param.max || 100;
      var L = param.L || 75; //Длина шкалы
      var begin = param.begin || 0;
      var end = param.end || begin;
      var color_line = param.color_line || 'black'; //Цвет стрелки
      var inversion = param.inversion || 0;
      var arr_numbers = param.arr_numbers || [];
      param.caption = param.caption || {};

      var title = param.title || false; //Надпись над циферблатом
      var label_zad = param.label_zad || false; //Вывод задания
      var label_rezhim = param.label_rezhim || false; //Вывод режима работы
      var rezhim_bit = param.rezhim_bit || 0; //Бит режима

      var label_tree = param.label_tree || false; //Еще один лабел


      var value_zad = param.value_zad || { type:'int' };

      var ciferblat = e.create_object({
        type:'round_scale_bg',
        attr:{x:xo,y:yo},
        scheme_color:param.scheme_color || null
      });
      ciferblat.rotate(-79);
      this.append_object( ciferblat );

        xo = xo + 68;
        yo = yo + 53;

        var value = 0; 

     var func_get_coord = function( value, xo, yo, min, max, begin, end, L )
     {
        if(min<0) {
            value = Number(max)+Number(value);
            var min = min*-1; 
            var max = max+min;
            }
        if(inversion ==1){
            value = value*-1; 
            value = max - value;        
           }                
        var GRAD = 0.0174532;
        var a = (360-begin-end)/(max/value); //угол
        a=a*-1;
        a=a-90-begin;         
        return {
            x:Math.round(xo + L*Math.cos(a*GRAD)),
            y:Math.round(yo - L*Math.sin(a*GRAD)),
            a:a,
            GRAD:GRAD,
        }
     }



        if( typeof param.caption.after !== "undefined" )
        {

            this.append_object( e.create_object( {
                    type:'label',
                    attr:{
                        x:xo, 
                        y:yo+50, 
                        caption:{
                            fill:'black',
                            style:"font-size:18px; font-weight:bold"
                        }
                     },
                     caption:param.caption.after
                    }));
        }

         if(title)
         {
             this.append_object(e.create_object({
                type:'label',
                attr:{
                    x:xo,
                    y:yo - 115,
                    caption:{
                        fill:'black',
                        style:"font-size:18px; font-weight:bold"
                    }
                },
                caption:title
             }));
         }


     /*Объект стрелка*/
          var res = func_get_coord(value, xo, yo, min, max, begin, end, L);
          var x = res.x;
          var y = res.y;
          var arr_line = [];
          for(var i = 2; i<=5; i++)
          {     
            arr_line[i] = this.svg.create('line',{
            x1:xo,
            y1:yo,
            x2:x, 
            y2:y, 
            stroke:color_line,
            "stroke-width":i+1
                 });

            this.append(arr_line[i]);
          } 
          /*--------------------------------*/

        /*Объект caption для вывода результата*/
          var caption = e.create_object( {
            type:'label', attr:{ 
                x:xo, 
                y:yo+32, 
                caption:{
                    fill:param.caption.color || 'blue',
                    style:"font-size:18px; font-weight:bold"
                }
            },
            value: param.value || {type:'float' }
          });
          this.append_object( caption );
          caption.value(value);
          /*--------------------------------*/

          /*Отрисовка цифр на цифербоате*/
          for(let i in arr_numbers)
          {
             let _ky = 0;
             let _kk = 0;
              let _v = arr_numbers[i];
              let c = func_get_coord(_v, xo, yo, min, max, begin, end, L);

              let _k = (c.x < xo)?-50:25;
              let _kr = (c.x < xo)?-12:2;

              if( c.x > ( xo - 10 ) &&  c.x < ( xo +10 ))
              {
                _k = 0;
                _kr = -5;
                _ky = -10;
                _kk = -3;
              }

              this.append(
                  this.svg.create('rect',{
                    x:c.x + _kr,
                    y:c.y - 5,
                    width:10,
                    height:10,
                    fill:'black',
                    rx:2
                  })
                );

              this.append(
                  this.svg.create_text(null,{
                    x:c.x + _k + _kk,
                    y:c.y + _ky,
                    style:"font-size:16px; font-weight:bold",
                  }, _v)
                );

          }

          /*--------------------------------*/

          /*Объект значения задания*/
          if( label_zad )
          {
             label_zad = e.create_object({
                type:'label',
                value:value_zad,
                attr:{
                    x:xo-30, 
                    y:yo+70, 
                    width:60, height:17, caption:{style:'font-weight:bold',fill:'green',style:'font-size:14px; font-weight:bold'}, background:{fill:'white',stroke:'green','stroke-width':2},
                 },             
             });

             this.append_object( label_zad );
          }

          /*--------------------------------*/
     
         /*Объект вывода режима работы*/
         if( label_rezhim )
         {
            label_rezhim = e.create_object({
            type:'label', value:{bit:rezhim_bit}, caption:'Р',
            attr:{
                x:xo-20,
                y:yo,
                width:40, 
                height:20,
                caption:{
                    style:'font-weight:bold',
                    fill:'white',
                }, 
                background:{fill:'lime',stroke:'white','stroke-width':2}    
            },
            caption:'Р',
            dynamic:{ 
                 fon:{settings:[['1','red'],['0','lime']]},
                 text:{settings:[['1','Р'],['0','А']]},
            },
            });

            this.append_object( label_rezhim );
         }
         /*--------------------------------*/

          /*Объект значения */
          if( label_tree )
          {
             label_tree = e.create_object({
                type:'label',
                value:{type:'float', precision:2},
                attr:{
                    x:xo-30, 
                    y:yo+90, 
                    width:60, height:17, caption:{style:'font-weight:bold',fill:'#AD0000',style:'font-size:14px; font-weight:bold'}, background:{fill:'white',stroke:'#AD0000','stroke-width':2},
                 },             
             });

             this.append_object( label_tree );
          }

          /*--------------------------------*/

         this.change_array = function( arr )
         {
            //console.log( this.value );
            this.value( arr[0] );
          if( label_zad )   label_zad.value( arr[1] );
          if( label_rezhim )    label_rezhim.value( arr[2] );
          if( label_tree )    label_tree.value( arr[3] );


         }

          this.draw = function()
          {
             var value = this.value();
             caption.value(value);

                var res = func_get_coord(value, xo, yo, min, max, begin, end, L);
                var x = res.x;
                var y = res.y;  
                var a = res.a;
                var GRAD = res.GRAD;

                  for(var i = 2; i<=5; i++)
                  {     
                    _L=L-i;
                    x = Math.round(xo + _L*Math.cos(a*GRAD));
                    y = Math.round(yo - _L*Math.sin(a*GRAD)); 

                     arr_line[i].setAttribute('x1', xo);
                     arr_line[i].setAttribute('y1', yo);
                     arr_line[i].setAttribute('x2', x );
                     arr_line[i].setAttribute('y2', y);
                  } 
                         
          }

          
    },

     //Конструктор 
    scale_pech:function(param,e){
      this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
      e.append(this.node); 
      
      var xo = param.attr.x || 0;
      var yo = param.attr.y || 0;  
      var title = param.title || false;
      var label_rezhim = param.label_rezhim || false; //Вывод режима работы
      var label_rezhim_bit = param.label_rezhim_bit || 0; //Вывод режима работы
      var label_zad = param.label_zad || false; //Вывод задания
      var min = param.min || 0;
      var max = param.max || 0;

        /*Объект scale для вывода результата*/
          var scale = e.create_object(
          {
            type:'scale',
                attr:{
                    x:xo,
                    y:yo,
                    max:max,
                    min:min,
                    width:param.attr.width||30,
                    height:param.attr.height||100,
                    background: param.background || {'fill':'white', 'stroke':'white'},
                    scale: param.scale_color || {fill:'lime'},
                    caption:{},
                },
                style:'font-weight:bold',
                value:param.value || {type:'float'}
            });
          
          //scale.value(5);
          this.append_object( scale );


         if(title)
         {        

             this.append_object(e.create_object({
                type:'label',
                attr:{
                    x:xo + 15,
                    y:yo - 20,
                    caption:{
                        fill:'black',
                        style:"font-size:18px; font-weight:bold"
                    }
                },
                caption:title
             }));
         }

          /*Объект значения задания*/
          if( label_zad )
          {
             label_zad = e.create_object({
                type:'label',
                attr:{
                    x:xo-15, 
                    y:yo+130, 
                    width:60, height:17, caption:{style:'font-weight:bold',fill:'#AD0000',style:'font-size:14px; font-weight:bold'}, background:{fill:'white',stroke:'#AD0000','stroke-width':2},
                 },       
                 value:{type:'float'}      
             });

             this.append_object( label_zad );
          }

         /*Объект вывода режима работы*/
         if( label_rezhim )
         {
            label_rezhim = e.create_object({
            type:'label', value:{bit:label_rezhim_bit}, caption:'Р',
            attr:{
                x:xo - 5,
                y:yo + 105,
                width:40, 
                height:20,
                caption:{
                    style:'font-weight:bold',
                    fill:'white',
                }, 
                background:{fill:'lime',stroke:'white','stroke-width':2}    
            },
            caption:'Р',
            dynamic:{ 
                 fon:{settings:[['1','red'],['0','lime']]},
                 text:{settings:[['1','Р'],['0','А']]},
            },
            });

            this.append_object( label_rezhim );
         }
         /*--------------------------------*/

         this.change_array = function( arr )
         {
            //console.log( arr );
            this.value( arr[0] );
            if( label_zad ) label_zad.value( arr[1] );
            if( label_rezhim )  label_rezhim.value( arr[2] );
         }

         this.draw = function()
         {
            scale.value( this.value() );
         }

     },

    zagruzchik:function(param,e){
      this.node = this.svg.create('g',{fill:param.attr.fill || 'none'});
      e.append(this.node); 
      

          var xo = param.attr.x || 0;
          var yo = param.attr.y || 0;  
          var label_rezhim_bit = param.label_rezhim_bit || 0;

          var inversion = param.inversion || false;

          var zagr =   e.create_object({
                type:'flap',
                path:'./images/',
                attr:{x:xo, y:yo, width:50, height:70}, 
                dynamic:{ image:{ settings:[ ['<1', 'zagr_61x95.png'],['>1','zagr_61x95.gif'],['=0','zagr_61x95.png'] ] } }
             });


          this.append_object( zagr );


         this.change_array = function( arr )
         {

            zagr.value(arr[0]);

            //scale_procent.value(arr[0]);
            //label_rezhim.value( arr[1] );
         }

     }



  }
   
  $.new_constructor(constructor); 
    
})(svg_ap.svg_ap);


