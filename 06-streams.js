const zlib = require('zlib');
const gzip = zlib.createGzip();

const fs = require('fs');



fileStream = fs.createWriteStream('/tmp/06-streams.gz' , { flags : 'w' } )



console.log("Type anything and press enter. Your text will be shown in StdOut , and it will be (silently) compressed into /tmp-06-streams.gz");

fileStream.on('pipe', function(){
	console.log("An object is piping to the fileStream.", fileStream);
})
	
process.stdin.pipe(process.stdout);	// Standard Input is piped to Standard Output
process.stdin.pipe(gzip).pipe(fileStream);	// Standard Input is piped to a gzip stream. The gzip stream is piped into a file stream.

setInterval(function(){
	gzip.flush();	// Flush every now and then, so the file is actually written to disk. Otherwise compression happens in memory only.
}, 100);

