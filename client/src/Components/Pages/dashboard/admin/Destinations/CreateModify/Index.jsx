import styles from '../../admindash.module.scss';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import MainBtn from '../../../../../Containers/buttons/MainBtn/Index';
import BtnWithPopup from '../../../../../Containers/buttons/BtnWithPopup/Index';

function AdminDashDestinationsCreateModify(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");

    const { pathname } = useLocation(); // 'create' ou 'modify'
    const { index } = useParams(); // l'indice de la destination sélectionnée

    const { resultsDestinations } = useSelector((state) => state.dashboard);

    // les champs du formulaire :
    const [inputs, setInputs] = useState({
        reference: "",
        nameDest: "",
        country: "",
        continent: "",
        overview: "",
        departurePlace: ""
    });  

    const [imageInitial, setImageInitial] = useState(null);
    const [imagesAll, setImagesAll] = useState([]);

    const [lodgingID, setLodgingID] = useState("");

    // Si création, les champs sont actifs. Si modification, désactivés :
    const initialState = pathname.includes("modify");
    const [disableInput, setDisableInput] = useState({
        reference: initialState,
        nameDest: initialState,
        country: initialState,
        continent: initialState,
        overview: initialState,
        departurePlace: initialState
    });  

    // ne pas soumettre le formulaire, si les inputs ne sont pas valides:
    const [isModFormValidated, setIsModFormValidated] = useState(false);

    const [okMsg, setOkMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");

    // on récupère la liste de tous les hébergements de la BDD ('nom' et 'id') :
    const [lodgings, setLodgings] = useState([]);
    useEffect(() => {
        async function getAllLodgings(){
            const result = await(await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/id/all`)).json();
            setLodgings(result.datas);
            setLodgingID(result.datas[0].id);
        }
        getAllLodgings();
    },[]);

    // charger les données dans le formulaire lors du chargement de la page :
    useEffect(() => {
        if (resultsDestinations[index]) {
            setInputs({
                reference: resultsDestinations[index].d.reference,
                nameDest: resultsDestinations[index].d.name,
                country: resultsDestinations[index].d.country,
                continent: resultsDestinations[index].d.continent,
                overview: resultsDestinations[index].d.overview,
                departurePlace: resultsDestinations[index].d.departure_place
            });
            setLodgingID(resultsDestinations[index].d.lodging_id);
        }
    },[resultsDestinations[index]]);

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
        formData.append('name', inputs.nameDest);
        formData.append('country', inputs.country);
        formData.append('continent', inputs.continent);
        formData.append('overview', inputs.overview);
        formData.append('departure_place', inputs.departurePlace);
        formData.append('lodging_id', lodgingID);
        formData.append('file', imageInitial);
        [...imagesAll].forEach((file, idx) => {
            formData.append(`file-${idx}`, file, file.name);
        });

        if (isModFormValidated) {
            // s'il s'agit d'une modif d'une destination déjà existante :
            if (pathname.includes("modify")){
                formData.append('id', resultsDestinations[index].d.id);
                const res = await fetch(`${BASE_URL}/api/v.0.1/admin/destinations/modify`, {
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
                const res = await fetch(`${BASE_URL}/api/v.0.1/admin/destinations/create`, {
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
        inputs.id = resultsDestinations[index].d.id;
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/destinations/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json",
                        Authentication: "Bearer " + TOKEN },
            body: JSON.stringify(inputs)
        });
        const json = await res.json();
        if (res.status === 200) {
            setOkMsg("La destination a été supprimée.");
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
            { (lodgings[0] && inputs) && 
            <>
                <h1>créer/modifier/supprimer une destination</h1>

                <form onSubmit={handleSubmit} 
                        className={styles.form}
                        encType="multipart/form-data">
                    <p>IMPORTANT : Veuillez associer d'abord l'hébergement correspondant à cette destination. S'il n'est pas encore créé, merci de le créer d'abord avant de créer cette nouvelle destination.</p>
                    <label>
                        <span>Hébergement correspondant :</span>
                        <select defaultValue={lodgings[0].id} 
                                onChange={(e) => setLodgingID(e.target.value)}
                                onFocus={clearMessages}
                                required>
                            {lodgings.map((lodg) => ( 
                                <option value={lodg.id} key={lodg.id}>{lodg.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Nom de la destination :</span>
                        <input type="text" 
                            name="nameDest" 
                            className={styles.bold}
                            value={inputs.nameDest}
                            onChange={handleChange}
                            onFocus={clearMessages}
                            disabled={disableInput.nameDest}
                            required/> 
                        {pathname.includes("modify") && 
                        <button type="button" onClick={() => activateInput("nameDest")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>}
                    </label>
                    <label>
                        <span>Numéro de référence :</span>
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
                        <span>Pays :</span>
                        <input type="text" 
                            name="country" 
                            value={inputs.country}
                            onChange={handleChange}
                            onFocus={clearMessages}
                            disabled={disableInput.country}
                            required/>
                        {pathname.includes("modify") && 
                        <button type="button" onClick={() => activateInput("country")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>}
                    </label>
                    <label>
                        <span>Continent :</span>
                        <input type="text" 
                            name="continent" 
                            value={inputs.continent}
                            onChange={handleChange}
                            onFocus={clearMessages}
                            disabled={disableInput.continent}
                            required/>
                        {pathname.includes("modify") && 
                        <button type="button" onClick={() => activateInput("continent")}>
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
                        <span>Point(s) de départ :</span>
                        <textarea name="departurePlace" 
                            value={inputs.departurePlace}
                            onChange={handleChange}
                            onFocus={clearMessages}
                            disabled={disableInput.departurePlace}/>
                        {pathname.includes("modify") && 
                        <button type="button" onClick={() => activateInput("departurePlace")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>}
                    </label>
                    <label> 
                        <span>Image initiale :</span>
                        <input type="file" 
                            name="imageInitial" 
                            accept="image/jpg"
                            onChange={(e) => setImageInitial(e.target.files[0])}
                            />
                    </label>
                    <label>
                        <span>Images pour slideshow :</span>
                        <input type="file" 
                            name="imageAll" 
                            accept="image/jpg"
                            multiple
                            onChange={(e) => setImagesAll(e.target.files)}
                            />
                    </label>
                    
                    <div className={styles.main_btn_ctn}>
                        <MainBtn type="submit" 
                                text="enregistrer"/>
                        <BtnWithPopup
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

export default AdminDashDestinationsCreateModify;