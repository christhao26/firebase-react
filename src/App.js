import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
firebase.initializeApp({
  //your config
 
apiKey: "AIzaSyD73Um6vF80d7kVMTURy7UECDbiOAX2oAE",
    authDomain: "mychatapp-21a16.firebaseapp.com",
    databaseURL: "https://mychatapp-21a16-default-rtdb.firebaseio.com",
    projectId: "mychatapp-21a16",
    storageBucket: "mychatapp-21a16.appspot.com",
    messagingSenderId: "1042858776682",
    appId: "1:1042858776682:web:c848017acdb70e14c91213"
  })

const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>Chat Room</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    var d = new Date();
    var hr = d.getHours();
      var min = d.getMinutes();
      let time=hr+":"+min;
      text: time+" "+formValue,


    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return (<>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
      <button type="submit" disabled={!formValue}>Send</button>
    </form>
  </>)
}
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}
export default App;