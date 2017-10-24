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
  
} from 'react-native';

import { RNS3 } from 'react-native-aws3';

var ScreenWidth = Dimensions.get('window').width; 
var ScreenHeight = Dimensions.get('window').height; 
var ImagePicker = NativeModules.ImageCropPicker;
var AWS = require('aws-sdk/dist/aws-sdk-react-native');
import RNFetchBlob from 'react-native-fetch-blob';



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
      
  }

    this.PostRequest = this.PostRequest.bind(this);
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
      var accessKeyId = "";
      var secretAccessKey = "";
      var myCredentials = new AWS.Credentials({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
      AWS.config.update({region: 'us-west-2', credentials: myCredentials});

      var s3 = new AWS.S3();
      var filestream = RNFetchBlob.fs.readStream(PATH_TO_THE_FILE,'base64',4095)
      .then((ifstream) => 
        {
        ifstream.open()
        ifstream.onData((chunk) => {
          // when encoding is `ascii`, chunk will be an array contains numbers 
          // otherwise it will be a string 
          data += chunk
        })
        ifstream.onError((err) => {
          console.log('oops', err)
        })
        ifstream.onEnd(() => {  
          <Image source={{ uri : 'data:image/png,base64' + data }} />
        })
      })

        
      var uploadparams = {Bucket: myBucket, Key: "videotoconvert.mp4", Body: RNFetchBlob.fs.readStream(PATH_TO_THE_FILE,'base64',4095)};
      
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
        // let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // this.setState({
        //   isLoading: false,
        //   dataSource: ds.cloneWithRows(responseJson.movies),
        // }, function() {
        //   // do something with new state
        // });

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

          <View style={{width: ScreenWidth, height: ScreenHeight/4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0000ff'}}>
                <Text style={{color: 'white'}}>
                    {
                      this.state.fileuploading == false? 
                      (
                        ' '
                      ):
                      (
                        this.state.fileuploadingProgress.toString().concat('/').concat(this.state.fileuploadingTotal.toString())
                      )
                    }
                </Text>
          </View>  



          <View style={{flexDirection:'row', backgroundColor: '#00ff00', justifyContent: 'center', alignItems: 'center', width: ScreenWidth, height: ScreenHeight/2}}>
                <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center', width: ScreenWidth/2, backgroundColor: '#00ff00'}}>
                            <TouchableOpacity onPress={this.pickMultiple.bind(this)}>
                                <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>                      
                                      <Text>Add mobile phone video</Text>
                                </View>                                                
                            </TouchableOpacity>
                </View>

                <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center', width: ScreenWidth/2, backgroundColor: '#00ff00'}}>
                            <TouchableOpacity onPress={this.uploadFile.bind(this)}>
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
