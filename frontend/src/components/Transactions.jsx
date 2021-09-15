import React, { useState, useEffect } from 'react';



let items=[{name:"girish"},{name:"mahesh"}];
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
    const response = await fetch('http://localhost:1337/uservotes/getUservotes');
    const users = await response.json();
    setUsers(users);
  }

  async function getUserStamps() {
    const response = await fetch('http://localhost:1337/getUserStamps?user=alice');
    const users = await response.json();
    setUsers(users);
  }

 async function AddVote() {
    console.log("Add vote");
  }

   async function DownVote() {
    console.log("Down vote");
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
    <div class="container" >

        <div>
       <ul>
        Votes Left :{votes}

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
                    <p><b>{item.name}</b> paid <b>Lyla A.</b></p>
                    <p><b>$50</b></p>
                </div>
                <div class="content-impact" >
                    <p class="content-uber" >Uber Ride</p>
                    <a href="/convo" class="btn-small">Analyse Impact</a>
                </div>
                <div>
                    <a  onClick={AddVote}  href="#"><img src="https://cdn.kulfyapp.com/kelvin/up-arrow.svg" width="8.37" height="19" alt="" /></a>
                    <p class="content-margin" >1</p>
                    <a onClick={DownVote}  href="#"><img src="https://cdn.kulfyapp.com/kelvin/down_arrow.svg" width="8.37" height="19" alt=""/></a>
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

