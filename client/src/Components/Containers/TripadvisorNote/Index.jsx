import styles from './tripadvisornote.module.css';
import logo from './img/logo-8.png';

function TripadvisorNote({note}){
    const maxNote = 5;

    // on récupère la partie entière et la partie décimale de la note :
    const intPart = Math.trunc(note);
    const fracPart = note % 1;

    // on crée 2 tableaux : 
    const arrFullCircles = []; // cercles remplis
    const arrNotFullCircles = []; // cercles vides ou remplis partiellement 

    // on crée les cercles remplis et les stocke dans le tableau correspondant :
    for (let i = 0; i < intPart; i++){
        arrFullCircles.push(
            <div key={i} className={styles.note_circle}>
                <div className={styles.note_circle_fill}></div>
            </div>
        );
    }
    // on crée les cercles pas remplis et les stocke dans le tableau correspondant :
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

    return (
        <div className={styles.note_ctn}>
            {/*<img src={logo} alt=""/>*/}
            {arrFullCircles}
            {arrNotFullCircles}
        </div>
    )
}

export default TripadvisorNote;