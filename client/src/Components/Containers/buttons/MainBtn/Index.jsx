import styles from './MainBtn.module.scss';

function MainBtn(props){
    const {text, onClick} = props;

    return <button onClick={onClick} className={styles.button}>
                {text}
            </button>
}

export default MainBtn;