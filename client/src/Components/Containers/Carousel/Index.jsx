import styles from './Carousel.module.scss';
import { useState, useEffect } from 'react';

function Carousel(){
    const IMG_URL = process.env.REACT_APP_IMG_URL;
    const images =['1', '2', '3', '4'];
    const [imgIndex, setImgIndex] = useState(1);

    const nextImage = () => {
        if(imgIndex !== images.length){
            setImgIndex(imgIndex + 1);
        } 
        else if (imgIndex === images.length){
            setImgIndex(1);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {nextImage()}, 8000);
        return () => clearInterval(interval);
    })

    return <div className={styles.carousel_ctn}> 
                { images.map((el, i) =>
                    <div key={i}
                            className={imgIndex === i + 1 ? `${styles.slide} ${styles.active_anim}` : `${styles.slide}`}> 
                        <img src={`${IMG_URL}/carousel/${i+1}.jpg`} alt="destination exotique"/>
                    </div>
                )}
            </div>
}

export default Carousel;