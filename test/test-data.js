
setHtmlPage("bind-ui","10em");	//html page setting

var ht= ( typeof module==="object" && module.exports ) ? require("../bind-ui.js") : require( "bind-ui" );

testData={		//global variable
	
	"bindByName()": function(done){
		ht.addCssText(
			".ht-selected{"+
				"background:lavender;"+
			"}"+
			".ht-selected:hover{"+
				"background:#F0F0FA;"+
			"}"+
			""
		);

		ht('divResult3').innerHTML='\
			<span name=sp-on class=ht-cmd onclick="alert(\'original click 1, on\')">on</span>, \
			<span name=sp-event class=ht-cmd onclick="alert(\'original click 2, evt\')">event</span>, <br>\
		\
			<span name=sp-attr class=ht-cmd id=sp-attr-id >attr</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.attr_title)\'>get attr</span> \
			<span class=ht-cmd onclick=\'myObj.attr_title=new Date()\'>set attr</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'sp-attr-id\').getAttribute( \'title\'))\">getAttribute()</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-attr-id\').setAttribute( \'title\', \'attr-\'+(new Date()) )\">setAttribute()</span> <br>\
		\
			<span name=sp-attr2 class=ht-cmd id=sp-attr2-id >attr2</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.attr_title)\'>get attr</span> \
			<span class=ht-cmd onclick=\"myObj.attr_title=\'attr3-\'+(new Date())\">set attr</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'sp-attr2-id\').getAttribute( \'title\'))\">getAttribute()</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-attr2-id\').setAttribute( \'title\', \'attr4-\'+(new Date()) )\" style=\'margin-right:2em;\'>setAttribute()</span> //bi-direction<br>\
		\
			<input name=inp1 value=111 id=inp1-id></input>, \
			<span class=ht-cmd onclick=\'alert(myObj.inp_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.inp_v=\'v-\'+(new Date())\">set v</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'inp1-id\').value)\">get prop</span> \
			<span class=ht-cmd onclick=\"ht(\'inp1-id\').value= \'v2-\'+(new Date());ht.dispatchEventByName(\'inp1-id\',\'change\')\" style=\'color:gray;\' title=\'no effect\'>set prop+dispatchEvent()</span> <br>\
		\
			<input name=inp2 value=222 id=\'inp2-id\'></input>, \
			<span class=ht-cmd onclick=\'alert(myObj.inp_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.inp_v=\'v3-\'+(new Date())\">set v</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'inp2-id\').value)\">get prop</span> \
			<span class=ht-cmd onclick=\"ht(\'inp2-id\').value= \'v4-\'+(new Date());ht.dispatchEventByName(\'inp2-id\',\'change\')\" style=\'color:gray;margin-right:2em;\' title=\'effective, but not recommend, and had better use [set v]\'>set prop+dispatchEvent(change)</span>  //bi-direction<br>\
		\
			<input name=inp3 value=333 id=\'inp3-id\'></input>, \
			<span class=ht-cmd onclick=\'alert(myObj.inp_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.inp_v=\'v5-\'+(new Date())\">set v</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'inp3-id\').value)\">get prop</span> \
			<span class=ht-cmd onclick=\"ht(\'inp3-id\').value= \'v6-\'+(new Date());ht.dispatchEventByName(\'inp3-id\',\'input\')\" style=\'color:gray;margin-right:2em;\' title=\'effective, but not recommend, and had better use [set v]\'>set prop+dispatchEvent(input)</span>  //\'input\' event<br>\
		\
			<input name=inp4 value=444 id=\'inp4-id\'></input>, \
			<span class=ht-cmd onclick=\'alert(myObj.inp_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.inp_v=\'v7-\'+(new Date())\">set v</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'inp4-id\').value)\">get prop</span> \
			<span class=ht-cmd onclick=\"ht(\'inp4-id\').value= \'v8-\'+(new Date());\" style=\'margin-right:2em;\' title=\'effective\'>set prop</span>  //watchJs<br>\
		\
			<span name=sp-html id=sp-html-id >5555</span>, \
			<span class=ht-cmd onclick=\"ht(\'sp-html-id\').innerHTML=\'<b>hhhh</b> \'+(new Date())\" style=\'margin-right:2em;\'>set</span> //innerHTML<br>\
		\
			<span name=sp-text id=sp-text-id >666</span>, \
			<span class=ht-cmd onclick=\"ht(\'sp-text-id\').textContent=\'<b>ttt</b> \'+(new Date())\" style=\'margin-right:2em;\'>set</span>  //textContent<br>\
		\
			<span name=sp-display id=sp-display-id >777</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.dis_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.dis_v=\'none\'\">set v1=none</span> \
			<span class=ht-cmd onclick=\"myObj.dis_v=\'\'\">set v1=</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'sp-display-id\').style.display)\">get style</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-display-id\').style.display= \'none\';\">set style=none</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-display-id\').style.display= \'\';\">set style=</span> <br>\
		\
			<label><input name=sp-display-chk id=\'sp-display-chk-id\' type=checkbox ></input> hide</label> \
			<label><input name=sp-display-chk2 id=\'sp-display-chk2-id\' type=checkbox ></input> show</label>\
			<span class=ht-cmd onclick=\"ht(\'sp-display-chk2-id\').checked=true\">set true</span>\
			<span class=ht-cmd onclick=\"ht(\'sp-display-chk2-id\').checked=false\">set false</span> <br>\
		\
			<span name=sp-display2 id=sp-display2-id >888</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.dis_v2)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.dis_v2=true\">set v2=true</span> \
			<span class=ht-cmd onclick=\"myObj.dis_v2=false\">set v2=fase</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'sp-display2-id\').style.display)\">get style</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-display2-id\').style.display= \'none\';\">set style=none</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-display2-id\').style.display= \'\';\" style=\'margin-right:2em;\'>set style=</span>  //boolean value<br>\
		\
			<label><input name=sp-display2-chk id=\'sp-display2-chk-id\' type=checkbox ></input> hide</label> \
			<label><input name=sp-display2-chk2 id=\'sp-display2-chk2-id\' type=checkbox ></input> show</label>\
			<span class=ht-cmd onclick=\"ht(\'sp-display2-chk2-id\').checked=true\">set true</span>\
			<span class=ht-cmd onclick=\"ht(\'sp-display2-chk2-id\').checked=false\">set false</span><br>\
		\
			<span name=sp-cls id=sp-cls-id >999</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.cls_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.cls_v=true\">set v=true</span> \
			<span class=ht-cmd onclick=\"myObj.cls_v=false\">set v=false</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'sp-cls-id\').className)\">get className</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-cls-id\').className= \'ht-selected\';\">set className=ht-selected</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-cls-id\').className= \'\';\">set className=</span> <br>\
		\
			<span name=sp-cls2 id=sp-cls2-id >aaa</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.cls2_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.cls2_v=true\">set v=true</span> \
			<span class=ht-cmd onclick=\"myObj.cls2_v=false\">set v=false</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'sp-cls2-id\').className)\">get className</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-cls2-id\').className= \'ht-selected\';\">set className=ht-selected</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-cls2-id\').className= \'\';\" style=\'margin-right:2em;\'>set className=</span> //not<br>\
		\
			<span name=sp-cls3 id=sp-cls3-id >bbb</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.cls3_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.cls3_v=\'state aa\'\">set state=aa</span> \
			<span class=ht-cmd onclick=\"myObj.cls3_v=\'state bb\'\">set state=bb</span> \
			<span class=ht-cmd onclick=\"alert(ht(\'sp-cls3-id\').className)\">get className</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-cls3-id\').className= \'ht-selected\';\">set className=ht-selected</span> \
			<span class=ht-cmd onclick=\"ht(\'sp-cls3-id\').className= \'\';\" style=\'margin-right:2em;\'>set className=</span> //string<br>\
			<span name=sp-cls3-txt >bbb</span> <br>\
		<br><br><br>';

		var myObj={
			func1: function(){alert( 'func1' );},
			attr_title: 'aaaaaa',
			inp_v: 'bbb',
			dis_v: '',
			dis_v2: false,
			cls_v: false,
			cls2_v: false,
			cls3_v: 'state aa',
		};
		window.myObj=myObj;

		var myConfig=[
			['sp-on'	,'on'		,'click'	,'func1'],
			['sp-event'	,'event'	,'click'	,'func1'],
			[			,			,			,function(){alert('inline func3')} ],
			['sp-attr'	,'attr'		,'title'	,'attr_title'],
			['sp-attr2'	,'attr'		,'title'	,'attr_title', true ],		//bi-direction
			[			,			,			,function(){alert('inline func attr2')} ], 
			['inp1'	,'prop'		,'value'	,'inp_v' ], 
			['inp2'	,'prop'		,'value'	,'inp_v',	true /* { biDirection:true } */ ],		//bi-direction
			['inp3'	,'prop'		,'value'	,'inp_v',	'input' /* { notifyEvent:'input' } */ ], 		//'input' event
			['inp4'	,'prop'		,'value'	,'inp_v',	0x2 /* { watchJs:true } */ ], 		//watchJs

			['sp-html'	,'prop'		,'innerHTML'	,'inp_v',	0x2 /* { watchJs:true } */ ], 		//watchJs
			['sp-text'	,'prop'		,'textContent'	,'inp_v',	0x2 /* { watchJs:true } */ ], 		//watchJs

			['sp-display'	,'style'		,'display'	,'dis_v',	true ],
			['sp-display-chk'	,'prop'		,'checked'	,'dis_v',	{ biDirection:true, valueMapper:{true:'none',false:''}} ],
			['sp-display-chk2'	,'prop'		,{typeItem:'checked',valueMapper:{'':true,'none':false}}	,'dis_v',	{ biDirection:true, watchJs:true, valueMapper:{true:'',false:'none'}} ],

			['sp-display2'	,'style'		,{typeItem:'display',valueMapper:{false:'none',true:''}}	,'dis_v2',	{ biDirection:true, valueMapper:{'none':false,'':true}} ],
			['sp-display2-chk'	,'prop'		,{typeItem:'checked',valueMapper:{true:false,false:true}}	,'dis_v2',	{ biDirection:true, valueMapper:{true:false,false:true}} ],
			['sp-display2-chk2'	,'prop'		,'checked'	,'dis_v2',	0x2 ],

			['sp-cls'	,'class'		,'ht-selected'	,'cls_v',	true ],
			['sp-cls2'	,'class'		,{typeItem:'ht-selected',valueMapper:{true:false,false:true}}	,'cls2_v',		{ biDirection:true, valueMapper:{true:false,false:true}} ],
			['sp-cls3'	,'class'		,{typeItem:'ht-selected',valueMapper:function(v){console.log(v); return v.indexOf('aa')>0;}}	,'cls3_v',		{ biDirection:true, valueMapper:function(v){console.log('js',v); return 'state '+(v?'aa':'bb');}} ],
			['sp-cls3-txt'	,'prop'		,'textContent'		,'cls3_v',  ],
		];

		var ret= ht.bindByName('divResult3',myObj,myConfig);
		if(ret instanceof Error) console.log(ret);
		return !(ret instanceof Error);
	},
	
	"bindUi()": function(done){
		ht('divResult3').innerHTML="<div></div><div></div>";
		
		myObjClass={
			config: {
				cssText: ".my-cls1{color:red;}",
				htmlText: "<span class='my-cls1' name='sp1'>aaaaa</span> "+
					"<label><input name='chk1' type=checkbox ></input>chk1</label> "+
					"<label><input name='chk2' type=checkbox ></input>chk2</label> "+
					"<button name='btn'>toggle</button> " +
					"<button onclick=\"var el= ht.queryByName(this.parentNode,'chk1'); el.checked=!el.checked;\">toggle2</button>" +
					"",
				bindArray:[
					["sp1","class","my-cls1","txtRed",2],
					["chk1","prop","checked","txtRed",2],
					["chk2","prop","checked","txtRed",2],
					["btn","evt","click","toggleRed"],
				],
			},
			
			txtRed: true,
			
			toggleRed: function(){ this.txtRed=!this.txtRed; },
		}
		
		var anyFail=false;
		ht.bindUi( ht('divResult3').childNodes[0], Object.create( myObjClass ), null, function(err,data){ anyFail= anyFail||err; showResult(anyFail||data,2,anyFail||false); } );
		ht.bindUi( ht('divResult3').childNodes[1], Object.create( myObjClass ), null, function(err,data){ anyFail= anyFail||err; showResult(anyFail||data,2,anyFail||false); } );
	},
	
	/*
	//code template
	"": function(done){
		return 

	},
	*/
};
