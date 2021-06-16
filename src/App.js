import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom'
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { formatRelative } from 'date-fns';
import parse from 'html-react-parser';





firebase.initializeApp({
  apiKey: "AIzaSyBvLHhnnzw3B0LHaDHqJMppqeoz4wUI1ys",
    authDomain: "viral-chat-e9512.firebaseapp.com",
    projectId: "viral-chat-e9512",
    storageBucket: "viral-chat-e9512.appspot.com",
    messagingSenderId: "506840620521",
    appId: "1:506840620521:web:c301c44d326e24a05f7f78",
    measurementId: "G-91G8RQ9PWV"
})



const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App" id="app">
      <header>
        <h1>#public</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

const formatDate = date => {
  let formattedDate = '';
  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(date, new Date());
    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Login with Google</button>
      <p>Do not violate the rules or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Logout</button>
  )
}

var active;
var MyDiv1
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.keyCode == 13 && active==true) {
    
    //ReactDOM.render(parse(MyDiv1), document.getElementById('root'))
    
  }
});

document.addEventListener("visibilitychange", event => {
  if (document.visibilityState == "visible") {
    console.log("tab is active")
    //ReactDOM.unmountComponentAtNode(document.getElementById('app'))
  } else {
    //MyDiv1 = document.getElementById('root').innerHTML
    //Fullscreen()
    active = true;
  }
})

function Fullscreen() {
  console.log("ran")
  //ReactDOM.render(
  //<div id="full"></div>,
  //document.getElementById('root')
  
//);
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(100);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName} = auth.currentUser;
    
    if(formValue.replace(/\s/g, '').length){
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName
    })
    
}
    setFormValue('');
}
    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    },[messages])
    


  return (<>
    <main id="main">

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>
     
    
    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message #public" />

      

    </form>
  </>)
}



function ChatMessage(props) {
  const { text, uid, photoURL, displayName, createdAt } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    //console.log(createdAt)
    console.log(text)
    console.log(displayName)
  return (
    <div class="container">
        <div class="image">
            <img src={photoURL} />
        </div>
        <div>
            <div className={`name`}>
                <p>{displayName}</p>
                <p id="date">{"o"}</p>
            </div>
            <div className={`message`}>
                <p>{text}</p>
            </div> 
        </div>
    </div>
  )

}




export default App;
