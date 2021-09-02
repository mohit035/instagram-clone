import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { storage, db, ServerTimestamp } from "./firebase";
import './ImageUpload.css';
//import  firebase from "firebase";
//import firebase from "./firebase";


function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, SetProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
               let progress = Math.round(
                 (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                // progress function..
                SetProgress(progress);
            },
            (error) => {
                // error function 
                console.log(error);
                alert(error.message)
            },
            () => {
                // complete function ..
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then( url => {
                    // post image inside db
                     db.collection("posts").add({
                        timestamp: ServerTimestamp,
                        caption: caption,
                        imageUrl: url,
                        username: username,
                    });
    
                    SetProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );

    };

    return (
        <div className = "imageupload"> 

            <progress className = "imageupload_progress" value = {progress} max = "100" />
                <input type = "text"  placeholder ="Enter a caption.." onChange={event => setCaption(event.target.value)} value = {caption}/>
                <input className = "file" type = "file" onChange = {handleChange} />
                <Button onClick = {handleUpload}>Upload</Button>
            </div>
    )
}

export default ImageUpload
