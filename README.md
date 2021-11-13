# bind-ui
htm-tool bind-ui module

# Install
```
npm install bind-ui
```

# Usage
```javascript
var bind_ui= require( "bind-ui" );

var myObj={
	config: {
		cssText: ".my-cls1{color:red;}",
		htmlText: "<span class='my-cls1' name='sp1'>aaaaa</span> "+
			"<label><input name='chk1' type=checkbox ></input>chk1</label> "+
			"<button name='btn'>toggle</button> ",
		bindArray:[
			"sp1",["class","my-cls1","txtRed",2],
			"chk1",["prop","checked","txtRed",2],
			"btn",["evt","click","toggleRed"],
		],
	},
	
	txtRed: true,
	
	toggleRed: function(){ this.txtRed=!this.txtRed; },
}

bind_ui( "div1", myObj );

```