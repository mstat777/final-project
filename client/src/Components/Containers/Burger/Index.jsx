import styles from './burger.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Burger() {

    const [burgerOpen, setBurgerOpen] = useState(false);

    const toggleBurger = () => {
        setBurgerOpen(!burgerOpen);
    }

    return (
        <div className={`${styles.burger_menu} ${burgerOpen ? styles.show_burger_menu : styles.hide_burger_menu }`}>
            <div className={styles.burger_items_ctn}>
                <Link className={styles.burger_item} to={"/"}>Home</Link>
                <Link className={styles.burger_item} to={"/"}>About</Link>
                <Link className={styles.burger_item} to={"/"}>Contact</Link>
            </div>
            
            <Link onClick={() => toggleBurger()} className={styles.burger_icon} href="">
                <span className={styles.burger_bar}></span>
            </Link>
        </div>
    )
}

export default Burger;