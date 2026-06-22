var _PTL_ = {
    box:'scheme-ptl',
    lighthouse:true,
    style:{
       width:'1200',
       height:'700',
       fill:'top-#987F98-white-#987F98', 
   },
   'class':{
        ptl_label1:{width:40, height:23, caption:{style:'font-weight:bold',fill:'yellow',style:'font-size:14px; font-weight:bold'}},
        label1:{width:75, height:23, caption:{style:'font-weight:bold',fill:'#AD0000',style:'font-size:14px; font-weight:bold'}, background:{fill:'white',stroke:'#AD0000','stroke-width':2}},
        label2:{width:75, height:23, caption:{style:'font-weight:bold',fill:'green',style:'font-size:14px; font-weight:bold'}, background:{fill:'white',stroke:'green','stroke-width':2}},
        label3:{width:75, height:20, caption:{style:'font-weight:bold',fill:'white'}, background:{fill:'lime',stroke:'white','stroke-width':2}},
     pipe1:{width:7, fill:'bottom-black-#808080-#a9aca1-#808080',stroke:'black',round_corners:true},  

   },

   drawing:[
     {
        type:'pattern',
        attr:{id:'_brick_',patternUnits:"userSpaceOnUse", x:"0", y:"0", width:"15", height:"15"},
        draw:{
           
        }
     },  
   ],

   objects:{

    ptl_table:{
        type:'ptl_table',
        array_connect:[
             'global_proizvod_v_pechi',
             's_shz', //Соотношение шихты задание 
             'ygar', //Процент угара шихты (в печи)
             'proc_soot_stekla',
             'obsh_proizvod_na_lente',
             'dvnd_90',
             'dvnd_89',
             'zagruzh_v_left_tek', //7
             'zagruzh_v_right_tek', //8
             'zagr_chihta_v_pech', //9
             'zagr_sb_v_pech', //10
             'zagr_total_v_pech', //11
             'sootnoshenie_shihta', //12
             'sootnoshenie_sb', //13
             'load_left', //Загружено в левый последнее
             'load_right',
             'load_sh', //Загруженно шихты в печь кг
             'load_st', //Загруженно с/боя в печь кг.
             'load_sh_st', //Загруженно всего в печь кг.
             's_sh', //Соотношение шихты в %
             's_st', //Соотношение с/боя в % //20
             'day_begin',
             'month_begin',
             'hour_begin',
             'm_begin',
             'day_end', // 25
             'month_end', 
             'hour_end',
             'm_end',
             'hour_tek', //28
             'm_tek'

        ],
        attr:{
            x:-37,
            y:530
        },
        scale:0.9
    },

    convier87:{
        type:'transport_line',
        array_connect:['konveer_len_87_speed', 'dvizh_convier', 'konveer_distancion', 'errors1'],
        attr:{
            x:140,
            y:100
        },
        caption:{
            before: 'Конвеер ленточный 87   ( ', after: ' м/с )'
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 8) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 4) );
            obj.indicator_err.value( obj.e.get_bit(arr[3], 5) || obj.e.get_bit(arr[3], 6) );
        }
    },

    convier82:{
        type:'transport_line',
        array_connect:['konveer_len_82_speed', 'dvizh_convier', 'konveer_lentoch_82_distancion', 'errors1'],
        attr:{
            x:450,
            y:140,
            width:200
        },
        caption:{
            before: 'Конвеер 82   ( ', after: ' м/с )'
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 12) ); //Движение
            obj.rezhim.value( obj.e.get_bit(arr[2], 0) );
            obj.indicator_err.value( obj.e.get_bit(arr[3], 9) || obj.e.get_bit(arr[3], 10) );
        }
    },

     b_106:{
        type:'tank', 
        array_connect:['produkt_106', 'errors'],
        on_array_connect:function(obj, arr)
        {
            let v = arr[1];
            obj.indicator_err.value(( (v & Math.pow(2, 12)) || (v & Math.pow(2, 13)) || (v & Math.pow(2, 14)) )?1:0);              
        },
        title:'Бункер запаса & шихты 106',
        color:'#00595A',
        attr:{x:735, y:180,width:120,height:110},
        level:{min:0, max:5000, scale:{ fill:'grey' },background:{stroke:"#428A8C"},width:32},
        cone:true,
        caption:true,
        //scale:0.8
     }, 

    convier83:{
        type:'transport_line',
        array_connect:['konveer_len_83_speed', 'dvizh_convier', 'konveer_lentoch_83_distancion', 'errors1'],
        attr:{
            x:10,
            y:140,
            width:430
        },
        caption:{
            before: 'Конвеер ленточный 83   ( ', after: ' м/с )'
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 9) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 0) );
            obj.indicator_err.value( obj.e.get_bit(arr[3], 8) || obj.e.get_bit(arr[3], 7) );
        }
    },

    convier84:{
        type:'transport_line',
        array_connect:['konveer_len_84_speed', 'dvizh_convier', 'konveer_distancion', 'errors1'],
        attr:{
            x:180,
            y:260,
            width:300
        },
        caption:{
            before: 'Конвеер ленточный 84   ( ', after: ' м/с )'
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 13) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 0) );
            obj.indicator_err.value( obj.e.get_bit(arr[3], 11) || obj.e.get_bit(arr[3], 12) );
        }
    },

    convier85:{
        type:'transport_line',
        array_connect:['konveer_len_85_speed', 'dvizh_convier', 'konveer_lentoch_85_distancion', 'errors1'],
        attr:{
            x:210,
            y:350,
            width:330
        },
        caption:{
            before: 'Конвеер ленточный 85   ( ', after: ' м/с )'
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 14) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 0) );
            obj.indicator_err.value( obj.e.get_bit(arr[3], 13) || obj.e.get_bit(arr[3], 14) );
        }
    },

    conus70_3:{
        type:'conus',
        attr:{
            x:140,
            y:285,
            width:60,
            height:50
        },
        factor:15,
        color:'#536872',
        title:'70_3'

    },

     pereklkych_70_3_l:{
      type:'track', 
      connect:'shtan_perec_70_3',
            value:{bit:1}, 
            attr:{x:140, y:300, width:15, line:[['l',30],['d', 50]],
                stroke:'black',round_corners:true
            },
           'class':'pipe1',
            dynamic:{
               fill:{ settings:[['1','orange'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
     },


     pereklkych_70_3_r:{
      type:'track', 
      connect:'shtan_perec_70_3',
            value:{bit:2}, 
            attr:{x:200, y:313, width:15, line:[['r',20],['d', 35]],
                stroke:'black',round_corners:true
            },
           'class':'pipe1',
            dynamic:{
               fill:{ settings:[['1','orange'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
     },


    conus71:{
        type:'conus',
        attr:{
            x:830,
            y:100,
            width:60,
            height:50
        },
        factor:15,
        color:'#536872',
        title:'70_1'

    },

     pereklkych_106:{
      type:'track', 
      connect:'shtan_perec_70_1',
            value:{bit:3}, 
            attr:{x:835, y:120, width:15, line:[['l',30],['d', 50]],
                stroke:'black',round_corners:true
            },
           'class':'pipe1',
            dynamic:{
               fill:{ settings:[['1','orange'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
     },

     pereklkych_105_1:{
      type:'track', 
      connect:'shtan_perec_70_1',
            value:{bit:2}, 
            attr:{x:885, y:135, width:15, line:[['r',20],['d', 35]],
                stroke:'black',round_corners:true
            },
           'class':'pipe1',
            dynamic:{
               fill:{ settings:[['1','orange'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
     },

    conus72:{
        type:'conus',
        attr:{
            x:970,
            y:100,
            width:60,
            height:50
        },
        factor:15,
        color:'#536872',
        title:'70_1'

    },

     pereklkych_72105_1:{
      type:'track', 
      connect:'dnvd90_rezh',
            value:{bit:3}, 
            attr:{x:975, y:120, width:15, line:[['l',30],['d', 50]],
                stroke:'black',round_corners:true
            },
           'class':'pipe1',
            dynamic:{
               fill:{ settings:[['1','orange'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
     },

     pereklkych_72105_2:{
      type:'track', 
      connect:'dnvd90_rezh',
            value:{bit:2}, 
            attr:{x:1025, y:135, width:15, line:[['r',20],['d', 35]],
                stroke:'black',round_corners:true
            },
           'class':'pipe1',
            dynamic:{
               fill:{ settings:[['1','orange'],['0','bottom-black-#808080-#a9aca1-#808080']] } 
            } 
     },

    convier88:{
        type:'transport_line',
        array_connect:['chastota_konvier_88', 'dvizh_convier', 'konveer_lentoch_88_distancion', 'errors_W7'],
        attr:{
            x:660,
            y:540,
            width:370
        },
        caption:{
            before: 'Конвеер ленточный 88   ( ', after: ' м/с )'
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 0) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 0) );
            obj.indicator_err.value( obj.e.get_bit(arr[3], 0) || obj.e.get_bit(arr[3], 7) );
        }
    },

     b_108:{
        type:'tank', 
        array_connect:['produkt_108', 'errors'],
        on_array_connect:function(obj, arr)
        {
            let v = arr[1];
            obj.indicator_err.value(( (v & Math.pow(2, 0)) || (v & Math.pow(2, 1)) || (v & Math.pow(2, 2)) )?1:0);              
        },
        title:'Бункер запаса & стеклобоя 108',
        color:'#00595A',
        attr:{x:50, y:360,width:140,height:120},
        level:{min:0, max:25000, scale:{ fill:'grey' },background:{stroke:"#428A8C"},width:32},
        cone:true,
        caption:true,
        //scale:0.8
     }, 

    conus89:{
        type:'conus',
        attr:{
            x:660,
            y:480,
            width:90,
            height:40
        },
        factor:15,
        color:'#536872',
        title:'ДНВД 89М'

    },
    dnvd89_tek:{
        type:'label',
        connect:'dnvd_steclo_proiz_tek',
        'class': 'label2',
        value:{type:'float', precision:2, after:' т/ч'},
        attr:{
            x:755, y:450
        },
        click:function()
        {
            getChartCanvas('/ptl/chart/dnvd');
        }         
    },
    dnvd89_zad:{
        type:'label',
        connect:'dnvd_steclo_proizvod_zadnie',
        'class': 'label1',
        value:{type:'float', precision:2,  after:' т/ч'},
        attr:{
            x:755, y:475
        },
        click:function()
        {
            getChartCanvas('/ptl/chart/dnvd');
        }          
    },

     dnvd89_rezh:{
        type:'label', connect:'konveer_lentoch_85_distancion', value:{bit:4}, caption:'Р',attr:{x:755,y:500},'class':'label3',
        dynamic:{ 
             fon:{settings:[['1','lime'],['0','red']]},
             text:{settings:[['1','Д'],['0','Р']]},
        },
        click:function()
        {
            getChartCanvas('/ptl/chart/dnvd');
        }          
     },

    conus90:{
        type:'conus',
        attr:{
            x:850,
            y:480,
            width:90,
            height:40
        },
        factor:15,
        color:'#536872',
        title:'ДНВД 90М'

    },

    dnvd90_tek:{
        type:'label',
        connect:'dnvd_shihta_proizvod_tek',
        'class': 'label2',
        value:{type:'float', precision:2, after:' т/ч'},
        attr:{
            x:950, y:450
        },
        click:function()
        {
            getChartCanvas('/ptl/chart/dnvd');
        }          
    },
    dnvd90_zad:{
        type:'label',
        connect:'dnvd_shihta_proizvod_zadanie',
        'class': 'label1',
        value:{type:'float', precision:2,  after:' т/ч'},
        attr:{
            x:950, y:475
        },
        click:function()
        {
            getChartCanvas('/ptl/chart/dnvd');
        }          
    },

     dnvd90_rezh:{
        type:'label', connect:'dnvd90_rezh', value:{bit:4}, caption:'Р',attr:{x:950,y:500},'class':'label3',
        dynamic:{ 
             fon:{settings:[['1','lime'],['0','red']]},
             text:{settings:[['1','Д'],['0','Р']]},
        },
        click:function()
        {
            getChartCanvas('/ptl/chart/dnvd');
        }          
     },

     b_109:{
        type:'tank', 
        array_connect:['produkt_109', 'errors'],
        on_array_connect:function(obj, arr)
        {
            let v = arr[1];
            obj.indicator_err.value(( (v & Math.pow(2, 3)) || (v & Math.pow(2, 4)) || (v & Math.pow(2, 5)) )?1:0);              
        },
        title:'Бункер запаса & стеклобоя 109',
        color:'#00595A',
        attr:{x:500, y:390,width:130,height:120},
        level:{min:0, max:5000, scale:{ fill:'grey' },background:{stroke:"#428A8C"},width:32},
        cone:true,
        caption:true,
        //scale:0.8
     }, 

     b_107:{
        type:'tank', 
        array_connect:['errors', 'errors'],
        on_array_connect:function(obj, arr)
        {
            let v = arr[1];
            obj.indicator_err.value(( (v & Math.pow(2, 0)) || (v & Math.pow(2, 1)) || (v & Math.pow(2, 2)) )?1:0);              
        },
        title:'Бункер приемный & стеклобоя 107',
        color:'#536872',
        attr:{x:20, y:50,width:120,height:70},
        cone:true,
     }, 

     b_74:{
        type:'tank', 
        array_connect:['errors', 'errors'],
        on_array_connect:function(obj, arr)
        {
            let v = arr[1];
            obj.indicator_err.value(( (v & Math.pow(2, 0)) || (v & Math.pow(2, 1)) || (v & Math.pow(2, 2)) )?1:0);              
        },
        title:'Дробилка 74',
        color:'#536872',
        attr:{x:400, y:170,width:100,height:70},
        cone:true,
     },

     indicator_drob:{
        type:'circle',
        attr:{
            cx:430,
            cy:220,
            r:15,
            fill:'none',
            stroke:'#E55C00',
            'stroke-width':5,
            'stroke-dasharray':'10,10'
        },
        change:function()
        {
/*            if(this.value() < 1 || chastota.value()==0)
            { 
               this.propeller.rotate(false); 
            }else
            {
              this.propeller.rotate({dur:5000});                                 
            }*/
        },
        rotate:{ dur:3000 }

     },


     b_105_2:{
        type:'tank', 
        array_connect:['produkt_105_2', 'errors'],
        on_array_connect:function(obj, arr)
        {
            let v = arr[1];
            obj.indicator_err.value(( (v & Math.pow(2, 9)) || (v & Math.pow(2, 10)) || (v & Math.pow(2, 11)) )?1:0);              
        },
        title:'Бункер запаса & шихты 105_2',
        color:'#00595A',
        attr:{x:1000, y:180,width:135,height:200},
        level:{min:0, max:60000, scale:{ fill:'grey' },background:{stroke:"#428A8C"},width:32},
        cone:true,
        caption:true,
     }, 

     b_105_1:{
        type:'tank', 
        array_connect:['produkt_105_1', 'errors'],
        on_array_connect:function(obj, arr)
        {
            let v = arr[1];
            obj.indicator_err.value(( (v & Math.pow(2, 8)) || (v & Math.pow(2, 7))  )?1:0);              
        },
        title:'Бункер запаса & шихты 105_1',
        color:'#00595A',
        attr:{x:860, y:180,width:135,height:200},
        level:{min:0, max:60000, scale:{ fill:'grey' },background:{stroke:"#428A8C"},width:32},
        cone:true,
        caption:true,
     },

    allevat_77:{
        type:'transport_line',
        array_connect:['dwijen_allevat_77_mc', 'dvizh_convier', 'konv_80_v_distancion', 'errors_W7'],
        attr:{
            x:600,
            y:290,
            width:250
        },
        caption:{
            before: 'Элеватор 77   ( ', after: ' м/с )'
        },
        rotate:90,
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 3) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 4) );
            obj.indicator_err.value( obj.e.get_bit(arr[3], 5) || obj.e.get_bit(arr[3], 12) || obj.e.get_bit(arr[3], 14) );
        }
    },

    allevat_78:{
        type:'transport_line',
        array_connect:['dwijen_allevat_78_mc', 'dvizh_convier', 'konv_56_v_distancion', 'errors_W7'],
        attr:{
            x:1040,
            y:290,
            width:250
        },
        caption:{
            before: 'Элеватор 78   ( ', after: ' м/с )'
        },
        rotate:90,
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 4) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 4) );
            obj.indicator_err.value( obj.e.get_bit(arr[3], 15) || obj.e.get_bit(arr[3], 13) || obj.e.get_bit(arr[3], 6) );
        }
    },

     b_103:{
        type:'tank', 
        array_connect:['produkt_103', 'errors', 'errors1'],
        on_array_connect:function(obj, arr)
        {
            let v = arr[1]; //W8
            let v2 = arr[2]; //W9
            obj.indicator_err.value(( (v2 & Math.pow(2, 1)) || (v2 & Math.pow(2, 0)) || (v & Math.pow(2, 15)) )?1:0);              
        },
        title:'Бункер запаса & стеклобоя 103',
        color:'#00595A',
        attr:{x:900, y:550,width:135,height:135},
        level:{min:0, max:10000, scale:{ fill:'grey' },background:{stroke:"#428A8C"},width:32},
        cone:true,
        caption:true,
        scale:0.8
     },

     b_114:{
        type:'tank', 
        array_connect:['produkt_114', 'errors1'],
        on_array_connect:function(obj, arr)
        {
            let v = arr[1];
            obj.indicator_err.value(( (v & Math.pow(2, 2)) || (v & Math.pow(2, 3)) || (v & Math.pow(2, 4)) )?1:0);              
        },
        title:'Бункер запаса & стеклобоя 114',
        color:'#00595A',
        attr:{x:1030, y:550,width:135,height:135},
        level:{min:0, max:10000, scale:{ fill:'grey' },background:{stroke:"#428A8C"},width:32},
        cone:true,
        caption:true,
        scale:0.8
     },

    conus104:{
        type:'conus',
        attr:{
            x:850,
            y:5,
            width:200,
            height:50
        },
        factor:15,
        color:'#536872',
        title:'Бункер приемный шихты'

    },

    shnek80:{
        type:'transport_line',
        array_connect:['shnek_80_chast_vrachen', 'dvizh_convier', 'konv_80_v_distancion' ],
        attr:{
            x:800,
            y:60,
            width:120
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 1) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 0) );
        }
    },

    shnek56:{
        type:'transport_line',
        array_connect:['shnek_56_chast_vrachen', 'dvizh_convier', 'konv_56_v_distancion' ],
        attr:{
            x:970,
            y:60,
            width:120
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 1) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 0) );
        }
    },

    shnek59:{
        type:'transport_line',
        array_connect:['konveer_shnek_59_chast', 'dvizh_convier', 'konv_56_v_distancion' ],
        attr:{
            x:830,
            y:425,
            width:120
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 5) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 0) );
        }
    },

    shnek81:{
        type:'transport_line',
        array_connect:['konveer_shnek_81_chast', 'dvizh_convier', 'konv_81_v_distancion' ],
        attr:{
            x:1040,
            y:425,
            width:120
        },
        on_array_connect:function(obj, arr)
        {
            obj.conveier.value( obj.e.get_bit(arr[1], 6) );
            obj.rezhim.value( obj.e.get_bit(arr[2], 0) );
        }
    },

    dnvd89_chnek:{
        type:'rect',
        connect:'konveer_lentoch_85_distancion',
        value:{bit:7},
        attr:{
         x:675, y:522, width:60, height:12,
         fill:'gray',
         stroke:'black',
         'stroke-dasharray': '7,7',
         rx:"5", 
        }, 
       dynamic:{ fill:{ settings:[ ['0', 'gray'],['1','#207B74'] ] } },
       flicker:{value:'=1',delay:700, attr:{ 'stroke-dashoffset': '7' }} 
    },

    dnvd90_chnek:{
        type:'rect',
        connect:'dnvd90_rezh',
        value:{bit:7},
        attr:{
         x:865, y:522, width:60, height:12,
         fill:'gray',
         stroke:'black',
         'stroke-dasharray': '7,7',
         rx:"5", 
        }, 
       dynamic:{ fill:{ settings:[ ['0', 'gray'],['1','#207B74'] ] } },
       flicker:{value:'=1',delay:70, attr:{ 'stroke-dashoffset': '7' }} 
    }

   }
}