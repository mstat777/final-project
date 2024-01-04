import styles from "./Loading.module.scss";
import spinner from "./spinner.svg";

function Loading() {
    return <img src={spinner} alt="image qui tourne lors du chargement de la page" className={styles.spinner}/>
}

export default Loading;