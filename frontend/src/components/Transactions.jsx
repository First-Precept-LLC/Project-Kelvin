import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import ReactDOM from "react-dom";
import { Dropdown } from 'react-bootstrap';


let items=[];
let itemList=[];
let votes=0;
items.forEach((item,index)=>{
  itemList.push( 
)
})

const Transactions = () => {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    // 
    // 
    // 
    
    console.log('items ',users);
        getUsers();
        getUserStamps();

    
  }, []);

  async function getUsers() {
    const response = await fetch('http://localhost:1337/uservotes/getTransactionPage?pageNumber=1');
    const users = await response.json();
    items = users.data;
    console.log('items 123',items);
    setUsers(users);
  }

  async function getUserStamps() {
    votes = 10;
    const response = await fetch('http://localhost:1337/uservotes/getUserStamps?user=gkolluri.testnet');
    const users = await response.json();
    console.log('votes ',users);
   setUsers(users);
  }

 async function AddVote(item) {
    votes = votes - 1;
    item.votecount = item.votecount  + 1;

    const response = await fetch(`http://localhost:1337/uservotes/updateVoteForTransaction?stampType=halfstamp&fromId=gkolluri.testnet&fromName=${item.sourceName}&toIdSource=${item.votedFor}&toIdDest=ethel_near_id&toTransaction=xxyg&negative=false`);
    const users = await response.json();
    setUsers(users);
  }

async function DownVote(item) {
    votes = votes - 1;
    item.votecount = item.votecount  - 1;
    const response = await fetch(`http://localhost:1337/uservotes/updateVoteForTransaction?stampType=halfstamp&fromId=gkolluri.testnet&fromName=${item.sourceName}&toIdSource=${item.votedFor}&toIdDest=ethel_near_id&toTransaction=xxyg&negative=true`);
    const users = await response.json();
    setUsers(users);
  }

  return (
    <>
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
    <div class="container page-wrapper" >

        <div>
       <ul class="p-0">
        <h3 class="text-center m-3">Votes Left :{votes}</h3>

           <div>

    </div>

    {items.map(function(item, index){
                    return (<>


                        <div class="content-wrapper" >
                <div class="content-component">
                    <div class="content-body"  >
                        <img src="https://cdn.kulfyapp.com/kelvin/dp.png" alt="" width="48" height="48" />
                        <img class="image-set" src="https://cdn.kulfyapp.com/kelvin/arrow.svg" alt="" width="18.01" height="13.72" />
                        <img src="https://cdn.kulfyapp.com/kelvin/dp.png" alt="" width="48" height="48"/>
                    </div>
                    <p><b>{item.from}</b> paid <b>{item.to}</b></p>
                    <p><b>Total - {item.amountSent} </b></p>
                </div>
                <div class="content-impact" >
                    <p class="content-uber" >Uber Ride</p>
                    <a href="/flow" class="btn-small">Analyse Impact</a>
                </div>
                <div class="text-center">
                    <a onClick={() => AddVote(item)} href="#"><img src="https://cdn.kulfyapp.com/kelvin/up-arrow.svg" width="8.37" height="19" alt="" /></a>
                    <p class="content-margin " >{item.votecount}</p>
                    <p class="content-margin b-text" >Rewards - ${item.votecount*0.3}</p>
                    <a onClick={() => DownVote(item)}   href="#"><img src="https://cdn.kulfyapp.com/kelvin/down_arrow.svg" width="8.37" height="19" alt=""/></a>
                </div>
            </div>
                    </>);
                  })}

        {itemList}


      </ul>

        </div>
    </div>
    </>
  );
};

export default Transactions;

