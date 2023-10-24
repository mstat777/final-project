import styles from './detail.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setDestination, setHebergement
 } from "../../../store/slices/travel";
import { Link } from 'react-router-dom';

function Detail(){
    const dispatch = useDispatch();
    const { hebergement } = useSelector((state) => state.allTravel);
    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);

    useEffect(() => {
        async function parseData() {
            const result = await JSON.parse(localStorage.getItem('destination'));
            setDestination(result);
        }
        parseData();

        // on récupère les données de l'hébérgement selon l'id de la destination (clé étrangère) :
        async function fetchData() {
            try {
                const result = await (await fetch(`/api/v.0.1/travel/hebergement/${destination.hebergement_id}`)).json();
                dispatch(setHebergement(result.datas[0]));
                localStorage.setItem("hebergement", JSON.stringify(result.datas[0]));
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        //console.log("destination.hebergement_id = "+destination.hebergement_id);
    }, []);

    return (
        <main id="detail">
            { destination &&
            <div className={styles.detail_section}>
                <img src={"../../img/hebergements/"+hebergement.url_image_initiale} alt="" />
                <h4>{hebergement.nom}</h4>
                <h3>{destination.nom}</h3>
                <table className={styles.packs_div}>
                    <thead>
                        <tr> 
                            <th>date de départ</th> 
                            <th>date de retour</th>
                            <th>durée</th>
                            <th>prix/TTC/adulte</th>
                            <th>prix/TTC/enfant</th>
                            <th>réserver</th>
                        </tr>
                    </thead>
                    <tbody>      
                        { packs.map((pack) => 
                            <tr>
                                <td>{pack.date_depart.slice(0, pack.date_retour.indexOf('T'))}</td>
                                <td>{pack.date_retour.slice(0, pack.date_retour.indexOf('T'))}</td> 
                                <td>{pack.duree+1}J/{pack.duree}N</td>  
                                <td>{pack.prix_adulte}</td> 
                                <td>{pack.prix_enfant}</td> 
                                <td>
                                    <Link to={"/reservation"}>Réserver</Link>
                                </td> 
                            </tr>
                        )}
                    </tbody>
                </table>
                <p><span>Présentation</span>{hebergement.presentation}</p>
                <p><span>Equipement</span>{hebergement.equipement}</p>
                <p><span>Logement</span>{hebergement.logement}</p>
                <p><span>Restauration</span>{hebergement.restauration}</p>
                <p><span>Formules</span>{hebergement.formules}</p>
                <p><span>Loisirs</span>{hebergement.loisirs}</p>
                <p><span>Enfants</span>{hebergement.enfants}</p>
                <p>Tripadvisor : {hebergement.tripadvisor}</p>
            </div>
            }
        </main>
    )
}

export default Detail;