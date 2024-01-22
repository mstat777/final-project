import styles from './Popup.module.scss';
import { useState } from 'react';

function Popup(props){
    const {child, text} = props;
    const Child = child;
    const [showPopup, setShowPopup] = useState(false);
    return <>
            <button 
                type="button" 
                className={styles.popup_btn}
                onClick={() => setShowPopup(true)}>
                    {text}
            </button>
            {showPopup &&
                <div className={styles.popup_ctn}>
                    <div className={styles.popup}>
                        <Child/>
                        <button 
                            type="button"
                            className={styles.close_popup_btn} 
                            onClick={() => setShowPopup(false)}>
                                X
                        </button>
                    </div>
                </div>
            }
            </>
}

export default Popup;