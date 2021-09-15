import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Convo from './components/Convo';
import Transactions from './components/Transactions';
import Messages from './components/Messages';
import {
  BrowserRouter as Router,
  Switch,
  Route,Redirect,
  Link
} from "react-router-dom";


const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages,data] = useState([]);

  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    // 
    // 
    // 
    

    contract.getMessages().then(setMessages);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const { fieldset, message, donation } = e.target.elements;

    fieldset.disabled = true;

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known
    contract.addMessage(
      { text: message.value },
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toFixed()
    ).then(() => {
      contract.getMessages().then(messages => {
        setMessages(messages);
        message.value = '';
        donation.value = SUGGESTED_DONATION;
        fieldset.disabled = false;
        message.focus();
      });
    });
  };

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Guest Book'
    );
  };



  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
   <Router>
    <main>

    <Switch>
     <Route path="/convo">
            <Convo contract={contract} currentUser={currentUser} nearConfig={nearConfig} wallet={wallet}/>
        </Route>
       <Route path="/signin">
            <SignIn />
        </Route>
        <Route path="/transactions">
            <Transactions />
        </Route>


        
    </Switch>


       
  


        <nav className="navbar navbar-light bg-light navStyleCustom">
            <div className="container">
                <a className="navbar-brand navStyleCustomA" href="#">
                    <img src="https://cdn.kulfyapp.com/kelvin/logo.png" alt="" width="298" height="35" />
                </a>
            </div>
        </nav><div className="container containerDiv">
                <div>
                    <a onClick={signIn}>
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


    </main>
    </Router>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addMessage: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
