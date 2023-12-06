import styles from "./loading.module.css";
import spinner from "./spinner.svg";

function Loading() {
    return <img src={spinner} alt="" className={styles.spinner}/>;
}

export default Loading;