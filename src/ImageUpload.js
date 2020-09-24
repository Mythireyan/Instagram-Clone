import React, {useState} from 'react';
import {Button, Input} from '@material-ui/core';
import { db, storage } from './firebase';
import firebase from 'firebase';
import './imageUpload.css'

function ImageUpload ({username}) {
	const [caption, setCaption] = useState('');	
	const [progress, setProgress] = useState(0);	
	const [image, setImage] = useState(null);	

	const handleChange = (e =>{
		if(e.target.files[0]){
			setImage(e.target.files[0]);
		}
	})

	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				//progress function
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					);
				setProgress(progress);
			},
			(error) => {
				//Error function 
				console.log(error);
				alert(error.message);
			},
			()=>{
				//complete function
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then(url => {
						//post image inside db
						db.collection("posts").add({
							timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption:caption,
							imageUrl:url,
							username:username
						});
						setProgress(0);
						setCaption('');
						setImage(null);
					});
			}
		)
	}
	return (
			<div className='imageUpload'>
			<progress className='imageUpload__progress' value={progress} max='100'/>
				<input type="text" 
				placeholder='Enter a caption' 
				onChange={event => setCaption(event.target.value)} 
				value={caption}/>
				<input type="file" onChange= {handleChange}/>
				<Button onClick={handleUpload}>
					Upload
				</Button>
			</div>
		   )
}

export default ImageUpload;
				// caption
				// imageUpload
				// progressbar