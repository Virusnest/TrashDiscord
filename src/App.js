import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { formatRelative } from 'date-fns';



firebase.initializeApp({
  apiKey: "AIzaSyBlCmXMP1hdbZIibDAhENHb__uLC4VrEtw",
    authDomain: "trashdiscord-70a03.firebaseapp.com",
    projectId: "trashdiscord-70a03",
    storageBucket: "trashdiscord-70a03.appspot.com",
    messagingSenderId: "955465757058",
    appId: "1:955465757058:web:d15b1bc9fd850ec8b91f9b",
    measurementId: "G-2Q85W06ESV"
})



const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
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
