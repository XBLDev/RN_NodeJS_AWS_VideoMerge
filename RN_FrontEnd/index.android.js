/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,  
  TouchableWithoutFeedback, 
  Dimensions,     
  Alert,
  NativeModules,  
  Image
} from 'react-native';

import { RNS3 } from 'react-native-aws3';

var ScreenWidth = Dimensions.get('window').width; 
var ScreenHeight = Dimensions.get('window').height; 
var ImagePicker = NativeModules.ImageCropPicker;
var AWS = require('aws-sdk/dist/aws-sdk-react-native');
import RNFetchBlob from 'react-native-fetch-blob';
// import java.io.FileInputStream;



export default class RNcallserver extends Component {


  constructor(props) {
    super(props);

    this.state = {
      numberOfTasksState: 0,
      mobileVideoUrls: [],
      videoUrls: [],
      droneVideoUrlList: [],
      MergedVideoFilePath: '',
      selectedDroneVideoPath: '',
      downloadedFilePath: '',
      hasMergedVideo: false,
      image: null,
      images: null,
      droneVideoDownloaded: false,

      fileuploading:false,
      fileuploadingProgress:0,
      fileuploadingTotal:0,
      fileStreamChunk: '',
      imageDataLoaded:false,
      imageDataFinal:''
  }

    this.PostRequest = this.PostRequest.bind(this);
    this.uploadAsync = this.uploadAsync.bind(this);
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false
    }).then(images => {
      this.setState({
        // image: null,
        images: images.map(i => {
          this.setState({mobileVideoUrls: [...this.state.mobileVideoUrls, i.path]});
        })
      });
    }).catch(e => alert(e));
                  
  }  


  upload3(){
    // var params = {Bucket: 'bucket', Key: 'key'};
    // s3.getSignedUrl('putObject', params, function (err, url) {
    //   console.log('The URL is', url);
    // });
    var PATH_TO_THE_FILE = this.state.mobileVideoUrls[0];
    var myBucket = 'videostoconvert';
    var accessKeyId = "";
    var secretAccessKey = "";
    var myCredentials = new AWS.Credentials({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
    AWS.config.update({region: 'us-west-2', credentials: myCredentials});
    const s3 = new AWS.S3();

    var params = {Bucket: myBucket, Key: 'testuploadvideo.mp4', ContentType: 'video/mp4', ACL: 'public-read'};
    s3.getSignedUrl('putObject', params, function (err, url) {
      if(err)
      {
        Alert.alert
        (
          'Upload Video',
          'Failed!',
          [
            // {text: 'Ask me later'},
            {text: err},
          ],
          { cancelable: true }
        )   
      }
      else
      {
      //  console.log('The URL is', url);
        RNFetchBlob.fetch('PUT', url, {'Content-Type': 'video/mp4'}, RNFetchBlob.wrap(PATH_TO_THE_FILE))
        // when response status code is 200
        .then((res) => {
          // let jsontext = res.json();
          // JSON.stringify({});                  // '{}'
          // let restext = JSON.stringify(res.json());
          // var output = "";
          // for(var property in res) {
          //     // alert(property + "=" + obj[property]);
          //     output = output.concat(property.toString()).concat(" ");
          // }

          output = url.substring(0, url.lastIndexOf("?"));


          fetch('http://ip/VideoConversionRN',{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileURL: "someurl",
            })

          }
        )
        .then((response) => {
          // response.json();
          return response.json();
        })
        .then((responseJson) => {

          if(responseJson)
          {
            Alert.alert(
              'Post Request to server',
              'Succeed! Got responseJson from server!',
              [
                  {text: responseJson['fileName']}                  
              ],
              { cancelable: true }
            );   
          }
          else
          {
            Alert.alert(
              'Post Request to server',
              'Succeed! Got responseJson from server!',
              [
                  {text: 'Succeed but responseJson is Nah'}
              ],
              { cancelable: true }
            );   
          }         
        })
        .catch((error) => {
          Alert.alert(
            'Post Request to server',
            'Failed!',
            [
                {text: error.toString()},
            ],
            { cancelable: true }
          );             
        });


          // Alert.alert
          // (
          //   'Upload Video',
          //   'Succeed!',
          //   [
          //     // {text: 'Ask me later'},
          //     {text: output},
          //   ],
          //   { cancelable: true }
          // );         

          // var output = String(res);
          // Alert.alert
          // (
          //   'Upload Video',
          //   'Succeed!',
          //   [
          //     // {text: 'Ask me later'},
          //     {text: output},
          //   ],
          //   { cancelable: true }
          // )             
        })  
        .catch((errorMessage, statusCode) => {
          // error handling
          Alert.alert
          (
            'Upload Video',
            'Failed!',
            [
              // {text: 'Ask me later'},
              {text: errorMessage},
            ],
            { cancelable: true }
          )       
        })
        
      }
    });

  }

  async uploadAsync() 
  {

    try {

      var PATH_TO_THE_FILE = this.state.mobileVideoUrls[0];
      var myBucket = 'videostoconvert';
      var accessKeyId = "";
      var secretAccessKey = "";
      var myCredentials = new AWS.Credentials({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
      AWS.config.update({region: 'us-west-2', credentials: myCredentials});
      // Configure the AWS SDK with the credentials
      // AWS.config.update({
      //   region,
      //   accessKeyId,
      //   secretAccessKey,
      //   sessionToken,
      // });
      // AWS.config.update({region: 'us-west-2', credentials: myCredentials});

      // Create a new instance of the S3 API
      const s3 = new AWS.S3();

      const s3Url = await s3.getSignedUrl('putObject', {
        Bucket: myBucket,
        // Key: 'testuploadimage.png',
        Key: 'testuploadvideo.mp4',
        ContentType: 'video/mp4',
      });

      const result = await RNFetchBlob.fetch('PUT', s3Url, {
        'Content-Type': 'video/mp4'
      }, RNFetchBlob.wrap(PATH_TO_THE_FILE));

      Alert.alert(
        'Upload Video',
        'Success!',
        [
          // {text: 'Ask me later'},
          {text: 's3Url is: '.concat(s3Url)},
        ],
        { cancelable: true }
      )   

    } 
    catch (e) 
    {
      // console.error('Error', e);
      Alert.alert(
        'Upload Video',
        'Failed!',
        [
          // {text: 'Ask me later'},
          {text: e},
        ],
        { cancelable: true }
      )         
    }
  }
  
  
  
  uploadFile()
  {
    if(this.state.mobileVideoUrls.length == 0)
    {
      Alert.alert(
        'Merge Video',
        'Failed!',
        [
          // {text: 'Ask me later'},
          {text: 'Need at least 1 video selected'},
        ],
        { cancelable: true }
      )                 
    }
    else
    {
      // Alert.alert(
      //   'Merge Video',
      //   'Succeed!',
      //   [
      //     // {text: 'Ask me later'},
      //     {text: 'test'},
      //   ],
      //   { cancelable: true }
      // )          

      var PATH_TO_THE_FILE = this.state.mobileVideoUrls[0];
      var myBucket = 'videostoconvert';
      var accessKeyId = "ak";
      var secretAccessKey = "sak";
      var myCredentials = new AWS.Credentials({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
      AWS.config.update({region: 'us-west-2', credentials: myCredentials});

      var s3 = new AWS.S3();
      
      var data='';
      var imageData='';
      this.setState({fileuploading: true});

      // var filestream = 
      RNFetchBlob.fs.readStream(PATH_TO_THE_FILE,'base64',4095)
      .then((ifstream) => 
        {
          ifstream.open();

          ifstream.onError((err) => {
            
              Alert.alert(
                'AWS UPLOAD',
                'Failed!',
                [
                  // {text: 'Ask me later'},
                  {text: 'FILE STREAM FAILED'},
                ],
                { cancelable: true }
              )  
          })
          // var uploadparams = {Bucket: myBucket, 
          //                     Key: "Vid2.mp4", 
          //                     Body: ifstream};
          // s3.upload(uploadparams, function(err, data) {
          //     if(err)
          //     {
          //       Alert.alert(
          //         'AWS UPLOAD',
          //         'Failed!',
          //         [
          //           // {text: 'Ask me later'},
          //           {text: 'UPLOAD FAILED'},
          //         ],
          //         { cancelable: true }
          //       )  
          //     }
          //     else
          //     {
          //       Alert.alert(
          //         'AWS UPLOAD',
          //         'Succeed!',
          //         [
          //           // {text: 'Ask me later'},
          //           {text: 'UPLOAD SUCCEEDED'},
          //         ],
          //         { cancelable: true }
          //       )  
          //     }
          // });
          ifstream.onData((chunk) => {
            // when encoding is `ascii`, chunk will be an array contains numbers 
            // otherwise it will be a string 
            // data += chunk
            data = data.concat(chunk);            
            // data = data.concat(chunk.toString());
            imageData = imageData.concat(chunk);
            
            // this.setState({fileStreamChunk: chunk.toString()});
            // this.setState({fileStreamChunk: data});            
          })

          ifstream.onEnd(() => {
            // data = 'data:image/png;base64,'.concat(data);
            dataToDisplay = 'data:image/png;base64,'.concat(data);
            // data = 'data:image/png,base64'.concat(data);
            this.setState({fileStreamChunk: data.length});
            this.setState({imageDataFinal: dataToDisplay, imageDataLoaded: true});
            
            var uploadparams = {
              Bucket: myBucket, 
              Key: "testConvertedImgFile.png", 
              Body: data, 
              ACL: "public-read", 
              ContentEncoding: 'base64',
              ContentType: 'image/png'
            }; 
            s3.upload(uploadparams, function(err, data) {
                if(err)
                {
                  Alert.alert(
                    'AWS UPLOAD',
                    'Failed!',
                    [
                      // {text: 'Ask me later'},
                      {text: 'UPLOAD FAILED'},
                    ],
                    { cancelable: true }
                  )  
                }
                else
                {
                  // const data = {foo:1, bar:2};
                  // fetch(`https://api.parse.com/1/users?foo=${data.foo}&bar=${data.bar}`, {
                  //   method: "GET",
                  //   headers: headers,   
                  //   body:body
                  // })
                  
                  // const data = {videoURL: data.Location};
                  //
                  // var basecodestring = this.state.imageDataFinal;

                  fetch('http://ip/VideoConversionRN',{
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        fileURL: data.Location,
                      })
                      // body: JSON.stringify({
                      //   basecode: basecodestring,
                      // })
                    }
                  )
                  .then((response) => {
                    // response.json();
                    return response.json();
                    
                    // Alert.alert(
                    //   'Post Request to server',
                    //   'Succeed! Got response from server!',
                    //   [
                    //       // {text: 'Ask me later'},
                    //       {text: 'OK'},
                    //   ],
                    //   { cancelable: true }
                    // );    
                  })
                  .then((responseJson) => {

                    // var textToPrint = "Succeed";
                    // if(responseJson.fileName)
                    // {
                    //   textToPrint = responseJson.fileName;
                    // }
                    if(responseJson)
                    {
                      Alert.alert(
                        'Post Request to server',
                        'Succeed! Got responseJson from server!',
                        [
                            // {text: 'Ask me later'},
                            {text: responseJson['fileName']}
                            // {text: responseJson['imagesaved']}
                            
                        ],
                        { cancelable: true }
                      );   
                    }
                    else
                    {
                      Alert.alert(
                        'Post Request to server',
                        'Succeed! Got responseJson from server!',
                        [
                            // {text: 'Ask me later'},
                            {text: 'Succeed but responseJson is Nah'}
                        ],
                        { cancelable: true }
                      );   
                    }         
                  })
                  .catch((error) => {
                    Alert.alert(
                      'Post Request to server',
                      'Failed!',
                      [
                          {text: error.toString()},
                          // {text: error.toString() || error.message.toString() || error.message},
                      ],
                      { cancelable: true }
                    );             
                    //console.error(error);
                  });

                  // Alert.alert(
                  //   'AWS UPLOAD',
                  //   'Succeed!',
                  //   [
                  //     // {text: 'Ask me later'},
                  //     {text: 'UPLOAD SUCCEEDED'},
                  //   ],
                  //   { cancelable: true }
                  // )                    
                }
            })
            
            // this.setState({fileuploading: true});            
            // Alert.alert(
            //   'File Stream',
            //   'Succeed!',
            //   [
            //     // {text: 'File Stream'},
            //     {text: data},
            //   ],
            //   { cancelable: true }
            // )             
          })
      });

        
      // var uploadparams = {
      //   Bucket: myBucket, 
      //   Key: "testConvertedVideoFile.txt", 
      //   Body: 'sometestfile'};
      
      // s3.upload(uploadparams, function(err, data) {
      //   if(err)
      //   {
      //     Alert.alert(
      //       'AWS UPLOAD',
      //       'Failed!',
      //       [
      //         // {text: 'Ask me later'},
      //         {text: 'UPLOAD FAILED'},
      //       ],
      //       { cancelable: true }
      //     )  
      //   }
      //   else
      //   {
      //     Alert.alert(
      //       'AWS UPLOAD',
      //       'Succeed!',
      //       [
      //         // {text: 'Ask me later'},
      //         {text: 'UPLOAD SUCCEEDED'},
      //       ],
      //       { cancelable: true }
      //     )  
      //   }
      //   // console.log(err, data);
      // });      

    }    
  }

  createTestBucket()
  {
    
    // Bucket names must be unique across all S3 users
    var myBucket = 'testconvertvideobkt';

    var accessKeyId = "";
    var secretAccessKey = "";
    
    var myCredentials = new AWS.Credentials({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
    AWS.config.update({region: 'us-west-2', credentials: myCredentials});


    /* The following example creates a bucket. */
    var s3 = new AWS.S3();
    var params = {
      Bucket: "testvideoconvertbkt"
    };

    // filestream = RNFetchBlob.fs.readStream(PATH_TO_THE_FILE,'base64',4095);

    // var uploadparams = {Bucket: 'bucket', Key: 'key', Body: stream};
    var uploadparams = {Bucket: myBucket, Key: "videotoconvert.png", Body: RNFetchBlob.fs.readStream(PATH_TO_THE_FILE,'base64',4095)};
    
    s3.upload(uploadparams, function(err, data) {
      if(err)
      {
        Alert.alert(
          'AWS UPLOAD',
          'Failed!',
          [
            // {text: 'Ask me later'},
            {text: 'UPLOAD FAILED'},
          ],
          { cancelable: true }
        )  
      }
      else
      {
        Alert.alert(
          'AWS UPLOAD',
          'Succeed!',
          [
            // {text: 'Ask me later'},
            {text: 'UPLOAD SUCCEEDED'},
          ],
          { cancelable: true }
        )  
      }
      // console.log(err, data);
    });

    // s3.createBucket(params, function(err, data) {
    //   if(err)
    //   {
    //     Alert.alert(
    //       'AWS CREATE BUCKET',
    //       'Failed!',
    //       [
    //         // {text: 'Ask me later'},
    //         {text: 'CREATE BUCKET FAILED'},
    //       ],
    //       { cancelable: true }
    //     )                   
    //   }
    //   else
    //   {
    //     // Alert.alert(
    //     //   'AWS CREATE BUCKET',
    //     //   'Success!',
    //     //   [
    //     //     // {text: 'Ask me later'},
    //     //     {text: 'CREATE BUCKET SUCCEDED'},
    //     //   ],
    //     //   { cancelable: true }
    //     // )      

    //     // s3.deleteBucket(params, function(err, data) {
    //     //   if (err) 
    //     //   {
    //     //     Alert.alert(
    //     //       'AWS DELETE BUCKET',
    //     //       'Failed!',
    //     //       [
    //     //         // {text: 'Ask me later'},
    //     //         {text: 'DELETE BUCKET FAILED'},
    //     //       ],
    //     //       { cancelable: true }
    //     //     )             
    //     //     // console.log(err, err.stack);
    //     //   } 
    //     //   else
    //     //   {
    //     //     Alert.alert(
    //     //       'AWS DELETE BUCKET',
    //     //       'Success!',
    //     //       [
    //     //         // {text: 'Ask me later'},
    //     //         {text: 'DELETE BUCKET SUCCEDED'},
    //     //       ],
    //     //       { cancelable: true }
    //     //     )                   
    //     //     // console.log(data);   
    //     //   }        
    //     // });       
    //   }
    //   // if (err) console.log(err, err.stack); // an error occurred
    //   // else     console.log(data);           // successful response
    //   /*
    //   data = {
    //     Location: "/examplebucket"
    //   }
    //   */
    // });



    // Alert.alert(
    //   'AWS SETUP',
    //   'Succcess!',
    //   [
    //     // {text: 'Ask me later'},
    //     {text: 'AWS setup finished'},
    //   ],
    //   { cancelable: true }
    // )             
    
  }

  BeginMerge()
  {
    if(this.state.mobileVideoUrls.length == 0)
    {
      Alert.alert(
        'Merge Video',
        'Failed!',
        [
          // {text: 'Ask me later'},
          {text: 'Need at least 1 video selected'},
        ],
        { cancelable: true }
      )                 
    }
    else
    {
      const file = 
      {
        // `uri` can also be a file system path (i.e. file://)

        // uri: "assets-library://asset/asset.PNG?id=655DBE66-8008-459C-9358-914E1FB532DD&ext=PNG",
        // name: "image.png",
        // type: "image/png"

        // uri: this.state.mobileVideoUrls[0],
        // name: "userVideoToConvert.mp4",
        // type: "video/mp4"

        uri: this.state.mobileVideoUrls[0],
        name: "userVideoToConvert.png",
        type: "image/png"        

      }  
      
      const options = {
        // keyPrefix: "uploads/",
        bucket: "videostoconvert",
        region: "us-west-2",
        accessKey: "",
        secretKey: "",
        successActionStatus: 201
      }      

      this.setState({fileuploading: true});

      RNS3.put(file, options)
      .progress((e) => this.setState({fileuploadingProgress: e.loaded, fileuploadingTotal: e.total}) )
      .then(response => {
        if (response.status == 201)
        {
          this.setState({fileuploading: false});    
          this.setState({fileuploadingProgress: -1, fileuploadingTotal: -1});

          Alert.alert
          (
            'Upload Video',
            'Success!',
            [
              // {text: 'Ask me later'},
              {text: response.body},
            ],
            { cancelable: true }
          )    

          // throw new Error("Failed to upload image to S3");
        }
        else
        {

          this.setState({fileuploading: false});  
          this.setState({fileuploadingProgress: -1, fileuploadingTotal: -1});

          Alert.alert(
            'Upload Video',
            'Failed!'.concat(response.status.toString()),
            [
              // {text: 'Ask me later'},
              {text: response.body},
            ],
            { cancelable: true }
          )                
  
        }
        /**
         * {
         *   postResponse: {
         *     bucket: "your-bucket",
         *     etag : "9f620878e06d28774406017480a59fd4",
         *     key: "uploads/image.png",
         *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
         *   }
         * }
         */
      });      


    }
  }

  PostRequest() {

    fetch('http://someURL/VideoConversionRN',{method: 'POST'})
      .then((response) => {
      //  response.json()
        Alert.alert(
          'Post Request to server',
          'Succeed! Got response from server!',
          [
              // {text: 'Ask me later'},
              {text: 'OK'},
          ],
          { cancelable: true }
        );    
      })
      .then((responseJson) => {
        Alert.alert(
          'Post Request to server',
          'Succeed! Got responseJson from server!',
          [
              // {text: 'Ask me later'},
              {text: 'OK'},
          ],
          { cancelable: true }
        );            
      })
      .catch((error) => {
        Alert.alert(
          'Post Request to server',
          'Failed!',
          [
              // {text: 'Ask me later'},
              {text: 'OK'},
          ],
          { cancelable: true }
        );             
        //console.error(error);
      });

    // Alert.alert(
    //     'Post Request to server',
    //     'Succeed! Got response from server!',
    //     [
    //         // {text: 'Ask me later'},
    //         {text: 'OK'},
    //     ],
    //     { cancelable: true }
    // );    
                  
  }  

  render() {
    return (
      <View style={styles.container}>


          <View style={{width: ScreenWidth, height: ScreenHeight/4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}}>
                <Text style={{color: 'black'}}>
                    {
                      this.state.mobileVideoUrls.length == 0? 
                      (
                        'no video selected'
                      ):
                      (
                        this.state.mobileVideoUrls[0]
                      )
                    }
                </Text>
          </View>  

          <View style={{width: ScreenWidth, height: ScreenHeight/2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0000ff'}}>
                {/* <Text style={{color: 'white'}}>
                    {
                      this.state.fileuploading == false? 
                      (
                        ' '
                      ):
                      (
                        this.state.fileStreamChunk
                      )
                    }
                </Text> */}
                {this.state.imageDataLoaded == false? 
                (
                  <Text style={{color: 'white'}}>
                      no image loaded
                  </Text>  
                ):
                (
                  // <Image source={{ uri : 'data:image/png,base64' + data }}
                  // source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='}}
                  
                   <Image style={{width: ScreenWidth, height: ScreenHeight/2}}
                   source={{ uri : this.state.imageDataFinal }}
                   /> 
                )
                }

          </View>  



          <View style={{flexDirection:'row', backgroundColor: '#00ff00', justifyContent: 'center', alignItems: 'center', width: ScreenWidth, height: ScreenHeight/4}}>
                <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center', width: ScreenWidth/2, backgroundColor: '#00ff00'}}>
                            <TouchableOpacity onPress={this.pickMultiple.bind(this)}>
                                <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>                      
                                      <Text>Add mobile phone video</Text>
                                </View>                                                
                            </TouchableOpacity>
                </View>

                <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center', width: ScreenWidth/2, backgroundColor: '#00ff00'}}>
                            <TouchableOpacity onPress={this.upload3.bind(this)}>
                                <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>                      
                                      <Text>Begin Merge</Text>
                                </View>                                                
                            </TouchableOpacity>
                </View>                          

          </View>            
          {/* <View style={{width: ScreenWidth, height: ScreenHeight/3, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={this.PostRequest} style={{width: ScreenWidth, height: ScreenHeight/3, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: 'black'}}>Press Here To Get Server Response</Text>
              </TouchableOpacity>
          </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('RNcallserver', () => RNcallserver);
