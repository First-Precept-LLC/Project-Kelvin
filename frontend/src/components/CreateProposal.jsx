import React from "react";
import axios from "axios";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import ReactDOM from "react-dom";
import Header from './Header';
import ProjectKelvin from '../abis/ProjectKelvin.json'



import {
  BrowserRouter as Router,
  Switch,
  Route,Redirect,
  Link
} from "react-router-dom";

export class CreateProposal extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.contract = props.contract;
    this.currentUser = props.currentUser;
    this.nearConfig = props.nearConfig;
    this.wallet = props.wallet;
    this.address = props.address;
    this.connect = props.connect;
 

    this.state = {};

    console.log(`constructor before trigger`);

    console.log(this.address, this.currentUser, this.nearConfig, this.wallet);

     // createProposalCall();
  }


  createProposalCall = async () => {

    const Web3 = require('web3')
    const ContractKit = require('@celo/contractkit')
    const web3 = new Web3('https://alfajores-forno.celo-testnet.org')
    const kit = ContractKit.newKitFromWeb3(web3);
      console.log('test logs');
        let instance = new kit.web3.eth.Contract( ProjectKelvin.abi, '0x4F9f9c56C4Ba59545c5e8Ced29AA6e8E588A0dB8')
    let name = await instance.methods.name().call()
    console.log(`Current Contract Name: "${name}"`);
   let address = await instance.methods.createProposal(50,"Kelvin","K").call();
    console.log(`Address of minted token: ${address}`);
 }






  async componentDidMount() {
    console.log("componentDidMount");
    console.log(this.contract, this.currentUser, this.nearConfig, this.wallet);
    if (this.wallet && this.contract)
      await this.triggerOAuth();
    // this.forceUpdate()
  }







  async shouldComponentUpdate() {
    console.log(`shouldComponentUpdate`);
  }

  




  render() {

    console.log(`render start ${JSON.stringify(this.state.threads)}`);
    return (



<div class="bg-white">
      <Header />

  
  
    <div class="container page-wrapper text-center" >
 <section class="container text-center center-block">
        <div class="row">
            <div class="col">
                <h1 class="text-color">Create Proposal</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input type="text" name="name" placeholder="Name" />
                <div class="form-floating">
                    <textarea class="form-control" placeholder="Description" id="floatingTextarea2" ></textarea>
                    <label for="floatingTextarea2">Description</label>
                </div>
                <input type="text" placeholder="KPI" />
            </div>
        </div>
        <div class="d-grid gap-2 mt-4">
            <button class="btn btn-primary btn-color" type="button"> Analyse Impact</button>
            <button onClick={this.createProposalCall} class="btn btn-primary btn-color" type="submit"> Submit</button>
        </div>
    </section>
    </div>


 </div>
    )
  }
}

export default CreateProposal;



