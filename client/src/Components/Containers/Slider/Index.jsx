import styles from './slider.module.css';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import SliderBtn from './SliderBtn';

function Slider({type}){
    console.log(type);
    const { destinationImages } = useSelector((state) => state.allTravel);
    const { lodgingImages } = useSelector((state) => state.allTravel);

    const [slideIndex, setSlideIndex] = useState(1);

    const nextSlide = () => {
        if (type === "destination") {
            if(slideIndex !== destinationImages.length){
                setSlideIndex(slideIndex + 1);
            } 
            else if (slideIndex === destinationImages.length){
                setSlideIndex(1);
            }
        }
        else if (type === "lodging") {
            if(slideIndex !== lodgingImages.length){
                setSlideIndex(slideIndex + 1);
            } 
            else if (slideIndex === lodgingImages.length){
                setSlideIndex(1);
            }
        }
    }
    
    const prevSlide = () => {
        if (type === "destination") {
            if(slideIndex !== 1){
                setSlideIndex(slideIndex - 1);
            } 
            else if (slideIndex === 1){
                setSlideIndex(destinationImages.length);
            }
        }
        else if (type === "lodging") {
            if(slideIndex !== 1){
                setSlideIndex(slideIndex - 1);
            } 
            else if (slideIndex === 1){
                setSlideIndex(lodgingImages.length);
            }
        }
    }

    return (
        <div className={styles.slider_ctn}>    
            { type === "destination" &&
            destinationImages.map((el, index) =>
            <div key={el.id}
                    className={slideIndex === index + 1 ? `${styles.slide} ${styles.active_anim}` : `${styles.slide}`}> 
                <img src={`../../img/destinations/${el.url_image}`} alt=""/>
            </div>
            )}
            { type === "lodging" &&
            lodgingImages.map((el, index) =>
            <div key={el.id}
                    className={slideIndex === index + 1 ? `${styles.slide} ${styles.active_anim}` : `${styles.slide}`}> 
                <img src={`../../img/lodgings/${el.url_image}`} alt=""/>
            </div>
            )}
            <SliderBtn moveSlide={nextSlide} direction={"next"} />
            <SliderBtn moveSlide={prevSlide} direction={"prev"}/>
        </div>
    )
}

export default Slider;