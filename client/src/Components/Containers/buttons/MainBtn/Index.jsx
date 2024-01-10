import styles from './MainBtn.module.scss';

function MainBtn(props){
    const {type, text, onClick} = props;

    return <button 
                type={type}
                onClick={onClick} 
                className={styles.button}>
                    {text}
            </button>
}

export default MainBtn;