var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'DgmA29S7hRuuMensaT1LdreMj',
  consumer_secret: 'NklKJlaeVzoVtOGn4b7F1HQWFm7DY2lhu4ZrhtCLvgbgyTIUzf',
  access_token_key: '921329995925954561-F7VOjO2THzlqvZcaiaQ6HOlxp72ZFwA',
  access_token_secret: 'sqwoshEgM2HPvmRONG8ypcYJX9oBrMmE99dIBuvqDb3WB'
});

var _stream = {};

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var jsonParser = bodyParser.json() 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// app.post('/go',urlencodedParser, function(req, res){

// 	  res.sendFile(__dirname + '/index.html');
// 	});

io.on('connection', function(socket){


	
	socket.on('chat message', function(msg){
    // console.log('message: ' + msg);

    	if (!isEmpty(_stream)){
    		_stream.destroy();
    	}
    	

    	client.stream('statuses/filter', {track: msg}, function(stream) {
		  _stream = stream;
		  var list = msg.split(',');
		  stream.on('data', function(event) {
		  	console.log(event)	
		    console.log(event.text);
		    socket.emit('visualize', event.text)
		  });

		  stream.on('error', function(error) {
		    throw error;
		  });
		  
		});
		
				
						
	 //    var stream = client.stream('statuses/filter', {track: msg });
		// stream.on('data', function(event) {
		//   console.log(event && event.text);
		//   socket.emit('visualize', event.text)
		// });
		// client.currentTwitStream = stream; 
		// stream.on('error', function(error) {
		//   throw error;
		// });

  });

  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');

  });



});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}