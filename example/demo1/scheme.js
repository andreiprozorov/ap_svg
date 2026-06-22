var _OVEN_ = {
    box:'scheme-oven',
    lighthouse:true,
    style:{
       width:'1200',
       height:'700',
       fill:'top-#987F98-white-#987F98', 
   },
   'class':{
     brick:{stroke:'url(#_brick_)', 'stroke-width':10, /*'box-shadow':'0 0 5 black'*/},
     label1:{width:40, height:23, caption:{style:'font-weight:bold',fill:'#AD0000',style:'font-size:14px; font-weight:bold'}, background:{fill:'white',stroke:'#AD0000','stroke-width':2}},
     label2:{width:40, height:23, caption:{style:'font-weight:bold',fill:'green',style:'font-size:14px; font-weight:bold'}, background:{fill:'white',stroke:'#AD0000','stroke-width':2}},
     label3:{width:40, height:20, caption:{style:'font-weight:bold',fill:'white'}, background:{fill:'lime',stroke:'white','stroke-width':2}},
     label4:{width:35, height:17, caption:{style:'font-weight:bold',fill:'#AD0000',style:'font-size:12px; font-weight:bold'}, background:{fill:'white',stroke:'#AD0000','stroke-width':2}},
     label5:{width:35, height:17, caption:{style:'font-weight:bold',fill:'green',style:'font-size:12px; font-weight:bold'}, background:{fill:'white',stroke:'#AD0000','stroke-width':2}},
     pipe1:{width:7, fill:'bottom-black-#808080-#a9aca1-#808080',stroke:'black',round_corners:true},  
   },
   drawing:[
     {
        type:'pattern',
        attr:{id:'_brick_',patternUnits:"userSpaceOnUse", x:"0", y:"0", width:"15", height:"15"},
        draw:{
           'image':{href:"./images/brick.png", width:15, height:15} 
        }
     },   
     {
        type:'pattern',
        attr:{id:'_brick2_',patternUnits:"userSpaceOnUse", x:"0", y:"0", width:"15", height:"15"},
        draw:{
           'image':{href:"./images/brick2.png", width:15, height:15} 
        }
     },   
     {
        type:'pattern',
        attr:{id:'_brick3_',patternUnits:"userSpaceOnUse", x:"0", y:"0", width:"7", height:"7"},
        draw:{
           'image':{href:"./images/brick3.png", width:7, height:7} 
        }
     },     
     {
        type:'pattern',
        attr:{id:'_brick4_',patternUnits:"userSpaceOnUse", x:"0", y:"0", width:"8", height:"4"},
        draw:{
           'image':{href:"./images/gr.png", width:8, height:4} 
        }
     },       
     {type:'path', 'class':'brick', attr:{ fill:'url(#_brick2_)',
       d:'M55 267 h110 l60 -90 h280 v 70 h-250 l-35 50 l35 50 h250 v70 h-280 l-60-90 h-110 z'
      }
     },       
     {type:'circle', attr:{cx:10,cy:300,r:60,fill:'url(#_brick2_)'},'class':'brick'},
     {type:'rect',attr:{x:290, y:140, height:315,width:165 ,fill:'url(#_brick3_)'},'class':'brick'},
     
     {type:'line',attr:{x1:290, y1:298, x2:450,y2:298},'class':'brick'},
     {type:'line',attr:{x1:355, y1:295, x2:355,y2:180},'class':'brick'},
     {type:'line',attr:{x1:395, y1:145, x2:395,y2:260},'class':'brick'},
    
     {type:'line',attr:{x1:355, y1:455, x2:355,y2:340},'class':'brick'},
     {type:'line',attr:{x1:395, y1:305, x2:395,y2:420},'class':'brick'},
     
     {type:'path', 'class':'brick', attr:{ fill:'#FF9A00',
       //d:'M505 435 v-275 h25 v-30 h60 v30 h170 v100 h35 v-10 h60 v195 h-60v-145h-35v135 h-170v30h-60v-30z'
       d:'M505 435 v-275 h25 v-30 h60 v30 h170 v100 h35 v-70 h60 v220 h-60 v-100 h-35 v125 h-170 v30 h-60 v-30z '
      }
     },

     {
      type:'track', 
        attr:{x:900, y:232, width:15, line:[['l',55]]},
       'class':'pipe1',
     },
     {
      type:'track', 
        attr:{x:900, y:305, width:15, line:[['l',55]]},
       'class':'pipe1',
     },
    ],

   objects:{

     sootnoshenie:{
        type:'scale_pech',
        attr:{
            x:980, y:550,
        },
        array_connect:['sootnoshenie_tek','sootnoshenie_zad'],
        title:'Соотношение',
        //label_rezhim:true,
        label_zad:true,
        max:18,
        min:0,
        scale:0.9,
        value:{ type:'float' }
     },

     urov_tek:{
        type:'scale_pech',
        attr:{
            x:880, y:550,
        },
        array_connect:['urov_tek', 'urov_tek', 'rezhim'],
        title:'Уровень',
        label_rezhim:true,
        max:5,
        min:-5,
        scale:0.9,
        label_rezhim_bit:1,
        value:{ type:'float', precision:2 },
        background:{'fill':'orange', 'stroke':'white'},
        scale_color:{ fill:'yellow'},
        click:function()
        {
            getChartCanvas('/oven/chart/oven_param');
        }  
     },

     davl_gss:{
        type:'scale_pech',
        attr:{
            x:1120, y:550,
        },
        title:'Давление ГСС',
        label_rezhim:false,
        label_zad:false,
        max:160,
        min:0,
        scale:0.9,
        background:{'fill':'yellow', 'stroke':'white'},
        scale_color:{ fill:'blue'},        
        value:{ type:'float' }
     },


     ler:{
       type:'ler',
       attr:{x:780, y:435},
       array_connect:[ 'ler_1_1', 'ler11_zad', 
                       'ler_1_2', 'ler12_zad',
                       'ler_2','ler2_zad',
                       'ler_3','ler3_zad',
                       'ler_4','ler4_zad',
                       'ler_5','ler5_zad',
                       'ler_6','ler6_zad',
                       'ler_7','ler7_zad',
                       'ler_8','ler8_zad',
                       'error_37'

                     ],
       scale:0.9,
       mouseover:function(e)
       {
          //this.scale({to:'2', count:1, home:'false', dur:200});
         // this.motion({to:'-250,0', dur:200, count:1,home:'false',accumulate:false});
       },
       mouseout:function(e)
       {
          //this.scale({to:'1', count:1, home:'false', dur:200});
          //this.motion({to:'0', dur:200, count:1,home:'false',accumulate:false});
       },       
       click:function(e) {

            getChartCanvas('/oven/chart/ler');
           //this.scale({to:'1.2', count:1, home:'false', revers:'true'});
          /* this.animate({
            attr:{
                "fill-opacity": 0.4
            },
            dur:1500,
            delta: 'bounce',
            revers:true
           });*/
/*        this.parent.new_data({
            'ler_1_1': 537,
            'ler11_zad': 564,
            'ler_1_2': 156,
            'ler12_zad': 988,
            'sc': 5,
            'test':65535,
            'urov_tek':5
         });*/

        //this.motion({to:'50,0', dur:1000, count:1,home:'false',accumulate:false, delta: 'bounce', revers:'true'});
       },

     },

     pech_pipe:{ type:'pech_pipe', array_connect:['work'], attr:{x:440, y:85} },
     time_perehod:{ type:'text', connect:'time_perehod', attr:{x:550, y:320, fill:'white', style:'font-size:28px; font-weight:bold'} },
     
     t_svod_1:{ type:'label', connect:'t_svod_1', attr:{x:550,y:245}, 'class':'label1', click:function(){getChartCanvas('/oven/chart/oven_t'); } },
     t_svod_2:{ type:'label', connect:'t_svod_2', attr:{x:620,y:245}, 'class':'label1', click:function(){getChartCanvas('/oven/chart/oven_t'); } },
     corr_zad:{ type:'label', connect:'corr_zad', attr:{x:620,y:270}, 'class':'label2' },

     corr_rezh:{
        type:'label',connect:'rezhim', value:{bit:2}, caption:'Р',attr:{x:620,y:297},'class':'label3',
        dynamic:{ 
             fon:{settings:[['1','red'],['0','lime']]},
             text:{settings:[['1','Р'],['0','А']]},
        },
     },


     t_svod_3:{ type:'label', connect:'t_svod_3', attr:{x:690,y:245}, 'class':'label1', click:function(){getChartCanvas('/oven/chart/oven_t'); } },
     t_dno_1:{ type:'label', connect:'t_dno_1', attr:{x:550,y:350}, 'class':'label1', click:function(){getChartCanvas('/oven/chart/oven_t'); } },
     t_dno_2:{ type:'label', connect:'t_dno_2', attr:{x:620,y:350}, 'class':'label1', click:function(){getChartCanvas('/oven/chart/oven_t'); } },
     t_dno_3:{ type:'label', connect:'t_dno_3', attr:{x:690,y:350}, 'class':'label1', click:function(){getChartCanvas('/oven/chart/oven_t'); } },
    
     t_verh_lev_p2:{ type:'label', connect:'t_verh_lev_p2', attr:{x:305,y:170}, 'class':'label1' },
     t_verh_lev_p1:{ type:'label', connect:'t_verh_lev_p1', attr:{x:405,y:170}, 'class':'label1' },
    
     w1:{ type:'label', connect:'t_niz_lev_p2', attr:{x:305,y:250}, 'class':'label1' },
     w2:{ type:'label', connect:'t_niz_lev_p1', attr:{x:405,y:250}, 'class':'label1' },

     w3:{ type:'label', connect:'t_verh_prav_p2', attr:{x:305,y:330}, 'class':'label1' },
     w4:{ type:'label', connect:'t_verh_prav_p1', attr:{x:405,y:330}, 'class':'label1' },

     w5:{ type:'label', connect:'t_niz_prav_p2', attr:{x:305,y:400}, 'class':'label1' },
     w6:{ type:'label', connect:'t_niz_prav_p1', attr:{x:405,y:400}, 'class':'label1' },

     t_dm:{ type:'label', connect:'t_dm', attr:{x:80,y:285}, 'class':'label1' },
     davlenie_osn:{
        type:'scale',
        connect:'davlenie_osn',
        attr:{
            x:100,
            y:170,
            max:100,
            min:0,
            width:30,
            height:70,
            background:{'fill':'white', 'stroke':'white'},
            scale:{fill:'blue'},
            caption:{after:'%', fill:'blak', style:'font-weight:bold'},
        },
     },

     gaz_osn:{
        type:'scale',
        connect:'gaz_osn',
        attr:{
            x:365,
            y:50,
            max:100,
            min:0,
            width:30,
            height:70,
            background:{'fill':'white', 'stroke':'white'},
            scale:{fill:'blue'},
            caption:{after:'%', fill:'blak', style:'font-weight:bold'},
        },
     },

     //Питатель

     t_canal_1:{ type:'label', connect:'t_canal_1', attr:{ x:830, y:120 }, 'class': 'label1' },
     t_canal_1_zad:{ type:'label', connect:'t_canal_1_zad', attr:{ x:830, y:142 }, 'class': 'label2' },
     
     t_canal_1_zad_e:{ type:'label', value:{type:'float', precision:1},  attr:{ x:830, y:164 }, 'class': 'label2' },
     t_canal_1_rez:{
        type:'label',connect:'rezhim', value:{bit:5}, caption:'Р',attr:{x:830,y:188},'class':'label3',
        dynamic:{ 
             fon:{settings:[['1','red'],['0','lime']]},
             text:{settings:[['1','Р'],['0','А']]},
        },
     },

     t_canal_2:{ type:'label', connect:'t_canal_2', attr:{ x:770, y:280 }, 'class': 'label1' },
     t_canal_2_zad:{ type:'label', connect:'t_canal_2_zad', attr:{ x:770, y:302 }, 'class': 'label2' },
     
     t_canal_2_zad_e:{ type:'label', value:{type:'float', precision:1}, attr:{ x:770, y:322 }, 'class': 'label2' },
     t_canal_2_rez:{
        type:'label',connect:'rezhim', value:{bit:6}, caption:'Р',attr:{x:770,y:342},'class':'label3',
        dynamic:{ 
             fon:{settings:[['1','red'],['0','lime']]},
             text:{settings:[['1','Р'],['0','А']]},
        },
     },

     t_canal_3:{ type:'label', connect:'t_canal_3', attr:{ x:830, y:330 }, 'class': 'label1' },
     t_canal_3_zad:{ type:'label', connect:'t_canal_3_zad', attr:{ x:830, y:352 }, 'class': 'label2' },
     
     t_canal_3_zad_e:{ type:'label', value:{type:'float', precision:1}, attr:{ x:830, y:372 }, 'class': 'label2' },
     t_canal_3_rez:{
        type:'label',connect:'rezhim', value:{bit:7}, caption:'Р',attr:{x:830,y:392},'class':'label3',
        dynamic:{ 
             fon:{settings:[['1','red'],['0','lime']]},
             text:{settings:[['1','Р'],['0','А']]},
        },
     },

     nasos_canal1:{
        type:'flap',
        value:{bit:0},
        connect:'rezhim2',
        path:'./images/',
        attr:{x:890, y:210, width:45, height:45}, 
        rotate:-90,
        dynamic:{ image:{ settings:[ ['0', 'blower.png'],['1','blower.gif'] ] } }
     },

     nasos_canal2:{
        type:'flap',
        value:{bit:1},
        connect:'rezhim2',
        path:'./images/',
        attr:{x:890, y:280, width:45, height:45}, 
        rotate:-90,
        dynamic:{ image:{ settings:[ ['0', 'blower.png'],['1','blower.gif'] ] } }
     },

     //Питатель end

     //Насосы в бабочку
     nasos1:{
        type:'flap',
        value:{bit:2},
        connect:'rezhim2',
        path:'./images/',
        attr:{x:230, y:40, width:45, height:45}, 
        rotate:-90,
        dynamic:{ image:{ settings:[ ['0', 'blower.png'],['1','blower.gif'] ] } }
     },

     vozduh_gc_2:{ type:'label', value:{type:'float'}, connect:'vozduh_gc_2', attr:{ x:250, y:70 }, 'class': 'label1' },

     nasos2:{
        type:'flap',
        value:{bit:3},
        connect:'rezhim2',
        path:'./images/',
        attr:{x:230, y:120, width:45, height:45}, 
        rotate:-90,
        dynamic:{ image:{ settings:[ ['0', 'blower.png'],['1','blower.gif'] ] } }
     },

     vozduh_gc_1:{ type:'label', value:{type:'float'}, connect:'vozduh_gc_1', attr:{ x:250, y:150 }, 'class': 'label1' },

 

     nasos1_pipe:{
      type:'track', 
      connect:'rezhim2',
            value:{bit:2}, 
            attr:{x:235, y:55, width:15, line:[['l',80],['d', 220],['r', 10]]},
           'class':'pipe1',
            dynamic:{
               fill:{ settings:[['1','#318CE7'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
     },

     pipe_baboch:{
      type:'track',
      connect:'work',
      value:{bit:11}, 
            attr:{x:155, y:275, width:15, line:[['r',120]] },
           'class':'pipe1',
           rotate:-55,
           dynamic:{
               fill:{ settings:[['1','#318CE7'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            }      
     },

     pipe_baboch2:{
      type:'track',
      connect:'work',
      value:{bit:14}, 
            attr:{x:155, y:345, width:15, line:[['r',120]] },
           'class':'pipe1',
           rotate:55,
           dynamic:{
               fill:{ settings:[['1','#318CE7'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            }     
     },

     vozduh_procent:{
        type:'scale',
        attr:{
            x:190,
            y:90,
            max:100,
            min:0,
            width:30,
            height:70,
            background:{'fill':'white', 'stroke':'white'},
            scale:{fill:'blue'},
            caption:{after:'%', fill:'blak', style:'font-weight:bold'},
        },
        array_input:['vozduh_gc_1', 'vozduh_gc_2'],
        change_array_input:function(data)
        {
            var v1 = data[0];
            var v2 = data[1];
            let val = 0;
            if(v1 && v2){
               val = Number(v1)+Number(v2) 
            }
            else if(v1) { val = Number(v1)*2;} else if(v2){ val = Number(v2)*2; } else {val = 0;}
            if (val>100) val = 100;
            
            this.value(Math.round(val));
        }
     },

     scale_razrezhenie:{
        type:'round_scale',
        array_connect:['razrejenie'],
        attr:{
            x:50,
            y:575
        },
        title:'Разрежение',
        min:-400,
        max:1,
        begin:45,
        inversion:1,
        color_line:'red', //Цвет шкалы
        caption:{
            color:'red',
            after:'Па'
        },
        //label_zad:true,
        arr_numbers:[0,-80,-160,-240,-320,-400],
        scheme_color:[ 
            {
                color:'red',
                start:0,
                end:60 
            }, 
            {
                color:'orange',
                start:61,
                end:90 
            }, 
            {
                color:'yellow',
                start:90,
                end:120 
            }, 
            {
                color:'#00E800',
                start:130,
                end:360 
            }, 

           ],
        scale:0.7,
        click:function()
        {
            getChartCanvas('/oven/chart/oven_param');
        }
     },

scale_davlenie:{
        type:'round_scale',
        array_connect:['davlenie','davlenie_zad','rezhim', 'davlenie_pechi_otjiga'],
        rezhim_bit:0,
        title:'Давление в печи',
        attr:{
            x:270,
            y:570
        },
        value:{ type:'float', precision:2 },
        value_zad:{ type:'float', precision:2 },
        min:-30,
        max:30,
        begin:45,
        inversion:0,
        color_line:'red', //Цвет шкалы
        caption:{
            color:'red',
            after:'Па',
        },
        arr_numbers:[-30,-20,-10,0,10,20,30],
        label_zad:true,
        label_rezhim:true,
        label_tree:true,
        scheme_color:[ 
            {
                color:'red',
                start:0,
                end:20 
            }, 
            {
                color:'orange',
                start:45,
                end:90 
            }, 
            {
                color:'#00E800',
                start:87,
                end:120 
            }, 
            {
                color:'orange',
                start:173,
                end:360 
            }, 
            {
                color:'red',
                start:220,
                end:360 
            }, 

           ],
        scale:0.7,
        click:function()
        {
            getChartCanvas('/oven/chart/oven_param');
        }
     },

scale_gaz:{
        type:'round_scale',
        array_connect:['gaz_tek','gaz_zad','rezhim'],
        rezhim_bit:3,
        title:'Расход газа',
        attr:{
            x:470,
            y:570
        },
        min:0,
        max:1500,
        begin:45,
        inversion:0,
        color_line:'red', //Цвет шкалы
        caption:{
            color:'red',
            after:'м3/ч',
        },
        arr_numbers:[0,300,600,900,1200,1500],
        label_zad:true,
        label_rezhim:true,
        scheme_color:[ 
            {
                color:'red',
                start:0,
                end:20 
            }, 
            {
                color:'orange',
                start:35,
                end:90 
            }, 
            {
                color:'yellow',
                start:53,
                end:100
            },
            {
                color:'#00E800',
                start:100,
                end:120 
            }, 
            {
                color:'yellow',
                start:160,
                end:360 
            }, 
            {
                color:'orange',
                start:190,
                end:220 
            }, 
            {
                color:'red',
                start: 220,
                end:360
            }
           ],
        scale:0.7,
        click:function()
        {
            getChartCanvas('/oven/chart/gas');
        }

     },

scale_rash_vozdux:{
        type:'round_scale',
        array_connect:['rash_vozdux_tek','rash_vozdux_zad','rezhim'],
        rezhim_bit:4,
        title:'Расход воздуха',
        attr:{
            x:680,
            y:570
        },
        min:0,
        max:15000,
        begin:45,
        inversion:0,
        color_line:'red', //Цвет шкалы
        caption:{
            color:'red',
            after:'м3/ч',
        },
        arr_numbers:[0,2500,5000,7500,10000,12500,15000],
        label_zad:true,
        label_rezhim:true,
        scheme_color:[ 
            {
                color:'red',
                start:0,
                end:20 
            }, 
            {
                color:'orange',
                start:35,
                end:90 
            }, 
            {
                color:'yellow',
                start:53,
                end:100
            },
            {
                color:'#00E800',
                start:100,
                end:120 
            }, 
            {
                color:'yellow',
                start:160,
                end:360 
            }, 
            {
                color:'orange',
                start:190,
                end:220 
            }, 
            {
                color:'red',
                start: 220,
                end:360
            }
           ],
        scale:0.7,
        click:function()
        {
            getChartCanvas('/oven/chart/oven_param');
        }
     },

    zagruzchik1:{
        type:'zagruzchik',
        label_rezhim_bit:0,
        array_connect:['zagr_1_speed', 'rezhim3'],
        attr:{
            x:535,
            y:410
        }
    },

    zagruzchik1_rez:{
        type:'label', 
        value:{bit:0}, 
        connect:'rezhim3',
        attr:{
            x:520,
            y:490,
            width:80, 
            height:20,
            caption:{
                style:'font-weight:bold',
                fill:'white',
            }, 
            background:{fill:'lime',stroke:'white','stroke-width':2}    
        },
        caption:'Р',
        dynamic:{ 
             fon:{settings:[['0','red'],['1','lime']]},
             text:{settings:[['0','Наладка'],['1','Автомат']]},
        },
    },

    zagruzchik_speed1:{
        type:'scale',
        connect:'zagr_1_speed',
        value:{type:'float'},
        attr:{
            x:600,
            y:430,
            max:100,
            min:0,
            width:40,
            height:50,
            background:{'fill':'white', 'stroke':'white'},
            scale:{fill:'blue'},
            caption:{after:'%', fill:'blak', style:'font-weight:bold'},
        },
             
    },

    zagruzchik2:{
        type:'zagruzchik',
        label_rezhim_bit:6,
        array_connect:['zagr_2_speed', 'rezhim3'],
        attr:{
            x:535,
            y:115
        },
        inversion:true,
        rotate:180
    },

    zagruzchik2_rez:{
        type:'label', 
        value:{bit:6}, 
        connect:'rezhim3',
        attr:{
            x:520,
            y:80,
            width:80, 
            height:20,
            caption:{
                style:'font-weight:bold',
                fill:'white',
            }, 
            background:{fill:'lime',stroke:'white','stroke-width':2}    
        },
        caption:'Р',
        dynamic:{ 
             fon:{settings:[['0','red'],['1','lime']]},
             text:{settings:[['0','Наладка'],['1','Автомат']]},
        },
    },

    zagruzchik_speed2:{
        type:'scale',
        connect:'zagr_2_speed',
        value:{type:'float'},
        attr:{
            x:600,
            y:110,
            max:100,
            min:0,
            width:40,
            height:50,
            background:{'fill':'white', 'stroke':'white'},
            scale:{fill:'blue'},
            caption:{after:'%', fill:'blak', style:'font-weight:bold'},
        },
             
    },

   }

}