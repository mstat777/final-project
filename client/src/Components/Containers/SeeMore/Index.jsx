import styles from './SeeMore.module.scss';
import { useState } from 'react';

function SeeMore(props) {
    const {text} = props;
    const [showMore, setShowMore] = useState(false);

    return <p>
                {showMore ? text : `${text.substring(0, 250)}`}
                { text.length > 250 ?
                <button type="button"
                    className={styles.seemore_btn}
                    onClick={() => setShowMore(!showMore)}>
                    { showMore ? "Voir moins" : "Voir plus" }
                </button>
                : null }
            </p>
}

export default SeeMore;