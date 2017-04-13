function toUpper(param){
	return param.toUpperCase();
}

function toLower(param){
	return param.toLowerCase();
}

var names = ["aAa", "BbB"];

names.forEach(function(name){
	console.log(this(name))
}, toUpper);


names.forEach(function(name){
        console.log(this(name))
}, toLower);



