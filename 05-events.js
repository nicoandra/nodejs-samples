const dgram = require("dgram");
const server = dgram.createSocket("udp4");

server.on('error', (err) => {console.log("Error:", err)});

server.on('message', (msg, info) => {
	console.log("I received a message", msg, "from", info);
})

server.on(
	'listening', 
	() => { console.log("Listening on", server.address().address, server.address().port) }
);

server.bind(5300);


// Use dig to make a query as follows:
// dig www.site.com @127.0.0.1 -p 5300


