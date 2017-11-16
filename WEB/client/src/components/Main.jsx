import React from 'react';

import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  showpopup,
  quitpopup,
  setusername,
  setuseremail,
  setconfirmationemail,
  senduserinformation
} from './reducer'

class Main extends React.Component {

  constructor(props) {
    super(props);
  }
  
  render() {

    return (
        <div className="outerMostContainer">
          <div className="headerElement">
            BROCCOLI &#38; CO.
          </div>
    
          <div className="centerArea">
            <div className="centerAreaInner">
              <h1>A better way to enjoy every day.</h1><br/>
              <p>Be the first to know when we launch</p><br/>
              <p><button className="inviteBtn" onClick={this.props.showpopup}>Request an invite</button></p>
            </div>
    
            <div id="myModal" className={this.props.popUpShowing == true? 'modal':'modalNotShowing'}>
              {this.props.serverReturnedSuccess == false?( 
              <div className="modal-content">
                 
                <span className="close" onClick={this.props.quitpopup}>&times;</span>
                <h2>Request an invite</h2><br/>
    
                  <input type="text" id="fname" name="fullname" placeholder="full name" className="inputfield" onChange={e => this.props.setusername(e.target.value)}/><br/>
                  <input type="text" id="lemail" name="myemail" placeholder="Email" className="inputfield" onChange={e => this.props.setuseremail(e.target.value)}/><br/>
                  <input type="text" id="lconfirmemail" name="confirmemail" placeholder="Confirm Email" className="inputfield" onChange={e => this.props.setconfirmationemail(e.target.value)} /><br/>
                  <div>{this.props.errorMsg}</div><br/>
                  <div>{this.props.sendingMsg}</div><br/>
    
                  <button  className="sendBtn" onClick={this.props.senduserinformation}>Send</button>
              </div>
              ):
              (
                <div className="modal-content">
                  <h2>All Done!</h2><br/>
                  <button  className="inviteBtn" onClick={this.props.quitpopup}>OK</button>
                </div>    
              )
              }
            </div>
          </div>    
    
          <div className="footerElement">
              @ 2016 Brocroli &#38; CO. All Rights Reserved
          </div>        
    
        </div>  
    )


  }  



}

const mapStateToProps = state => ({
  popUpShowing: state.reducer.popUpShowing,
  serverReturnedSuccess: state.reducer.serverReturnedSuccess,
  errorMsg: state.reducer.errorMsg,
  sendingMsg: state.reducer.sendingMsg,
  
})

const mapDispatchToProps = dispatch => bindActionCreators({
  showpopup,
  quitpopup,
  setusername,
  setuseremail,
  setconfirmationemail,
  senduserinformation
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)