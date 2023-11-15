import styles from './slider.module.css';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import SliderBtn from './SliderBtn';

function Slider(){
    const { destinationImages } = useSelector((state) => state.allTravel);
    //console.log(destinationImages);
    const [slideIndex, setSlideIndex] = useState(1);

    const nextSlide = () => {
        if(slideIndex !== destinationImages.length){
            setSlideIndex(slideIndex + 1);
        } 
        else if (slideIndex === destinationImages.length){
            setSlideIndex(1);
        }
    }
    
    const prevSlide = () => {
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1);
        } 
        else if (slideIndex === 1){
            setSlideIndex(destinationImages.length);
        }
    }

    /*useEffect(() => {
        
    },[])*/

    return (
        <div className={styles.slider_ctn}>    
            {destinationImages.map((el, index) =>
            <div key={el.id}
                    className={slideIndex === index + 1 ? `${styles.slide} ${styles.active_anim}` : `${styles.slide}`}> 
                <img src={`../../img/destinations/${el.url_image}`} alt=""/>
            </div>
            )}
            <SliderBtn moveSlide={nextSlide} direction={"next"} />
            <SliderBtn moveSlide={prevSlide} direction={"prev"}/>
        </div>
    )
}

export default Slider;