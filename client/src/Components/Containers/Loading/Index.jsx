import styles from "./Loading.module.scss";
import spinner from "./spinner.svg";

function Loading() {
    return <img src={spinner} alt="chargement de la page" className={styles.spinner}/>
}

export default Loading;