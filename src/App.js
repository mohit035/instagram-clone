import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post'
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import ImageUpload from './ImageUpload';
 import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [openSignIn, setOpenSignIn] = useState('')
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

useEffect(() => {
 const unsubscribe = auth.onAuthStateChanged((authUser) => {
   if (authUser) {
     // user has logged in
     console.log(authUser);
     setUser(authUser);
      
   
    }  else {
     //user has logged out
     setUser(null);
    }
 })
 return () => {
   unsubscribe();
 }
}, [user, username]);
       

  // useeffect runs a peice of code based on a specific condition
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
     
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
      
    })
  }, []);

 const signUp = (event) => {
   event.preventDefault();
    auth
   .createUserWithEmailAndPassword(email, password)
   .then((authUser => {
      return authUser.user.updateProfile({
       displayName: username,
     })
   }))
   .catch((error) => alert(error.message));
   setOpen(false);

 }

 const signIn = (event) => {
   event.preventDefault();
   auth.signInWithEmailAndPassword(email, password)
   .catch((error) => alert(error.message));
   setOpen(false);
 }
  
  return (

    <div className="app">

     
   
   
    <Modal 
    open = {open}
    onClose = {() => setOpen(false)}
    >
       <div style={modalStyle} className={classes.paper}>
        <form className = "app_signup">
            <center>
                <img  className = "app_headerImage" 
                src= "https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-500x313.png" 
                alt = "instaimage"/>
            </center>
                <input type = "text"
                placeholder = "username"
                value = {username}
                onChange = {(e) => setUsername(e.target.value)} /> 
                
                <input placeholder = "email"
                type = "text"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)} />
                
                <input type = "password"
                placeholder = "password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)} />
                <Button type = "submit" onClick = {signUp}>Sign Up</Button>
        
        </form>
       </div>
    </Modal>

    <Modal 
    open = {openSignIn}
    onClose = {() => setOpenSignIn(false)}
    >

       <div style={modalStyle} className={classes.paper}>
        <form className = "app_signup">
            <center>
                <img  className = "app_headerImage" 
                src= "https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-500x313.png" 
                alt = "instaimage"/>
            </center>   
                <input placeholder = "email"
                type = "text"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)} />
                
                <input type = "password"
                placeholder = "password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)} />
                <Button type = "submit" onClick = {signIn}>Sign In</Button>
        
        </form>
       </div>
    </Modal>
    
    
     <div className = "app_header">
      <img  className = "app_headerImage" 
      src= "https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-500x313.png" 
      alt = "instaimage"/>

     {user ? (
      <button className = "logOut" onClick = {() => auth.signOut()}>LogOut</button>
       ): (
        <div className = "app_loginContainer">
      <button onClick = {() => setOpenSignIn(true)}>Sign In</button>

      <button onClick = {() => setOpen(true)}>Sign Up</button>
    </div>
    )}
    </div>
 
     <div className = "app_posts">
     <div className = "app_postsLeft">
     {
          posts.map(({id ,post}) => (
            <Post key= {id} postId = {id} user = {user} username = {post.username} caption = {post.caption} imageUrl ={post.imageUrl}/>
          ))
        }
     </div>
     <div className = "app_postsRight">
            <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          clientAccessToken='123|456'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
    </div>
 </div>
       
 
  
    

     
      {user?.displayName ?(
        <ImageUpload username = {user.displayName}/>
       ): (
        <h3>You need to login</h3>
       )}
       
    </div>
  );
}

export default App;
