var request = require("request");	// This comes from NPM
showContent = function(error, response, body){
	console.log("The body length is", body.length);
}
request.get("http://www.bigassbbw.com", showContent);
console.log("The site content was retrieved.");
