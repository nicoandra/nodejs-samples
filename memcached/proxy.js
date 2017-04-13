/*
1-The proxy listens on 127.0.0.1 port 11212
2-Install php-memcached php-cli to run set.php

*/

const net = require('net');
var server = net.createServer(
	(socket) => {
		socket.end("Connection off\n");
	}).on('error', (err) => {
		console.log("Error here", err);
	});


server.listen({ port : 11212 } ,() => {
	console.log("Listening...", server.address());
});


server.on('connection', (socket) => {	// ON connection, the callback parameter is an instance of net.Socket
	console.log("New connection established:", socket.remoteAddress, socket.remotePort);

	socket.on('data', (data) => {
		console.log("Received ", data, "from", socket.remoteAddress);
		console.log("In ASCII:", data.toString());
	});
});
