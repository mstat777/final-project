import styles from '../../admindash.module.scss';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { formatDate } from '../../../../../Functions/utils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import MainBtn from '../../../../../Containers/buttons/MainBtn/Index';
import BtnWithAlert from '../../../../../Containers/buttons/BtnWithAlert/Index';

function AdminDashPackCreateModify(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");

    const { pathname } = useLocation(); // 'create' ou 'modify'
    const { index } = useParams(); // l'indice de l'hébergement sélectionné

    const { resultsPacks } = useSelector((state) => state.dashboard);

    // les champs du formulaire :
    const [inputs, setInputs] = useState({
        reference: "",
        departureDate: "",
        returnDate: "",
        duration: "",
        priceAdults: "",
        priceChildren: "",
        discount: "",
        placesTotal: "",
        placesLeft: ""
    });
    const [destinationID, setDestinationID] = useState("");

    // Si création, les champs sont actifs. Si modification, désactivés :
    const initialState = pathname.includes("modify");
    const [disableInput, setDisableInput] = useState({
        reference: initialState,
        departureDate: initialState,
        returnDate: initialState,
        duration: initialState,
        priceAdults: initialState,
        priceChildren: initialState,
        discount: initialState,
        placesTotal: initialState,
        placesLeft: initialState
    });

    // ne pas soumettre le formulaire, si les inputs ne sont pas valides:
    const [isModFormValidated, setIsModFormValidated] = useState(false);

    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // on récupère la liste de toutes les destinations de la BDD ('nom' et 'id') :
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
        if (resultsPacks[index]) {
            setInputs({
                reference: resultsPacks[index].p.reference,
                departureDate: formatDate(resultsPacks[index].p.departure_date),
                returnDate: formatDate(resultsPacks[index].p.return_date),
                duration: resultsPacks[index].p.duration,
                priceAdults: resultsPacks[index].p.price_adults,
                priceChildren: resultsPacks[index].p.price_children,
                discount: resultsPacks[index].p.discount,
                placesTotal: resultsPacks[index].p.places_total,
                placesLeft: resultsPacks[index].p.places_left
            });
            setDestinationID(resultsPacks[index].p.destination_id);
        }
    },[resultsPacks[index]]);

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
        formData.append('reference', inputs.reference);
        formData.append('departure_date', inputs.departureDate);
        formData.append('return_date', inputs.returnDate);
        formData.append('duration', inputs.duration);
        formData.append('price_adults', inputs.priceAdults);
        formData.append('price_children', inputs.priceChildren);
        formData.append('discount', inputs.discount);
        formData.append('places_total', inputs.placesTotal);
        formData.append('places_left', inputs.placesLeft);
        formData.append('destination_id', destinationID);

        if (isModFormValidated) {
            // s'il s'agit d'une modif d'une destination déjà existante :
            if (pathname.includes("modify")){
                formData.append('id', resultsPacks[index].p.id);
                const res = await fetch(`${BASE_URL}/api/v.0.1/admin/packs/modify`, {
                    method: "POST",
                    headers: { Authentication: "Bearer " + TOKEN },
                    body: formData
                });     
                if (res.status === 200) {
                    setOkMsg("Les modifications ont été enregistrée.");
                }
            }
            // s'il s'agit d'une création d'une nouvelle destination :
            if (pathname.includes("create")){
                const res = await fetch(`${BASE_URL}/api/v.0.1/admin/packs/create`, {
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
        inputs.id = resultsPacks[index].p.id;
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/packs/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json",
                        Authentication: "Bearer " + TOKEN },
            body: JSON.stringify(inputs)
        });
        const json = await res.json();
        if (res.status === 200) {
            setOkMsg("Le pack a été supprimé.");
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
                <h1>créer/modifier/supprimer un pack</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <p>IMPORTANT : Veuillez associer d'abord la destination correspondante à ce pack. Si elle n'est pas encore créée, merci de la créer d'abord avant de créer ce nouveau pack.</p>
                    <label>
                        <span>Destination correspondante :</span>
                        <select defaultValue={destinations[0].id} 
                                onChange={(e) => setDestinationID(e.target.value)}
                                onFocus={clearMessages}>
                            {destinations.map((dest) => (
                                <option value={dest.id} key={dest.id}>{dest.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Num. de référence :</span>
                        <input type="text" 
                            name="reference" 
                            value={inputs.reference}
                            onChange={handleChange}
                            onFocus={clearMessages}
                            disabled={disableInput.reference}/>
                        {pathname.includes("modify") && 
                        <button type="button" onClick={() => activateInput("reference")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>}
                    </label>

                    <label>
                        <span>Date de départ :</span>
                        <input type="date" 
                            name="departureDate" 
                            value={inputs.departureDate}
                            onChange={handleChange}
                            onFocus={clearMessages}
                            disabled={disableInput.departureDate}/>
                        {pathname.includes("modify") && 
                        <button type="button" onClick={() => activateInput("departureDate")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>}
                    </label>

                    <label>
                        <span>Date de retour :</span>
                        <input type="date"
                            name="returnDate" 
                            value={inputs.returnDate}
                            onChange={handleChange}
                            onFocus={clearMessages}
                            disabled={disableInput.returnDate}/>
                        {pathname.includes("modify") && 
                        <button type="button" onClick={() => activateInput("returnDate")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>}
                    </label>

                    <label>
                        <span>Durée :</span>
                        <input type="text" 
                            name="duration" 
                            value={inputs.duration}
                            onChange={handleChange}
                            onFocus={clearMessages}
                            disabled={disableInput.duration}/>
                        {pathname.includes("modify") && 
                        <button type="button" onClick={() => activateInput("duration")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>}
                    </label>

                    <label>
                        <span>Prix/adulte :</span>
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
                        <span>Prix/enfant :</span>
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
                        <span>Réduction :</span>
                        <input type="text" 
                            name="discount" 
                            value={inputs.discount}
                            onChange={handleChange}
                            onFocus={clearMessages}
                            disabled={disableInput.discount}/>
                        {pathname.includes("modify") && 
                        <button type="button" onClick={() => activateInput("discount")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>}
                    </label> 

                    <label>
                        <span>Nombre de places totales :</span>
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
                        <span>Nombre de places restantes :</span>
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

export default AdminDashPackCreateModify;