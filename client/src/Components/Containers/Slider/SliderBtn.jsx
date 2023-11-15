import React from 'react';
import styles from './slider.module.css';
import leftArrow from "./icons/left-arrow-back-svgrepo-com.svg";
import rightArrow from "./icons/right-arrow-next-svgrepo-com.svg";

function SliderBtn({moveSlide, direction}){
    //console.log(moveSlide, direction);
    return (
        <button onClick={moveSlide}
                className={direction === "next" ? `${styles.slider_btn} ${styles.next}` : `${styles.slider_btn} ${styles.prev}`}
                >
            <img src={direction === "next" ? rightArrow : leftArrow} />
        </button>
    )
}

export default SliderBtn;