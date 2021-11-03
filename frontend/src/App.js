import logo from './logo.svg';
import './App.css';
import './components/assets/style.css';
import { useContractKit } from '@celo-tools/use-contractkit';
import { ContractKitProvider } from '@celo-tools/use-contractkit';
import '@celo-tools/use-contractkit/lib/styles.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import SignIn from './components/SignIn';
import Transactions from './components/Transactions';
import Header from './components/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,Redirect,
  Link
} from "react-router-dom";

function App() {
  const { address, connect } = useContractKit()
  return (

    <div className="App">
  <Router>
    <main>

    <Switch>
 
       <Route path="/signin">
            <SignIn  address={address} connect={connect}/>
        </Route>
        <Route path="/transactions">
            <Transactions />
        </Route>      
    </Switch>


      
<Route exact path="/">
  {address ? <Redirect to="/transactions" /> : <Redirect to="/signin" />}
</Route>

<Route exact path="/signin">
  {address ? <Redirect to="/transactions" /> : <Redirect to="/signin" />}
</Route>
  


   


    </main>
    </Router>


      {
                    address ? (
                        <label>Welcome {address}</label>
                    ) : (
                        <>
                            
                        </>
                    )
                }
    </div>
  );
}

function WrappedApp() {
  return (
    <ContractKitProvider
      dapp={{
          name: "My awesome dApp",
          description: "My awesome description",
          url: "https://example.com",
        }}
    >
      <App />
    </ContractKitProvider>
  );
}
export default WrappedApp;