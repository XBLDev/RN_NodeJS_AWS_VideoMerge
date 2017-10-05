var express = require('express');
var app = express();
var hbjs = require('handbrake-js');


	//require the body-parser nodejs module
var	bodyParser = require('body-parser');
	//require the path nodejs module
var	path = require("path");

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true })); 


console.log('BACKEND STARTING');
// console.log(__dirname);


// app.use(express.static('./client/static/'));





// app.post('/LEDon', function(req, res) {
//     console.log('LEDon button pressed!');
//     // Run your LED toggling code here
// });

// app.post('/LEDoff', function(req, res) {
//     console.log('LEDoff button pressed!');
//     // Run your LED toggling code here
// });

//tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));

//tell express what to do when the /form route is requested
app.post('/form',function(req, res){
	res.setHeader('Content-Type', 'application/json');

	//mimic a slow network connection
	setTimeout(function(){

		res.send(JSON.stringify({
			firstName: req.body.firstName || null,
			lastName: req.body.lastName || null
		}));

	}, 1000)

	//debugging output for the terminal
	console.log('you posted: First Name: ' + req.body.firstName + ', Last Name: ' + req.body.lastName);
});




app.post('/VideoConversion', function(req, res) {
    console.log('VideoConversion called');

	res.setHeader('Content-Type', 'application/json');

    // res.send(JSON.stringify({
    //     fileName: 'Vid2.mp4'
    // }));    

    // res.status(201).end();           

    hbjs.spawn({ input: 'Vid2.mp4', output: 'ConvertedToMP4/vid2.mp4', rate: '30' })
    .on('error', function(err){
        // res.status(210).end();
        console.log(err);
        // invalid user input, no video found etc
    })
    .on('progress', function(progress){
        console.log(
        'Percent complete: %s, ETA: %s',
        progress.percentComplete,
        progress.eta
        );
    })
    .on('complete', function(progress){
        // res.status(500).end();
        console.log("COMPLETED!");


        res.send(JSON.stringify({
            fileName: 'Vid2.mp4'
        }));    

        res.status(201).end();           
        
    });    
    
    

    // Alert("VideoConversion button pressed!");
    // console.log('VideoConversion button pressed!');
    // Run your LED toggling code here
});


app.post('/VideoConversionRN', function(req, res) {
    console.log('VideoConversionRN called');

	// res.setHeader('Content-Type', 'application/json');

    // res.send(JSON.stringify({
    //     fileName: 'Vid2.mp4'
    // }));    

    // res.status(201).end();           

    hbjs.spawn({ input: 'Vid2.mp4', output: 'ConvertedToMP4/vid3.mp4', rate: '30' })
    .on('error', function(err){
        // res.status(210).end();
        console.log(err);
        // invalid user input, no video found etc
    })
    .on('progress', function(progress){
        console.log(
        'Percent complete: %s, ETA: %s',
        progress.percentComplete,
        progress.eta
        );
    })
    .on('complete', function(progress){
        // res.status(500).end();
        console.log("COMPLETED!");


        // res.send(JSON.stringify({
        //     fileName: 'Vid2.mp4'
        // }));    

        res.status(201).end();           
        
    });    
    
    

    // Alert("VideoConversion button pressed!");
    // console.log('VideoConversion button pressed!');
    // Run your LED toggling code here
});



// app.get('/', function(req, res){
//     // res.sendfile('entryPage.html', { root: __dirname + "/relative_path_of_file" } );

//     res.sendFile('entryPage.html', { root: __dirname } );
// });

app.listen(8080, function () {
  console.log('Server listening on port 8080!')
})