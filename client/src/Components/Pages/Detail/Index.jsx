import styles from './detail.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setDestination, setHebergement
 } from "../../../store/slices/travel";

function Detail(){
    const dispatch = useDispatch();
    const { hebergement } = useSelector((state) => state.allTravel);
    const { destination } = useSelector((state) => state.allTravel);
    //const [destination, setDestination] = useState({});

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
                //setHebergementInfo(result.datas[0]);
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
                <p>{hebergement.presentation}</p>
                <p>{hebergement.equipement}</p>
                <p>{hebergement.logement}</p>
                <p>{hebergement.restauration}</p>
                <p>{hebergement.formules}</p>
                <p>{hebergement.loisirs}</p>
                <p>{hebergement.enfants}</p>
                <p>{hebergement.tripadvisor}</p>
            </div>
            }
        </main>
    )
}

export default Detail;