import React from "react";
import axios from "axios";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import ReactDOM from "react-dom";

export class signIn extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.contract = props.contract;
    this.currentUser = props.currentUser;
    this.nearConfig = props.nearConfig;
    this.wallet = props.wallet;

    this.state = {};

    console.log(`constructor before trigger`);

    console.log(this.contract, this.currentUser, this.nearConfig, this.wallet);
  }


  async componentDidMount() {
    console.log("componentDidMount");
    console.log(this.contract, this.currentUser, this.nearConfig, this.wallet);
    if (this.wallet && this.contract)
      await this.triggerOAuth();
    // this.forceUpdate()
  }



  handleClick = async () => {
		console.log("test 123");
		  this.wallet.requestSignIn(
      'gkolluri.testnet',
      'NEAR Guest Book'
    );
  }



  async shouldComponentUpdate() {
    console.log(`shouldComponentUpdate`);
  }

  triggerOAuth = async () => {
    // Sample signature generation code using near-api-js.js
    const convoApiRoot = 'https://theconvo.space/api';
    const convoApiToken = 'CONVO'

    axios.defaults.headers.common = {
      "Content-Type": "application/json"
    }

    let accountId = this.wallet.getAccountId()
    const timestamp = Date.now()
    const tokenMessage = new TextEncoder().encode(`I allow this site to access my data on The Convo Space using the account ${accountId}. Timestamp:${timestamp}`);
    const signatureData = await this.wallet.account().connection.signer.signMessage(tokenMessage, accountId, 'testnet');
    const authTokenRequestPath = '/auth';
    const authTokenRequestBody = {
      "signature": Buffer.from(signatureData.signature).toString('hex'),
      "signerAddress": Buffer.from(signatureData.publicKey.data).toString('hex'),
      "accountId": accountId,
      "timestamp": timestamp,
      "chain": "near"
    };
    // console.log(`send request to convo URL: ${convoApiRoot}${authTokenRequestPath}?apikey=${convoApiToken} with Data: ${JSON.stringify(authTokenRequestBody)}`);
    const authResponse = await axios.post(`${convoApiRoot}${authTokenRequestPath}?apikey=${convoApiToken}`, authTokenRequestBody);
    // console.log(`auth Response from convo: ${JSON.stringify(authResponse)}`);
    this.authToken = authResponse.data.message;

    // Validate Token
    const validateTokenRequestPath = '/validateAuth';
    const validateTokenRequestBody = {
      "signerAddress": accountId,
      "token": this.authToken
    };


    // console.log(`send request to convo URL: ${convoApiRoot}${validateTokenRequestPath}?apikey=${convoApiToken} with data: ${JSON.stringify(validateTokenRequestBody)}`);
    const validateTokenResponse = await axios.post(`${convoApiRoot}${validateTokenRequestPath}?apikey=${convoApiToken}`, validateTokenRequestBody);
    // console.log(`validateToken Response from convo: ${JSON.stringify(validateTokenResponse)}`);

    // Query threads
    const queryThreadsRequestPath = '/threads';
    // console.log(`send request to convo URL: ${convoApiRoot}${queryThreadsRequestPath}?apikey=${convoApiToken} with no data`);
    this.queryThreadsResponse = await axios.get(`${convoApiRoot}${queryThreadsRequestPath}?apikey=${convoApiToken}`);
    this.setState({ threads: this.queryThreadsResponse.data });
    this.threads = this.queryThreadsResponse.data;
    this.setState({threads: this.queryThreadsResponse.data})

    const listView = (
      this.state.threads && this.state.threads.map((item) => {
          <pre>Date</pre>
        })
    );


    // console.log(`queryThreads Response from convo: ${JSON.stringify(this.queryThreadsResponse)}`);

    // Query comments by thread
    // let queryCommentsRequestPath = `/comments?threadId=${this.queryThreadsResponse.data[1]._id}`;
    // console.log(`send request to convo URL: ${convoApiRoot}${queryCommentsRequestPath}&apikey=${convoApiToken} with no data`);
    // this.queryCommentsResponse = await axios.get(`${convoApiRoot}${queryCommentsRequestPath}&apikey=${convoApiToken}`);
    //
    // console.log(`queryComments Response from convo: ${JSON.stringify(this.queryCommentsResponse)}`);

    // // Post Comment by threadId
    // const postCommentsRequestPath = `/comments`;
    // const postCommentsRequestBody = {
    //   'token': authResponse.data.message,
    //   'signerAddress': accountId,
    //   'comment': `Test comment from near chain @ ${Date.now()}`,
    //   'threadId': this.queryThreadsResponse.data[1]._id,
    //   'url': encodeURIComponent(this.queryThreadsResponse.data[1].url),
    // };
    // console.log(`send request to convo URL: ${convoApiRoot}${postCommentsRequestPath}?apikey=${convoApiToken} with data: ${JSON.stringify(postCommentsRequestBody)}`);
    // const postCommentsResponse = await axios.post(`${convoApiRoot}${postCommentsRequestPath}?apikey=${convoApiToken}`, postCommentsRequestBody);
    // console.log(`postComments Response from convo: ${JSON.stringify(postCommentsResponse)}`);
    //
    // // Query comments by thread
    // console.log(`send request to convo URL: ${convoApiRoot}${queryCommentsRequestPath}&apikey=${convoApiToken} with no data`);
    // this.queryCommentsResponse = await axios.get(`${convoApiRoot}${queryCommentsRequestPath}&apikey=${convoApiToken}`);
    // console.log(`queryComments Response from convo: ${JSON.stringify(this.queryCommentsResponse)}`);
  }




  render() {
    console.log(`render start ${JSON.stringify(this.state.threads)}`);
    return (
      <div className="base-container flow-container" ref={this.props.containerRef}>
       
        <nav class="navbar navbar-light bg-light ">
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="https://cdn.kulfyapp.com/kelvin/icons8-menu.png" alt="" width="28" height="19.6" />
            </a>
            <a class="navbar-brand" href="#">
                <img src="https://cdn.kulfyapp.com/kelvin/logo.png" alt="" width="224" height="27" />
            </a>
            <a class="navbar-brand" href="#" >
                <img src="https://cdn.kulfyapp.com/kelvin/icons8-create.png" alt="" width="26" height="26" />
            </a>
        </div>
    </nav>
   <div className="container page-wrapper d-flex flex-column justify-content-center">
                <div>
                    <a onClick={this.handleClick}>
                        <div className="login-button">
                      
                            <img src="https://cdn.kulfyapp.com/kelvin/Mask Group 1.png" alt="" />

                            <span>Connect with Near Wallet</span>
                        </div>
                    </a>
                </div>
                <a href="#">
                    <div className="login-button">
                        <img src="https://cdn.kulfyapp.com/kelvin/icons8-facebook.png" alt="" />
                        <span>Connect with Facebook</span>
                    </div>
                </a>

            </div>
      </div>
    )
  }
}

export default signIn;








