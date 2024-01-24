import styles from './BtnWithAlert.module.scss';
import { useState } from 'react';
import MainBtn from '../MainBtn/Index';

function BtnWithAlert(props){
    const {text, clickFunc} = props;

    const [showAlert, setShowAlert] = useState(false);

    return <div className={styles.btn_alert_ctn}>

            <MainBtn 
                type="button"
                onClick={() => setShowAlert(true)} 
                text={text}/>

            {showAlert &&
            <div className={styles.alert}>
                <p>Êtes-vous sûr ?</p>
                <MainBtn 
                    type="button"
                    text="NON" 
                    onClick={() => setShowAlert(false)}
                    />
                <MainBtn 
                    type="button"
                    text="OUI"
                    onClick={() => {
                        setShowAlert(false);
                        clickFunc();
                    }}/>
            </div>}

          </div>
}

export default BtnWithAlert;