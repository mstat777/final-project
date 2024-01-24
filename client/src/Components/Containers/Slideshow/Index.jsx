import styles from './Slideshow.module.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import SlideshowBtn from './SlideshowBtn';

function Slideshow({type}){
    const IMG_URL = process.env.REACT_APP_IMG_URL;
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

    return <div className={styles.slideshow_ctn}>    
                { type === "destination" &&
                destinationImages.map((el, index) =>
                <div key={index}
                        className={slideIndex === index + 1 ? `${styles.slide} ${styles.active_anim}` : `${styles.slide}`}> 
                    <img src={`${IMG_URL}/img/destinations/${el.url_image}`} alt="la destination"/>
                </div>
                )}
                { type === "lodging" &&
                lodgingImages.map((el, index) =>
                <div key={index}
                        className={slideIndex === index + 1 ? `${styles.slide} ${styles.active_anim}` : `${styles.slide}`}> 
                    <img src={`${IMG_URL}/img/lodgings/${el.url_image}`} alt="l'hébergement"/>
                </div>
                )}
                <SlideshowBtn moveSlide={nextSlide} direction={"next"} />
                <SlideshowBtn moveSlide={prevSlide} direction={"prev"}/>
            </div>
}

export default Slideshow;