const express = require('express');
var path = require('path');
var Busboy = require('busboy');
var fs = require('fs');
var {Transform} = require('stream');

const app = express();

app.get('/', function(req,res){
  res.sendFile(__dirname + '/home.html');
})

app.post('/fileupload', function (req, res) {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var saveTo = path.join(__dirname,'uppercase.txt');
    file.pipe(upperCase).pipe(fs.createWriteStream(saveTo));
  });

  busboy.on('finish', function() {
    res.writeHead(200, { 'Connection': 'close' });
    res.end("file saved with uppercase");

  });
  return req.pipe(busboy);    
});

app.listen(8080,function(req, res){
  console.log('server running');
})

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});



