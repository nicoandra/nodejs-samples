/*
1-The proxy listens on 127.0.0.1 port 11215
2-Install php-memcached php-cli to run set.php
3-Install memcached, then disable the service, and then run memcached -vv -p 11211 ; and -p 11212 to start 2 instances
4-call this script as DEBUG="*" node proxy.js . To reduce client output, you can set DEBUG to "*,-clients".
5-Call set.php


You can see in Memcached the number of connections. Surprisingly, it will be very low. The reason being that the proxy keeps the connection open.
Try running:

echo "stats" | netcat 127.0.0.1 11211 | grep conn


*/

const net = require('net');
var debugBackends = require('debug')('backends');
var debugClients = require('debug')('clients');
var debugProxy = require('debug')('proxy');


var backend1 = new net.Socket({ readable: true, writable: true});
backend1.connect({host: '127.0.0.1', port: 11211 });
backend1.on('connect' , function() {
	debugBackends("Proxy connected to Backend 1");
}.bind(backend1));

backend1.on('data', (rawResponse) => {
	debugBackends("Backend 1 to Proxy >>>", rawResponse.toString());
        clients[1].write(rawResponse, 'UTF8', function(){ 
                processQueue(1);
        });

})

var backend2 = new net.Socket({ readable: true, writable: true});
backend2.connect({host: '127.0.0.1', port: 11212 });
backend2.on('connect' , function() {
        debugBackends("Proxy connected to Backend 2");
}.bind(backend2));

backend2.on('data', (rawResponse) => {
        debugBackends("Backend 2 to Proxy >>>", rawResponse.toString());
	clients[2].write(rawResponse, 'UTF8', function(){
		processQueue(2);
	});
})



backend1.on("error", (err) => { console.log("Backend 1 Error:", err) } );
backend2.on("error", (err) => { console.log("Backend 2 Error:", err) } );


var backends = {
	1: backend1,
	2: backend2
}


var server = net.createServer((socket) => {
		// socket.end("Connection off\n");
	}).on('error', (err) => {
		console.log("Error here", err);
	});

server.on('connection', (netSocket) => {	// ON connection, the callback parameter is an instance of net.Socket
	debugClients("Client connected to Proxy:", netSocket.remoteAddress, netSocket.remotePort);

	netSocket.on('data', (data) => {
		debugClients("Client to Proxy >>  ", data, "from", netSocket.remoteAddress);

		var stringCommand = data.toString();
		if(stringCommand.startsWith("set ") || stringCommand.startsWith("get ")){
			// Handle set / get

			mcKey = stringCommand.split(" ")[1];

			number = 2;
			if(mcKey.trim().endsWith("1")){
				number = 1;
			}
			messageQueues[number].push({ clientConnection : netSocket, data: data });
		}

	});
});


server.listen({ host: "127.0.0.1", port : 11215 } ,() => {
	console.log("Proxy listening: ", server.address());
});


// Accumulate messages to send to the backend
var messageQueues = {
	1 : [],
	2 : []
};


var clients = {
};

function processQueue(number){

	if(messageQueues[number].length === 0){
		// Call itself again
		return setTimeout(function(){
			processQueue(number)
		}, 1);
	}

	message = messageQueues[number].shift();
	backends[number].write(message.data);
	clients[number] = message.clientConnection;

	return ;

	backend1.on('data', function(response){
		try {
			message.clientConnection.write(response);
		} catch(err){
			console.log("Write to client failed", err);
		}
		// Call itself again
		setTimeout( function(){
			processQueue(number);
		}, 1);
	});

        backend2.on('data', function(response){
                try {
                        message.clientConnection.write(response);
                } catch(err){
                        console.log("Write to client failed", err);
                }
                // Call itself again
                setTimeout( function(){
                        processQueue(number);
                }, 1);
        });


}


processQueue(1);
processQueue(2);


