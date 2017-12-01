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


//FOLLOWING CODE HERE: https://stackoverflow.com/questions/6926016/nodejs-saving-a-base64-encoded-image-to-disk
app.post('/VideoConversionSaveBased64PNG', function(req, res) {
    console.log('VideoConversionSaveBased64PNG called');
    
    var param1 = 'NOTHING';
    
    if(req.body.basecode)
    {
        param1 = req.body.basecode.toString();
    }

    var base64Data = param1.replace(/^data:image\/png;base64,/, "");
    
    require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
    //   console.log(err);

        if(err)
        {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                    // 'fileName': 'SERVER DOWNLOADED FROM: '.concat(param1)
                    'imagesaved': 'Out.png NOT saved on server!'
            }));    
            res.status(201).end();
        }
        else
        {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                    // 'fileName': 'SERVER DOWNLOADED FROM: '.concat(param1)
                    'imagesaved': 'Out.png saved on server!'
            }));    
            res.status(201).end();
        }     
    });

});   




app.post('/VideoConversionRN', function(req, res) {
    console.log('VideoConversionRN called');
    
        var param1 = 'NOTHING';
        
        if(req.query.fileURL)
        {
            param1 = req.query.fileURL;
        }
        if(req.body.fileURL)
        {
            param1 = req.body.fileURL.toString();
        }
        
        var https = require('https');  
        var fs = require('fs');    
        var file = fs.createWriteStream('./'.concat('downloadedVideoFile.mp4'));
        https.get(param1, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                // console.log('SERVER: ANIMATION DOWNLOADED FROM SERVER: ',Values[0]['storyFileUrls'][0]);
                file.close();  // close() is async, call cb after close completes.
                hbjs.spawn({ input: 'downloadedVideoFile.mp4', output: 'ConvertedToMP4/convertedVideo.mp4', rate: '30' })
                .on('error', function(err){
                    // res.status(210).end();
                    console.log(err);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                            'fileName': 'SERVER Failed to CONVERT: '.concat(param1)
                    }));    
                    res.status(201).end();      
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
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                            // 'fileName': 'SERVER DOWNLOADED FROM: '.concat(param1)
                            'fileName': 'SERVER CONVERTED FILE DOWNLOADED FROM: '.concat(param1)
                    }));    
                    res.status(201).end();         
                });    
            })
            .on('error', function(err) { 
                // console.log(err);
                // file.close();  // close() is async, call cb after close completes.
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                        'fileName': 'SERVER Failed to DOWNLOADED FROM: '.concat(param1)
                }));    
                res.status(201).end();      
            });
        });
});



// app.get('/', function(req, res){
//     // res.sendfile('entryPage.html', { root: __dirname + "/relative_path_of_file" } );

//     res.sendFile('entryPage.html', { root: __dirname } );
// });

app.listen(8080, function () {
  console.log('Server listening on port 8080!')
})