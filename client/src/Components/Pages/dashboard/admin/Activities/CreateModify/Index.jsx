import styles from '../../admindash.module.scss';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import MainBtn from '../../../../../Containers/buttons/MainBtn/Index';
import BtnWithAlert from '../../../../../Containers/buttons/BtnWithAlert/Index';

function AdminDashActivitiesCreateModify(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");

    const { pathname } = useLocation(); // 'create' ou 'modify'
    const { index } = useParams(); // l'indice de l'activité sélectionnée

    const { resultsActivities } = useSelector((state) => state.dashboard);

    // les champs du formulaire :
    const [inputs, setInputs] = useState({
        nameAct: "",
        typeAct: "",
        overview: "",
        priceAdults: "",
        priceChildren: "",
        placesTotal: "",
        placesLeft: ""
    });    
    // pour associer l'activité à une destination :
    // (à passer dans le body pour le 2ème Write)
    const [destinationID, setDestinationID] = useState("");

    // Si création, les champs sont actifs. Si modification, désactivés :
    const initialState = pathname.includes("modify"); 
    const [disableInput, setDisableInput] = useState({
        nameAct: initialState,
        typeAct: initialState,
        overview: initialState,
        priceAdults: initialState,
        priceChildren: initialState,
        placesTotal: initialState,
        placesLeft: initialState
    });

    // ne pas soumettre le formulaire, si les inputs ne sont pas valides:
    const [isModFormValidated, setIsModFormValidated] = useState(false);

    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // on récupère la liste de tous les destinations de la BDD ('nom' et 'id') :
    const [destinations, setDestinations] = useState([]);
    useEffect(() => {
        async function getAllDestinations(){
            const result = await(await fetch(`${BASE_URL}/api/v.0.1/admin/destinations/id/all`)).json();
            setDestinations(result.datas);
            setDestinationID(result.datas[0].id);
        }
        getAllDestinations();
    },[]);

    // charger les données dans le formulaire lors du chargement de la page :
    useEffect(() => {
        if (resultsActivities[index]) {
            setInputs({
                nameAct: resultsActivities[index].a.name,
                typeAct: resultsActivities[index].a.type,
                overview: resultsActivities[index].a.overview,
                priceAdults: resultsActivities[index].a.price_adults,
                priceChildren: resultsActivities[index].a.price_children,
                placesTotal: resultsActivities[index].a.places_total,
                placesLeft: resultsActivities[index].a.places_left
            });
            setDestinationID(resultsActivities[index].da.destination_id);
        }
    },[resultsActivities[index]]);

    // on vérifie tous les champs avant de soumettre le formulaire :
    const checkFormValidation = () => {
        // PAS ENCORE DÉVELOPPÉ : ce sera développé plus tard
        setIsModFormValidated(true);
    }
    useEffect(() => {
        if (isModFormValidated === true) {
            submitForm();
        }
    },[isModFormValidated]);

    function clearMessages(){
        setOkMsg('');
        setErrMsg('');
    }

    async function submitForm() {
        const formData = new FormData();
        formData.append('name', inputs.nameAct);
        formData.append('type', inputs.typeAct);
        formData.append('overview', inputs.overview);
        formData.append('priceAdults', inputs.priceAdults);
        formData.append('priceChildren', inputs.priceChildren); 
        formData.append('placesTotal', inputs.placesTotal);  
        formData.append('placesLeft', inputs.placesLeft);  
        
        if (isModFormValidated) {
            // s'il s'agit d'une modif d'un hébergement déjà existant :
            if (pathname.includes("modify")){
                formData.append('id', resultsActivities[index].a.id);
                const res = await fetch(`${BASE_URL}/api/v.0.1/admin/activities/modify`, {
                    method: "POST",
                    headers: { Authentication: "Bearer " + TOKEN },
                    body: formData
                });     
                if (res.status === 200) {
                    setOkMsg("Les modifications ont été enregistrée.");
                }
            }
            // s'il s'agit d'une création d'un nouveau hébergement :
            if (pathname.includes("create")){
                formData.append('destinationID', destinationID);  
                const res = await fetch(`${BASE_URL}/api/v.0.1/admin/activities/create`, {
                    method: "POST",
                    headers: { Authentication: "Bearer " + TOKEN },
                    body: formData
                });
                const json = await res.json();
                res.status === 200 ? setOkMsg(json.msg) : setErrMsg(json.msg);
            }
        }
    }

    async function handleDelete() {
        inputs.id = resultsActivities[index].a.id;
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/activities/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json",
                        Authentication: "Bearer " + TOKEN },
            body: JSON.stringify(inputs)
        });
        const json = await res.json();
        if (res.status === 200) {
            setOkMsg("L'activité a été supprimée.");
        } else if (res.status === 409) {
            setErrMsg(json.msg);
        }
    }

    const activateInput = (inputName) => {
        setDisableInput({ ...inputs, [inputName]: false });
    }

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        // vérifier si tous les champs sont valides :
        checkFormValidation();
    }

    return <section className={styles.admin_db_section}>
                { (destinations[0] && inputs) &&
                <>
                    <h1>créer/modifier/supprimer une activité</h1>

                    <form onSubmit={handleSubmit} className={styles.form}>

                        <p>IMPORTANT : Cette nouvelle activité doit d'abord être associée à une destination correspondante. Si la destination n'est pas encore créée, merci de la créer d'abord avant de créer cette nouvelle activité.</p>
                        <label>
                            <span>Destination correspondante :</span>
                            <select defaultValue={destinations[0].id} 
                                    onChange={(e) => setDestinationID(e.target.value)}
                                    onFocus={clearMessages}
                                    required>
                                {destinations.map((dest) => (
                                    <option value={dest.id} key={dest.id}>{dest.name}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span>Nom de l'activité :</span>
                            <input type="text" 
                                   name="nameAct" 
                                   className={styles.bold}
                                   value={inputs.nameAct}
                                   onChange={handleChange}
                                   onFocus={clearMessages}
                                   disabled={disableInput.nameAct}
                                   required/>
                            {pathname.includes("modify") && 
                            <button type="button" onClick={() => activateInput("nameAct")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>}
                        </label>

                        <label>
                            <span>Type d'activité :</span>
                            <input type="text" 
                                   name="typeAct" 
                                   value={inputs.typeAct}
                                   onChange={handleChange}
                                   onFocus={clearMessages}
                                   disabled={disableInput.typeAct}/>
                            {pathname.includes("modify") && 
                            <button type="button" onClick={() => activateInput("typeAct")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>}
                        </label>

                        <label>
                            <span>Description :</span>
                            <textarea name="overview" 
                                      value={inputs.overview}
                                      onChange={handleChange}
                                      onFocus={clearMessages}
                                      disabled={disableInput.overview}/>
                            {pathname.includes("modify") && 
                            <button type="button" onClick={() => activateInput("overview")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>}
                        </label>

                        <label>  
                            <span>Prix/TTC/adulte :</span>
                            <input type="text" 
                                   name="priceAdults" 
                                   value={inputs.priceAdults}
                                   onChange={handleChange}
                                   onFocus={clearMessages}
                                   disabled={disableInput.priceAdults}/>
                            {pathname.includes("modify") && 
                            <button type="button" onClick={() => activateInput("priceAdults")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>}
                        </label>

                        <label>  
                            <span>Prix/TTC/enfant :</span>
                            <input type="text" 
                                   name="priceChildren" 
                                   value={inputs.priceChildren}
                                   onChange={handleChange}
                                   onFocus={clearMessages}
                                   disabled={disableInput.priceChildren}/>
                            {pathname.includes("modify") && 
                            <button type="button" onClick={() => activateInput("priceChildren")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>}
                        </label>

                        <label>  
                            <span>Nombre de places total :</span>
                            <input type="text" 
                                   name="placesTotal" 
                                   value={inputs.placesTotal}
                                   onChange={handleChange}
                                   onFocus={clearMessages}
                                   disabled={disableInput.placesTotal}/>
                            {pathname.includes("modify") && 
                            <button type="button" onClick={() => activateInput("placesTotal")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>}
                        </label>

                        <label>  
                            <span>Nombre de places disponibles :</span>
                            <input type="text" 
                                   name="placesLeft" 
                                   value={inputs.placesLeft}
                                   onChange={handleChange}
                                   onFocus={clearMessages}
                                   disabled={disableInput.placesLeft}/>
                            {pathname.includes("modify") && 
                            <button type="button" onClick={() => activateInput("placesLeft")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>}
                        </label>

                        <div className={styles.main_btn_ctn}>
                            <MainBtn type="submit" 
                                    text="enregistrer"/>
                            <BtnWithAlert
                                type="button" 
                                clickFunc={handleDelete}
                                text="supprimer"/>
                        </div>
                    </form>
                    
                    { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
                    { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }
                </>}
            </section>
}

export default AdminDashActivitiesCreateModify;