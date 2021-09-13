
/*
	htm tool.
	
	example:

		var ht= require( "bind-ui" );
		
		var myObj={
			config: {
				cssText: ".my-cls1{color:red;}",
				htmlText: "<span class='my-cls1' name='sp1'>aaaaa</span> "+
					"<label><input name='chk1' type=checkbox ></input>chk1</label> "+
					"<button name='btn'>toggle</button> ",
				bindArray:[
					["sp1","class","my-cls1","txtRed",2],
					["chk1","prop","checked","txtRed",2],
					["btn","evt","click","toggleRed"],
				],
			},
			
			txtRed: true,
			
			toggleRed: function(){ this.txtRed=!this.txtRed; },
		}
		
		ht.bindUi( "div1", myObj );
*/

"use strict";

var ht= require( "htm-tool" );
var cq= require( "callq" );

var findWithFilter= ht.findWithFilter;
var mapValue= ht.mapValue;
var enclosePropertyDescriptor= ht.enclosePropertyDescriptor;
var observeSingleMutation= ht.observeSingleMutation;
var dispatchEventByName= ht.dispatchEventByName;
var formatError= ht.formatError;
var ele= ht.ele;

//////////////////////////////////////////////////////////////////////////////////////////
// bind element & bind by name

/*
	bind item:
		an array to configure element binding,
		[ "namePath", "type", typeOption, member, memberOption ]	//basic format
		where type and typeOption is related to dom object, while member and memberOption is related to js object.
		
		or
		[ "namePath", "type", typeOption | "typeItem", member, memberOption | .biDirection/0x1 | ".notifyEvent" | .watchJs/0x2 ]	//shortcut format
		
			"namePath"
				name path string, refer to queryByName()
			
			"type"
				dom type string
			
			typeOption
				dom type option
				
				".typeItem"
					dom type sub-item string;
					shortcut argument is a string;
				
				.valueMapper
					a value mapper for setting dom item, refer to mapValue().
			
			member
				js member
					"propertyName" | "methodName" | function;
			
			memberOption
				js member option
				
				.biDirection
					set true to bind both from js to dom and from dom to js;
					if not set, bind in default way;
					shortcut argument is a boolean value, or a number value contain 0x1;
					
				.notifyEvent
					set name string of bi-direction notify event ( will automatically set biDirection=true );
					if not set, use default event "change";
					shortcut argument is a string;
				
				.watchJs
					if set true, for type "prop", watch dom property change from js ( will automatically set biDirection=true ).
					shortcut argument is a number value contain 0x2;
				
				.valueMapper
					a value mapper for setting js member, refer to mapValue().
				
		type format:
			
			"on":
				event binding by setting GlobalEventHandlers[ "on" + typeItem ],
				
					[ "namePath", "on", "click", "methodName" | function, extraArgument ]
			
			"event|evt":
				event binding by addEventListener()
				
					[ "namePath", "event|evt", "click", "methodName" | function, extraArgument={ listenerOptions } ]
			
			"attr":
				attribute binding,
				
					[ "namePath", "attr", "title", "propertyName", extraArgument={ biDirection } ]
					[ "namePath", "attr", "title", "methodName" | function, extraArgument ]		//refer to MutationRecord
			
			"style|css":
				style binding
				
					[ "namePath", "style", "display", "propertyName", extraArgument={ biDirection } ]
					[ "namePath", "style", "display", "methodName" | function, extraArgument ]		//will also evoke on any other style change; refer to MutationRecord; 
			
			"class":
				element class binding. default binding member is boolean type.
				
					[ "namePath", "class", "myClass", "propertyName", extraArgument={ biDirection } ]
					[ "namePath", "class", "myClass", "methodName" | function, extraArgument ]		//will also evoke on any other class change; refer to MutationRecord;
			
			"prop":
				property binding,
				
					[ "namePath", "prop", "value", "propertyName", extraArgument={ notifyEvent, biDirection, watchJs } ]
					[ "namePath", "prop", "value", "methodName" | function, extraArgument={ notifyEvent, watchJs, listenerOptions } ]
*/

//bind-item index constant
var BI_NAME_PATH=	0,
	BI_TYPE=		1,
	BI_TYPE_OPTION=	2,
	BI_MEMBER=		3,
	BI_MEMBER_OPTION=	4;

//return Error if fail
var bindElement= function( el, obj, bindItem ){
	
	//-------------------------------------
	//arguments
	
	var elId= ht.eleId(el);
	
	//type
	var type= bindItem[BI_TYPE];
	
	//typeItem, typeOption
	var typeOption= bindItem[BI_TYPE_OPTION], typeItem, domValueMapper;
	if( typeof typeOption==="string" ){ typeItem= typeOption; typeOption= null; }
	else {
		typeItem= typeOption.typeItem;
		domValueMapper= typeOption.valueMapper;
	}
	
	if( !typeItem ) return formatError("bind typeItem empty", bindItem );
	
	//member
	var member= bindItem[BI_MEMBER];
	
	var memberValue;
	if( typeof member==="function" ){ memberValue= member; }
	else if( member in obj ) { memberValue= obj[member]; }
	else return formatError("member unfound", member, bindItem );
	
	var memberIsFunction= ( typeof memberValue==="function" );
	var memberThis= (!memberIsFunction || (memberValue!==member) ) ? obj : null;
	
	//memberOption
	var memberOption= bindItem[BI_MEMBER_OPTION], biDirection, notifyEvent,watchJs,jsValueMapper;
	var typeofMo= typeof memberOption;
	
	if( typeofMo==="boolean" ) { biDirection= memberOption; memberOption= null; }
	else if( typeofMo==="number" ){
		biDirection= memberOption & 0x1;
		watchJs= memberOption & 0x2;
		memberOption= null;
	}
	else if( typeofMo==="string" ){
		if( memberOption ) { notifyEvent= memberOption; memberOption= null; }
	}
	else if(memberOption){
		notifyEvent= memberOption.notifyEvent;
		biDirection= notifyEvent || memberOption.biDirection;
		watchJs= memberOption.watchJs;
		jsValueMapper= memberOption.valueMapper;
	}
	if( ! biDirection && (notifyEvent || watchJs) ) biDirection=true;
	
	//-------------------------------------
	//bind event
	if( type=="on" || type=="event" || type=="evt" ){
		if( !memberIsFunction ) return formatError("bind member is not a function", member, bindItem );
		
		var bindFunc= function(evt){ return memberValue.apply( memberThis || this, [ evt, memberOption]); };
		
		if( type=="on" ){ el["on"+typeItem]= bindFunc; }
		else{ el.addEventListener( typeItem, bindFunc, memberOption && memberOption.listenerOptions ); }
		
		return true;
	}
	
	//-------------------------------------
	//bind attribute group
	if( type==="attr" || type==="style" || type==="css" || type==="class" ){
		//bind attribute event
		if( memberIsFunction ){
			var attrName= ( type==="attr" )? typeItem : type;
			if( attrName==="css" ) attrName= "style";
			
			observeSingleMutation( el, attrName,
				function( mutationItem ){ return memberValue.apply( memberThis || this, [mutationItem, memberOption] ); }
			);
			return true;
		}
		
		var v0;
		if( type==="attr" ){		//bind attribute
			//variable member
			v0= findWithFilter( null, memberValue, mapValue(el.getAttribute(typeItem)||"", jsValueMapper ), "" );
			
			enclosePropertyDescriptor( obj, member,
				function(v){
					v=""+mapValue( v, domValueMapper );
					if( ele(elId).getAttribute(typeItem) !==v ) ele(elId).setAttribute(typeItem,v);
				},
				function(){ return mapValue( ele(elId).getAttribute(typeItem), jsValueMapper ); }
			);
			
			if( biDirection ) {
				observeSingleMutation( el, typeItem,
					function( mutationItem ){ obj[member]= mapValue( mutationItem.target.getAttribute(mutationItem.attributeName)||"", jsValueMapper ); }
				);
			}
		}
		else if( type==="style" || type==="css" ){		//bind style
			//variable member
			var v0= findWithFilter( null, memberValue, mapValue( el.style[typeItem]||"", jsValueMapper ), "" );
			
			enclosePropertyDescriptor( obj, member,
				function(v){
					v=""+mapValue( v, domValueMapper );
					if( ele(elId).style[typeItem] !==v ) ele(elId).style[typeItem]= v;
				},
				function(){ return mapValue( ele(elId).style[typeItem], jsValueMapper ); }
			);
			
			if( biDirection ) {
				observeSingleMutation( el, "style",
					function( mutationItem ){ obj[member]= mapValue( mutationItem.target.style[typeItem]||"", jsValueMapper ); }
				);
			}
		}
		else if( type==="class" ){		//bind class
			//variable member
			var v0= findWithFilter( null, memberValue, mapValue( el.classList.contains(typeItem), jsValueMapper ), false );
			
			enclosePropertyDescriptor( obj, member,
				function(v){
					v= !! mapValue( v, domValueMapper );
					if( v && ! ele(elId).classList.contains(typeItem) ) ele(elId).classList.add(typeItem);
					else if( !v && ele(elId).classList.contains(typeItem) ) ele(elId).classList.remove(typeItem);
				},
				function(){ return mapValue( ele(elId).classList.contains(typeItem), jsValueMapper ); }
			);
			
			if( biDirection ) {
				observeSingleMutation( el, "class",
					function( mutationItem ){ obj[member]= mapValue( mutationItem.target.classList.contains(typeItem), jsValueMapper ); }
				);
			}
		}
		
		//init value
		obj[member]= v0;
		
		return true;
	}
	
	//-------------------------------------
	//bind property
	if( type==="prop" ){
		if( !(typeItem in el ) ) return formatError("bind property unfound", typeItem, bindItem );
		
		//function binding
		if( memberIsFunction ){
			var bindFunc= function(evt){ return memberValue.apply( memberThis || this, [ evt, memberOption]); };
			el.addEventListener( notifyEvent || "change", bindFunc, memberOption && memberOption.listenerOptions );
			if( watchJs ) {
				enclosePropertyDescriptor( el, typeItem,
					function(v){ dispatchEventByName( elId, notifyEvent || "change", 0 ); }
				);
			}
			return true;
		}
		
		//variable member
		var v0= findWithFilter( null, memberValue, mapValue(el[typeItem]||"", jsValueMapper ) );
		
		enclosePropertyDescriptor( obj, member,
			function(v){
				v= mapValue( v, domValueMapper );
				if( ele(elId)[typeItem] !=v ) ele(elId)[typeItem]= v;
			},
			function() { return mapValue( ele(elId)[typeItem], jsValueMapper ); }
		);
		
		if( biDirection ) {
			el.addEventListener( notifyEvent || "change", function(evt){ obj[member]= mapValue( ele(elId)[typeItem], jsValueMapper ); }, memberOption && memberOption.listenerOptions );
		}
		if( watchJs ) {
			enclosePropertyDescriptor( el, typeItem,
				function(v){ dispatchEventByName( elId, notifyEvent || "change", 0 ); }
			);
		}
		
		//init value
		obj[member]= v0;
		
		return true;
	}
	
	return formatError("unknown bind type",type,bindItem );
}

//return Error if fail
var bindByName= function( el, obj, bindItemArray ){
	el=ele(el);
	
	var elLast=el,lastName="";
	var i,imax= bindItemArray.length, bi, ret, namePath;
	
	var nm={			//name mapping;
		"": ht.eleId(elLast)	//map "" to root element
	};
	
	for( i=0;i<imax;i++ ){
		bi= bindItemArray[i];
		namePath= bi[BI_NAME_PATH]||"";
		if( typeof namePath !=="string" ) return formatError("bind name path is not a string", namePath, bi );
		
		if( ! namePath ){	//omitted "namePath"
			bi[BI_NAME_PATH]= lastName;	//fill back omitted "namePath"
			
			if( i ){	//copy other omitted item from previous value
				if( !bi[BI_TYPE] ){
					bi[BI_TYPE]= bindItemArray[i-1][BI_TYPE];	//fill back omitted "type"
					if( !bi[BI_TYPE_OPTION] ) bi[BI_TYPE_OPTION]= bindItemArray[i-1][BI_TYPE_OPTION];	//fill back omitted typeOption | "typeItem"
				}
			}
		}
		else if( namePath!=lastName ){		//new namePath
			elLast= ht.queryByName( el, namePath );
			if( !elLast ) return formatError("bind name path unfound", namePath, bi );
			nm[namePath]= ht.eleId(elLast);
			lastName= namePath;
			
			if( bi.length===1 ) continue;	//only build name mapping
		}
		
		ret= bindElement( elLast, obj, bi );
		if( ret instanceof Error ) return ret;
	}
	return nm;
}

//object member tool, to get name mapping item element.
function nme(name) {
	return (this.nm && (name in this.nm)) ? document.getElementById(this.nm[name]) : null;
}

/*
	async binding dom-ui to js-object
	
	config:
		
		.cssText
		.cssFile
		.cssUrl
		//.cssId			//internal
		
		.htmlText
		.htmlFile
		.htmlUrl
		
		.bindArray
		
		.disableNm		//disable installing name mapping tools
			* if disableNm==false or empty, the following members will be added to `obj`,
				obj.nm= { namePath: elId }
					map name path to element id
				obj.nme( namePath )
					return the element from namePath
*/
var bindUi= function( el, obj, config, cb ){
	//arguments
	if( typeof config==="function" && arguments.length==3 ){ cb= config; config= null; }
	
	if( ! config ){ config= obj.config || obj; }
	
	el= ht(el);
	
	//bind
	cq( null,[
		//try load cssFile or cssUrl to cssText
		function( err, data, que){
			if(err) return ht.Error(err);
			
			if( config.cssId && ht(config.cssId) ) return false;
			if( typeof config.cssText ==="string" ) return true;
			if( config.cssText instanceof cq.class ){
				config.cssText.join( function(err,data){ que.next(err,true); } );
				return;
			}
			if( ! config.cssFile && ! config.cssUrl ) return false;
			
			config.cssText= que;
			ht.httpRequest( config.cssUrl||config.cssFile, 'GET', '',
				function(err,data){
					if( err ) { que.next(err.error); return; }
					config.cssText= data.responseText||"";
					que.next(null,true);
				}
			);
		},
		//add cssText
		function( err, data, que){
			if(err) return ht.Error(err);
			
			if( data && config.cssText && !( config.cssId && ht(config.cssId) ) ){
				ht.addCssText(config.cssText,config.cssId || (config.cssId=ht.eleId(null,"bind-css-")) );
				//console.log("addCssText " + config.cssId );
			}
			return true;
		},
		//try load htmlFile or htmlUrl to htmlText
		function( err, data, que){
			if(err) return ht.Error(err);
			
			if( typeof config.htmlText ==="string" ) return true;
			if( config.htmlText instanceof cq.class ){
				config.htmlText.join( function(err,data){ que.next(err,true); } );
				return;
			}
			if( ! config.htmlFile && ! config.htmlUrl ) return false;
			
			config.htmlText=que;
			ht.httpRequest( config.htmlUrl||config.htmlFile, 'GET', '',
				function(err,data){
					if( err ) { que.next(err.error); return; }
					config.htmlText= data.responseText||"";
					que.next(null,true);
				}
			);
		},
		//set htmlText - bindByName - install name-mapping tools
		function( err, data, que){
			if(err) return ht.Error(err);
			
			//set htmlText
			if( data && config.htmlText ){
				el.innerHTML = config.htmlText.replace(/\{\{\s*([^\s\}\:]+)\s*(\:([^\}]*))?\}\}/g, "<span name='$1'>$3</span>");
			}
			
			//bindByName
			if( config.bindArray ){
				var nm= bindByName( el, obj, config.bindArray );
				if( nm instanceof Error ) return nm;
				
				//install name-mapping tools
				if( nm && !config.disableNm ){
					obj.nm= nm;
					obj.nme= nme;
				}
			}
			
			return true;
		},
		function( err, data, que){
			cb( err, data );
			que.next(err,data);
		},
	]);
	
	
}

//////////////////////////////////////////////////////////////////////////////////////////
// export module

module.exports= Object.assign(
	ht,
	{
		bindElement: bindElement,
		bindByName: bindByName,
		bindUi: bindUi,
	}
);

