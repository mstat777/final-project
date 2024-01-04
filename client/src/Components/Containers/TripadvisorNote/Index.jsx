import styles from './TripadvisorNote.module.scss';

function TripadvisorNote({note}){
    const maxNote = 5;

    // parties entière et décimale de la note :
    const intPart = Math.trunc(note);
    const fracPart = note % 1;

    const arrFullCircles = []; // cercles pleins
    const arrNotFullCircles = []; // cercles pas pleins

    // les cercles remplis :
    for (let i = 0; i < intPart; i++){
        arrFullCircles.push(
            <div key={i} className={styles.note_circle}>
                <div className={styles.note_circle_fill}></div>
            </div>
        );
    }
    // les cercles pas remplis :
    for (let i = 0; i < maxNote - intPart; i++){
        if (i !== 0) {
            arrNotFullCircles.push(
                <div key={maxNote+i} className={styles.note_circle}>
                    <div className={styles.note_circle_fill}></div>
                </div>
            );
        } else if (i === 0) {
            arrNotFullCircles.push(
                <div key={maxNote+i} className={styles.note_circle} id={`divCircleFract`}>
                    <div className={styles.note_circle_fill} style={{width:`${fracPart*0.7}em`}}></div>
                </div>
            )
        }
    }

    return <div className={styles.note_ctn}>
                {arrFullCircles}
                {arrNotFullCircles}
            </div>
}

export default TripadvisorNote;