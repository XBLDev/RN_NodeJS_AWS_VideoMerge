import React from 'react';
import PropTypes from 'prop-types';
var AWS = require('aws-sdk');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      APISupport: ''
    }      
  }

  componentWillMount()
  {
        // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      this.setState({APISupport: 'SUPPORT'});
    } else {
      this.setState({APISupport: ' NOT SUPPORT'});
      
      // alert('The File APIs are not fully supported in this browser.');
    }
  }  

  componentWillUnmount() 
  {
  }

  componentDidMount() 
  {
  }        

  componentWillUpdate(nextProps, nextState)
  {
  }

  componentDidUpdate(prevProps, prevState)
  {
  }
  
  componentWillReceiveProps(nextProps)
  {
  }

  handleFileSelect(evt) {
    console.log('handleFileSelect called');
    
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  handleFileSelectDragged(evt) {
    console.log('handleFileSelectDragged called');
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      // console.log(f);
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  handleDragOver(evt) {
    console.log('handleDragOver called');
    
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  handleFileSelectImage(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      // console.log(f);
      // Only process image files.
      // if (!f.type.match('image.*')) {
      //   continue;
      // }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          console.log('BEGIN UPLOAD TO AWS S3, e: ', e.target.result);
          var myBucket = '';
          var accessKeyId = "";
          var secretAccessKey = "";
          var myCredentials = new AWS.Credentials({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
          AWS.config.update({region: 'us-west-2', credentials: myCredentials});
          var s3 = new AWS.S3();
          var uploadparams = {
            Bucket: myBucket, 
            // Key: "testConvertedImgFile.png", 
            Key: "testUploadedVideo.mp4",             
            Body: e.target.result, 
            ACL: "public-read", 
            // ContentEncoding: 'BASE64',
            // ContentType: 'image/png'
            ContentType: 'video/mp4'
            
          }; 
          s3.upload(uploadparams, function(err, data) {
              if(err)
              {
                console.log(err);
              }
              else
              {
                console.log('END OF UPLOAD TO AWS S3');
              }
          });          

          // var xhr = new XMLHttpRequest();
          // xhr.open('POST', '/uploadFile/upload');
          // // xhr.setRequestHeader("Content-Type", "application/json");
          // xhr.responseType = 'json';
          // xhr.addEventListener('load', () => {
          //   if (xhr.status === 200) 
          //   {
          //       console.log(xhr.response.message);
          //   }

          // });        
          // // xhr.send(JSON.stringify({name:this.state.userFullName, email:this.state.userEmail}));
          // xhr.send(JSON.stringify({fileblob: e.target.result}));
          

          // console.log(e.target.result);
          // Render thumbnail.
          // var span = document.createElement('span');
          // span.innerHTML = ['<img class="thumb" src="', e.target.result,
          //                   '" title="', escape(theFile.name), '"/>'].join('');
          // document.getElementById('list').insertBefore(span, null);
        };
      })(f);

      // Read in the image file as a data URL.
      // reader.readAsBinaryString(f);
      // reader.readAsDataURL(f);
      // reader.readAsText(f,"BASE64");
      reader.readAsArrayBuffer(f);
    }
  }

  render() {
    return (
    <div className="outerMostContainer" >
      {/* <input type="file" id="files" name="files[]" multiple onChange={this.handleFileSelect.bind(this)}/> */}
      <input type="file" id="files" name="files[]" multiple onChange={this.handleFileSelectImage.bind(this)}/>


      {/* <div id="drop_zone" className="dragFileArea" onDragOver={this.handleDragOver.bind(this)} onDrop={this.handleFileSelectDragged.bind(this)}>
        Drop files here
      </div> */}

      <output id="list"></output>

    </div>  
    
    )      
  
  }    


}  


export default App
