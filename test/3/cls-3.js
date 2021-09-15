
module.exports={
	config: {
		cssText: require( "./res/3.css" ),
		htmlText: require( "./res/3.html" ),
		
		bindArray:[
			["sp1","class","my-cls1","txtRed",2],
			["chk1","prop","checked","txtRed",2],
			["chk2","prop","checked","txtRed",2],
			["btn","evt","click","toggleRed"],
		],
	},
	
	txtRed: true,
	
	toggleRed: function(){ this.txtRed=!this.txtRed; },
};
