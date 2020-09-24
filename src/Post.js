import React, { useEffect , useState} from 'react';
import './Post.css';
import { Avatar } from '@material-ui/core';
import {db} from './firebase';
import firebase from 'firebase';


function Post({postId, user ,username, caption , imageUrl}){
	const [comment, setComment] = useState([]);
	const [comments, setComments] = useState([]);

	useEffect(()=>{
		let unsubscribe;
		if(postId){
			unsubscribe=db
				.collection('posts')
				.doc(postId)
				.collection('comments')
				.orderBy('timeStamp', 'desc')
				.onSnapshot((snapshot)=>{
					setComments(snapshot.docs.map((doc)=> doc.data()));
				});
		}
		return () =>{
			unsubscribe()
		} ;
		
	},[postId]);

	const postComment = (event)=> {
		event.preventDefault();
		db.collection('posts').doc(postId).collection('comments').add({
			comment:comment,
			username:user.displayName,
			timeStamp:firebase.firestore.FieldValue.serverTimestamp(),
		});
		setComment('');
	}
	return (
		<div className='post'>
			<header className='post__header'>
					<Avatar
					className='post__avatar'
					alt='Username'
					src='/static/images/avatar/1.jpg'
					/>
					<h3>{username}</h3>
			</header>
			<img className='post__image'src={imageUrl}/>
			<h4 className= 'username-caption-text'><strong>{username}:</strong> {caption}</h4>
			<div className='post__comments'>
				{comments.map((comment) => (
					<p>
						<strong>{comment.username}</strong> {comment.comment}
					</p>
				))
			}
			</div>
			{user && (
				<form className='post__commentBox'>
				<input 
				type="text"
				className='post__input'
				placeholder='Add a comment'
				value={comment}
				onChange={(e)=> setComment(e.target.value)}
				/>
				<button
				className='post__button'
				disabled={!comment}
				type='submit'
				onClick={postComment}
				>
					Post
				</button>
			</form>
			)}
			
		</div>
		)
}
			/*
			header -> avatar + username
			image
			username + caption
			*/
export default Post;