import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';



function getModalStyle() {
  const top = 50 ;
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
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn , setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState (null);

  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if(authUser) {
            //user has logged in
            console.log(authUser);
            setUser(authUser);
        }else{
          //user has logged out
          setUser (null);
        }
      })
      return () => {
        //perform some cleanup actions
      }
    }, [user, username])

     //useEffect runs a piece of code on specific condition 
      useEffect(() =>{
        //this is were code runs
        db.collection('posts').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
          //every time a new post is added this code is fired
          setPosts(snapshot.docs.map(doc => ({
            id:doc.id,
            post:doc.data()
          })));
        })
      }, []);

    
 
 const signUp = (event => {
  event.preventDefault();

  auth.createUserWithEmailAndPassword (email, password)
  .then((authUser =>{
    return authUser.user.updateProfile({
      displayName:username,
    })
  }))
  .catch((error) => alert(error.message));

  setOpen(false);
 })

 const signIn = (event => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      setOpenSignIn(false);
 })
  return (
    <div className="app">
      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
            <form className = 'app__signUp'>
                <center>
                   <img 
                    className = 'app__headerImage' 
                    src="data:image/png;base64,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"
                    alt='instagram logo'/>
                </center>      
                  <Input
                  placeholder='username'
                  type='text'
                  value={username}
                  onChange= {(e) => setUsername(e.target.value)}
                  />
                 <Input
                  placeholder='email'
                  type='text'
                  value={email}
                  onChange = {(e) => setEmail(e.target.value)}
                  />
                  <Input
                  placeholder='password'
                  type='password'
                  value={password}
                  onChange = {(e) => setPassword(e.target.value)}
                  />  
                  <Button type='submit' onClick={signUp}>Sign Up</Button>
            </form>
      </div>

      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
            <form className = 'app__signUp'>
                <center>
                   <img 
                    className = 'app__headerImage' 
                    src="data:image/png;base64,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"
                    alt='instagram logo'/>
                </center>      
                 <Input
                  placeholder='email'
                  type='text'
                  value={email}
                  onChange = {(e) => setEmail(e.target.value)}
                  />
                  <Input
                  placeholder='password'
                  type='password'
                  value={password}
                  onChange = {(e) => setPassword(e.target.value)}
                  />  
                  <Button type='submit' onClick={signIn}>Sign In</Button>
            </form>
      </div>
      </Modal>

      <div className='app__header'>
        <img 
        className = 'app__headerImage' 
        src="data:image/png;base64,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"
        alt='instagram logo'/>
        
        {user ? (
          <Button onClick={() =>auth.signOut()}>Log Out</Button>
        ) : (
          <div className = 'app__loginContainer'>
          <Button onClick={() =>setOpenSignIn (true)}>Sign In</Button>
          <Button onClick={() =>setOpen (true)}>Sign Up</Button>
          </div>  
          
        )}
      </div>

      <div className='app__posts'>
      <div className='app__posts--left'>
         {
        posts.map(({ id, post}) => (
        <Post  postId={id} key={id}  user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
      ))
      } 
      </div>
      <div className='app__posts--right'>
        <InstagramEmbed
          url='https://www.instagram.com/p/B60m0SzHbeG/?utm_source=ig_web_copy_link'
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

      
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
        ) : (
          <h3> Sorry you need to login to upload</h3>
        )}

       {
     //    <Post username= 'Nabil' caption='Attending Accenture training program' imageUrl='https://cdn.evilmartians.com/front/posts/optimizing-react-virtual-dom-explained/cover-a1d5b40.png'/> 
     // <Post username= 'Nagarjun' caption='Got selected for capegemini' imageUrl='https://cdn.auth0.com/blog/illustrations/reactjs.png'/> 
     // <Post username= 'Clement' caption='Want to be a hacker' imageUrl='https://blog.addthiscdn.com/wp-content/uploads/2014/11/addthis-react-flux-javascript-scaling.png'/> 
        // HEADER
        // POSTS
        // POSTS
      }
    </div>
  );
}

export default App;
