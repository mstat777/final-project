import styles from './BtnWithPopup.module.scss';
import { useState } from 'react';
import MainBtn from '../MainBtn/Index';

function BtnWithPopup(props){
    const {text, clickFunc} = props;

    const [showPopup, setShowPopup] = useState(false);

    return <div className={styles.btn_popup_ctn}>

            <MainBtn 
                type="button"
                onClick={() => setShowPopup(true)} 
                text={text}/>

            {showPopup &&
            <div className={styles.popup}>
                <p>Êtes-vous sûr ?</p>
                <MainBtn 
                    type="button"
                    text="NON" 
                    onClick={() => setShowPopup(false)}
                    />
                <MainBtn 
                    type="button"
                    text="OUI"
                    onClick={() => {
                        setShowPopup(false);
                        clickFunc();
                    }}/>
            </div>}

          </div>
}

export default BtnWithPopup;