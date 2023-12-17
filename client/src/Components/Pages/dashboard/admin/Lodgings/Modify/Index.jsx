import styles from '../../admindash.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function AdminDashLodgingModify(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const navigate = useNavigate();
    // on récupère l'index de l'hébergement sélectionné :
    let { index } = useParams();

    const { resultsLodgings } = useSelector((state) => state.dashboard);

    // les champs du formulaire :
    const [formData, setFormData] = useState({
        nameLodg: "",
        typeLodg: "",
        overview: "",
        facilities: "",
        rooms: "",
        foodDrink: "",
        mealPlans: "",
        entertainment: "",
        children: "",
        tripadvisor: "",
        coordinates: "",
    });

    // activer/désactiver les champs :
    const [disableInput, setDisableInput] = useState({
        nameLodg: true,
        typeLodg: true,
        overview: true,
        facilities: true,
        rooms: true,
        foodDrink: true,
        mealPlans: true,
        entertainment: true,
        children: true,
        tripadvisor: true,
        coordinates: true
    });

    // pour ne pas soumettre le formulaire, si les inputs ne sont pas valides:
    const [isModFormValidated, setIsModFormValidated] = useState(false);

    // pour afficher les messages suite à la modif des champs :
    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // charger les données dans le formulaire lors du chargement de la page :
    useEffect(() => {

        //console.log(resultsLodgings);
        if (resultsLodgings[index]) {
            setFormData({
                nameLodg: resultsLodgings[index].l.name,
                typeLodg: resultsLodgings[index].l.type,
                overview: resultsLodgings[index].l.overview,
                facilities: resultsLodgings[index].l.facilities,
                rooms: resultsLodgings[index].l.rooms,
                foodDrink: resultsLodgings[index].l.food_drink,
                mealPlans: resultsLodgings[index].l.meal_plans,
                entertainment: resultsLodgings[index].l.entertainment,
                children: resultsLodgings[index].l.children,
                tripadvisor: resultsLodgings[index].l.tripadvisor,
                coordinates: resultsLodgings[index].l.coordinates
            });
        }
    },[resultsLodgings[index]])

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

    async function submitForm() {
        if (isModFormValidated) {
            console.log("User Data modif form sent!");
            formData.id = resultsLodgings[index].l.id;
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/modify`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const json = await res.json();
            //console.log(json.msg);
            
            if (res.status === 201) {
                setOkMsg("Les modifications ont été enregistrée.");
                //navigate("/db/admin/lodgings");
            }
        }
    }

    async function handleDelete() {
        console.log("Lodging delete data query sent!");
        formData.id = resultsLodgings[index].l.id;
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/delete`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const json = await res.json();
        //console.log(json.msg);  
        if (res.status === 201) {
            setOkMsg("L'hébergement a été supprimé.");
            //navigate("/db/admin/lodgings");
        }
    }

    const activateInput = (inputName) => {
        setDisableInput({ ...formData, [inputName]: false });
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        // vérifier si tous les champs sont valides :
        checkFormValidation();
    }

    return <main className={styles.admin_db_main}>
            { formData && 
            <>
            <h2>modifier/supprimer un hébergement</h2>
            <form onSubmit={handleSubmit} className={styles.modify_form}>
                <label className={styles.modify_label}>
                    <span>Nom de l'hébergement :</span>
                    <input type="text" 
                        name="nameLodg" 
                        value={formData.nameLodg}
                        onChange={handleChange}
                        onFocus={() => {
                            setOkMsg('');
                            setErrMsg('');}}
                        disabled={disableInput.nameLodg}/>
                    <button type="button" onClick={() => activateInput("nameLodg")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.modify_label}>
                    <span>Type de l'hébergement :</span>
                    <input type="text" 
                        name="typeLodg" 
                        value={formData.typeLodg}
                        onChange={handleChange}
                        onFocus={() => {
                            setOkMsg('');
                            setErrMsg('');}}
                        disabled={disableInput.typeLodg}/>
                    <button type="button" onClick={() => activateInput("typeLodg")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.modify_label}>
                    <span>Description :</span>
                    <textarea
                        name="overview" 
                        value={formData.overview}
                        onChange={handleChange}
                        onFocus={() => {
                            setOkMsg('');
                            setErrMsg('');}}
                        disabled={disableInput.overview}/>
                    <button type="button" onClick={() => activateInput("overview")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.modify_label}>
                    <span>Equipement :</span>
                    <textarea
                        name="facilities" 
                        value={formData.facilities}
                        onChange={handleChange}
                        onFocus={() => {
                            setOkMsg('');
                            setErrMsg('');}}
                        disabled={disableInput.facilities}/>
                    <button type="button" onClick={() => activateInput("facilities")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.modify_label}>
                    <span>Logement :</span>
                    <textarea
                        name="rooms" 
                        value={formData.rooms}
                        onChange={handleChange}
                        disabled={disableInput.rooms}/>
                    <button type="button" onClick={() => activateInput("rooms")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.modify_label}>
                    <span>Restauration :</span>
                    <textarea
                        name="foodDrink" 
                        value={formData.foodDrink}
                        onChange={handleChange}
                        disabled={disableInput.foodDrink}/>
                    <button type="button" onClick={() => activateInput("foodDrink")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.modify_label}>
                    <span>Formules :</span>
                    <textarea
                        name="mealPlans" 
                        value={formData.mealPlans}
                        onChange={handleChange}
                        disabled={disableInput.mealPlans}/>
                    <button type="button" onClick={() => activateInput("mealPlans")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.modify_label}>
                    <span>Loisirs :</span>
                    <textarea
                        name="entertainment" 
                        value={formData.entertainment}
                        onChange={handleChange}
                        disabled={disableInput.entertainment}/>
                    <button type="button" onClick={() => activateInput("entertainment")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.modify_label}>
                    <span>Enfants :</span>
                    <textarea
                        name="children" 
                        value={formData.children}
                        onChange={handleChange}
                        disabled={disableInput.children}/>
                    <button type="button" onClick={() => activateInput("children")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.modify_label}>
                    <span>Note Tripadvisor :</span>
                    <input type="text" 
                        name="tripadvisor" 
                        value={formData.tripadvisor}
                        onChange={handleChange}
                        disabled={disableInput.tripadvisor}/>
                    <button type="button" onClick={() => activateInput("tripadvisor")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.modify_label}>
                    <span>Coordonnées (format décimal) :</span>
                    <input type="text" 
                        name="coordinates" 
                        value={formData.coordinates}
                        onChange={handleChange}
                        disabled={disableInput.coordinates}/>
                    <button type="button" onClick={() => activateInput("coordinates")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>           

                <div className={styles.main_btn_ctn}>
                    <button type="submit" 
                            className={styles.save_btn}>
                        enregistrer</button>
                    <button type="button"
                            onClick={handleDelete}
                            className={styles.delete_btn}>
                        supprimer</button>
                </div>

            </form>
            { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
            { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }
            
            </>}
        </main>
}

export default AdminDashLodgingModify;