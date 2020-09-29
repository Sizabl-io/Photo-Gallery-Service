import React from 'react';
import Photo from './Photo.jsx';

const PhotoList = (props) => {
  console.log("photoList: ",props);
  return (
    <ul>
      {props.photos.map((photo)=>{
        return <Photo photo={photo}/>
      })
      }
    </ul>
  );

}

export default PhotoList;