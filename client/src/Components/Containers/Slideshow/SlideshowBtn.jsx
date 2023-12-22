import React from 'react';
import styles from './slideshow.module.css';
import leftArrow from "./icons/left-arrow-back-svgrepo-com.svg";
import rightArrow from "./icons/right-arrow-next-svgrepo-com.svg";

function SlideshowBtn({moveSlide, direction}){

    return <button onClick={moveSlide}
                   className={direction === "next" ? `${styles.slideshow_btn} ${styles.next}` : `${styles.slideshow_btn} ${styles.prev}`}>
                <img src={direction === "next" ? rightArrow : leftArrow} 
                     alt={direction === "next" ? "flêche à gauche" : "flêche à droite"} />
            </button>
}

export default SlideshowBtn;