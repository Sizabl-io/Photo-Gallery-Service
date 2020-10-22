import React from 'react';
import Photo from './Photo.jsx';
import classes from '../style/App.module.css';

const PhotoList = (props) => {
  return (
    <div className={classes.body} >
      {props.photos.map((photo, key) => {
        return <Photo setPic={props.setPic} toggleModal={props.toggleModal} key={key} photo={photo}/>
      })
      }
    </div>
);

}

export default PhotoList;