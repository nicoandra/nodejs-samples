const dgram = require("dgram");
const server = dgram.createSocket("udp4");

server.on('error', (err) => {console.log("Error:", err)});

server.on('message', (msg, info) => {
	console.log("I received a message", msg, "from", info);
	console.log("ClientId: : ", msg[0], msg[1]);
	console.log("Flags: ", msg[2], msg[3]);
	console.log("Questions: ", msg[4], msg[5]);

	console.log("Query: ", msg.slice(13).toString());


})

server.on(
	'listening', 
	() => { 
		console.log("Listening on", server.address().address, server.address().port)
	}
);

server.bind(5300);
