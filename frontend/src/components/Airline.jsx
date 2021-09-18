import React from "react";
import axios from "axios";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import ReactDOM from "react-dom";

export class airlineEstimate extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.contract = props.contract;
    this.currentUser = props.currentUser;
    this.nearConfig = props.nearConfig;
    this.wallet = props.wallet;

    this.state = {from: '',to:''};


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

  submitAirline = async (e) => {
  console.log("before setting state ",this.state);
  this.state.from = 'sfo';
  this.state.to = 'jfk';
        console.log("test 123",this.state);
e.preventDefault();

           // Sample climate api using carboninterface.com
    const climateApiRoot = 'https://www.carboninterface.com/api/v1';
    const climateApiToken = 'c87SduMH2ZQS7p3f8DAqKw'

    axios.defaults.headers.common = {
    "Authorization": "Bearer "+climateApiToken,
      "Content-Type": "application/json"
    }

   
    const authResponse = await axios.get(`${climateApiRoot}/auth`);
     console.log(`auth Response from convo: ${JSON.stringify(authResponse.data)}`);
    


    // estimates 
    const estimatesRequestPath = '/estimates';
    const estimatesRequestBody = {
        "type": "flight",
        "passengers": 2,
        "legs": [
          {"departure_airport": this.state.from, "destination_airport": this.state.to},
          {"departure_airport": this.state.to, "destination_airport": this.state.from}
        ]
    };
    
    const estimateResponse = await axios.post(`${climateApiRoot}${estimatesRequestPath}`, estimatesRequestBody);
     console.log(`estimate Response from climate api: ${JSON.stringify(estimateResponse.data.data.attributes.carbon_lb)}`);

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
      <div className="base-container" ref={this.props.containerRef}>

  <nav class="navbar navbar-light bg-light flow" >
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="https://cdn.kulfyapp.com/kelvin/icons8-menu.png" alt="" width="28" height="19.6" />
            </a>
            <a class="navbar-brand" href="#">
                <img src="https://cdn.kulfyapp.com/kelvin/logo.png" alt="" width="224" height="27" />
            </a>
            <a class="navbar-brand flow-brand" href="#" >
                <img src="https://cdn.kulfyapp.com/kelvin/icons8-create.png" alt="" width="26" height="26" />
            </a>
        </div>
    </nav>
    <ul class="nav nav-pills nav-fill mt-2 mx-2 ">
        <li class="nav-item">
            <a class="nav-link active color-bg" aria-current="page" href="/airline">Impact Flow</a>
        </li>
        <li class="nav-item">
            <a class="nav-link text-white" href="/convo">Impact Discussion</a>
        </li>
    </ul>
    <div class="container flow-container" >
        <h1 class="text-centers carbon-text" >Carbon Emission Analysis</h1>
        <h6 class="mt-3 text-center">Transaction Type</h6>


        <div class="airline-container" >
         
            <div class="mb-2">
                <input type="text"  value={this.state.from} onChange={this.handleFromChange}  placeholder="From" />
            </div>
            <div class="mb-2">
                <input type="text"   value={this.state.to} onChange={this.handleToChange} placeholder="To" />
            </div>
            <select class="form-select mb-2 select-dropdown" aria-label="Default select example">
                <option selected>Travel Class</option>
                <option value="1">Business</option>
                <option value="2">Economy</option>
              </select>
        </div>


        <div class="d-flex justify-content-center flex-column mt-5 options-list">
            <a href="#" onClick={this.submitAirline.bind(this)} class="options-item">Submit</a>
        </div>
    
    </div>
   
</div>
     
    )
  }
}

export default airlineEstimate;


