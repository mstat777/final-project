import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../../admindash.module.css';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function AdminDashUserModify(){
    const navigate = useNavigate();

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

    const { results } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // pour afficher les messages suite à la modif des champs :
    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        // remplir le formulaire lors du chargement de la page :
        if (results.length) {
            setFormData({
                nameLodg: results.l.nameLodg,
                typeLodg: results.l.typeLodg,
                overview: results.l.overview,
                facilities: results.l.facilities,
                rooms: results.l.rooms,
                foodDrink: results.l.foodDrink,
                mealPlans: results.l.mealPlans,
                entertainment: results.l.entertainment,
                children: results.l.children,
                tripadvisor: results.l.tripadvisor,
                coordinates: results.l.coordinates
            });
            setShowResults(true);
        }
    },[results.length])

    // on vérifie tous les champs avant de soumettre le formulaire :
    const checkFormValidation = () => {
        // PAS ENCORE DÉVELOPPÉ : ce sera développé plus tard
        setIsFormValidated(true);
    }

    useEffect(() => {
        if (isFormValidated === true) {
            submitForm();
        }
    },[isFormValidated]);

    async function submitForm() {
        if (isFormValidated) {
            console.log("User Data modif form sent!");
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/modify`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nameLodg,
                    typeLodg,
                    overview,
                    facilities,
                    rooms,
                    foodDrink,
                    mealPlans,
                    entertainment,
                    children,
                    tripadvisor,
                    coordinates,
                    id: results.l.id
                })
            });
            const json = await res.json();
            //console.log(json.msg);
            
            if (res.status === 201) {
                setOkMsg("Les modifications ont été enregistrée.");
                //navigate("/db/admin/lodgings");
            }
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

    return <>
        { console.log(results)}
        { console.log("showResults = "+showResults)}
        { showResults && 
        <div className={styles.admin_db_section}>
            {results[0] ? <>
            <h3>Résultats</h3>

            <form onSubmit={handleSubmit} className={styles.results_table}>
                <label className={styles.results_label}>
                    <span>Nom de l'hébergement :</span>
                    <input type="text" 
                        name="nameLodg" 
                        value={formData.nameLodg}
                        onChange={handleChange}
                        disabled={disableInput.nameLodg}/>
                    <button type="button" onClick={() => activateInput("nameLodg")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.results_label}>
                    <span>Type de l'hébergement :</span>
                    <input type="text" 
                        name="typeLodg" 
                        value={formData.typeLodg}
                        onChange={handleChange}
                        disabled={disableInput.typeLodg}/>
                    <button type="button" onClick={() => activateInput("typeLodg")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.results_label}>
                    <span>Description :</span>
                    <input type="text" 
                        name="overview" 
                        value={formData.overview}
                        onChange={handleChange}
                        disabled={disableInput.overview}/>
                    <button type="button" onClick={() => activateInput("overview")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.results_label}>
                    <span>Equipement :</span>
                    <input type="text" 
                        name="facilities" 
                        value={formData.facilities}
                        onChange={handleChange}
                        disabled={disableInput.facilities}/>
                    <button type="button" onClick={() => activateInput("facilities")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.results_label}>
                    <span>Logement :</span>
                    <input type="text" 
                        name="rooms" 
                        value={formData.rooms}
                        onChange={handleChange}
                        disabled={disableInput.rooms}/>
                    <button type="button" onClick={() => activateInput("rooms")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.results_label}>
                    <span>Restauration :</span>
                    <input type="text" 
                        name="foodDrink" 
                        value={formData.foodDrink}
                        onChange={handleChange}
                        disabled={disableInput.foodDrink}/>
                    <button type="button" onClick={() => activateInput("foodDrink")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.results_label}>
                    <span>Formules :</span>
                    <input type="text" 
                        name="mealPlans" 
                        value={formData.mealPlans}
                        onChange={handleChange}
                        disabled={disableInput.mealPlans}/>
                    <button type="button" onClick={() => activateInput("mealPlans")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.results_label}>
                    <span>Loisirs :</span>
                    <input type="text" 
                        name="entertainment" 
                        value={formData.entertainment}
                        onChange={handleChange}
                        disabled={disableInput.entertainment}/>
                    <button type="button" onClick={() => activateInput("entertainment")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.results_label}>
                    <span>Enfants :</span>
                    <input type="text" 
                        name="children" 
                        value={formData.children}
                        onChange={handleChange}
                        disabled={disableInput.children}/>
                    <button type="button" onClick={() => activateInput("children")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label> 

                <label className={styles.results_label}>
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

                <label className={styles.results_label}>
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

                <div>
                    <button type="submit">enregistrer</button>
                    <button type="button"
                            onClick={() => {}}>
                        supprimer
                    </button>
                </div>

            </form>
            { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
            { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }
            
            </>
            : <p className={styles.msg_nok}>Aucun résultat trouvé</p>
            }
        </div>
        }
    </>
}

export default AdminDashUserModify;