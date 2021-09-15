
var myObjClass2={
	config: {
		cssUrl: "/bind-ui/test/2/2.css",
		htmlUrl: "/bind-ui/test/2/2.html",
		
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
