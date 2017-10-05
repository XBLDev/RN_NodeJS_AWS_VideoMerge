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
  Alert
} from 'react-native';

var ScreenWidth = Dimensions.get('window').width; 
var ScreenHeight = Dimensions.get('window').height; 

export default class RNcallserver extends Component {


  constructor(props) {
    super(props);
    this.PostRequest = this.PostRequest.bind(this);
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
          <View style={{width: ScreenWidth, height: ScreenHeight/3, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={this.PostRequest} style={{width: ScreenWidth, height: ScreenHeight/3, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: 'black'}}>Press Here To Get Server Response</Text>
              </TouchableOpacity>
          </View>
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
