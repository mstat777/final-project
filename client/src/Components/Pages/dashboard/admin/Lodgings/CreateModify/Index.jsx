import styles from '../../admindash.module.scss';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function AdminDashLodgingCreateModify(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const { pathname } = useLocation(); // 'create' ou 'modify'
    const { index } = useParams(); // l'index de l'hébergement sélectionné

    const { resultsLodgings } = useSelector((state) => state.dashboard);

    // les champs du formulaire :
    const [inputs, setInputs] = useState({
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
        coordinates: ""
    });

    const [imageInitial, setImageInitial] = useState(null);
    const [imagesAll, setImagesAll] = useState([]);

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

    // ne pas soumettre le formulaire, si les inputs ne sont pas valides:
    const [isModFormValidated, setIsModFormValidated] = useState(false);

    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // charger les données dans le formulaire lors du chargement de la page :
    useEffect(() => {
        if (resultsLodgings[index]) {
            setInputs({
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

    function clearMessages(){
        setOkMsg('');
        setErrMsg('');
    }

    async function submitForm() {
        const formData = new FormData();

        formData.append('name', inputs.nameLodg);
        formData.append('type', inputs.typeLodg);
        formData.append('overview', inputs.overview);
        formData.append('facilities', inputs.facilities);
        formData.append('rooms', inputs.rooms);
        formData.append('food_drink', inputs.foodDrink);
        formData.append('meal_plans', inputs.mealPlans);
        formData.append('entertainment', inputs.entertainment);
        formData.append('children', inputs.children);
        formData.append('tripadvisor', inputs.tripadvisor);
        formData.append('coordinates', inputs.coordinates);
        formData.append('file', imageInitial);
        [...imagesAll].forEach((file, idx) => {
            formData.append(`file-${idx}`, file, file.name);
        });

        if (isModFormValidated) {
            //console.log(pathname.includes('modify'));
            // s'il s'agit d'une modif d'un hébergement déjà existant :
            if (pathname.includes("modify")){
                console.log(resultsLodgings[index].l.id);
                formData.append('id', resultsLodgings[index].l.id);
                const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/modify`, {
                    method: "POST",
                    body: formData
                });     
                if (res.status === 200) {
                    setOkMsg("Les modifications ont été enregistrée.");
                }
            }
            // s'il s'agit d'une création d'un nouveau hébergement :
            if (pathname.includes("create")){
                const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/create`, {
                    method: "POST",
                    body: formData
                });
                const json = await res.json();
                res.status === 200 ? setOkMsg(json.msg) : setErrMsg(json.msg);
            }
        }
    }

    async function handleDelete() {
        console.log("Lodging delete data query sent!");
        inputs.id = resultsLodgings[index].l.id;
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inputs)
        });
        const json = await res.json();
        if (res.status === 200) {
            setOkMsg("L'hébergement a été supprimé.");
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
                { inputs && 
                <>
                    <h1>créer/modifier/supprimer un hébergement</h1>

                    <form onSubmit={handleSubmit} 
                          className={styles.form}
                          encType="multipart/form-data">
                        <label>
                            <span>Nom de l'hébergement :</span>
                            <input type="text" 
                                   name="nameLodg" 
                                   value={inputs.nameLodg}
                                   onChange={handleChange}
                                   onFocus={clearMessages}
                                   disabled={disableInput.nameLodg}/>
                            <button type="button" onClick={() => activateInput("nameLodg")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </label>

                        <label>
                            <span>Type de l'hébergement :</span>
                            <input type="text" 
                                   name="typeLodg" 
                                   value={inputs.typeLodg}
                                   onChange={handleChange}
                                   onFocus={clearMessages}
                                   disabled={disableInput.typeLodg}/>
                            <button type="button" onClick={() => activateInput("typeLodg")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </label>

                        <label>
                            <span>Description :</span>
                            <textarea name="overview" 
                                      value={inputs.overview}
                                      onChange={handleChange}
                                      onFocus={clearMessages}
                                      disabled={disableInput.overview}/>
                            <button type="button" onClick={() => activateInput("overview")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </label>

                        <label>
                            <span>Equipement :</span>
                            <textarea name="facilities" 
                                      value={inputs.facilities}
                                      onChange={handleChange}
                                      onFocus={clearMessages}
                                      disabled={disableInput.facilities}/>
                            <button type="button" onClick={() => activateInput("facilities")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </label>

                        <label>
                            <span>Logement :</span>
                            <textarea name="rooms" 
                                      value={inputs.rooms}
                                      onChange={handleChange}
                                      onFocus={clearMessages}
                                      disabled={disableInput.rooms}/>
                            <button type="button" onClick={() => activateInput("rooms")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </label> 

                        <label>
                            <span>Restauration :</span>
                            <textarea name="foodDrink" 
                                      value={inputs.foodDrink}
                                      onChange={handleChange}
                                      onFocus={clearMessages}
                                      disabled={disableInput.foodDrink}/>
                            <button type="button" onClick={() => activateInput("foodDrink")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </label> 

                        <label>
                            <span>Formules :</span>
                            <textarea name="mealPlans" 
                                      value={inputs.mealPlans}
                                      onChange={handleChange}
                                      onFocus={clearMessages}
                                      disabled={disableInput.mealPlans}/>
                            <button type="button" onClick={() => activateInput("mealPlans")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </label> 

                        <label>
                            <span>Loisirs :</span>
                            <textarea name="entertainment" 
                                      value={inputs.entertainment}
                                      onChange={handleChange}
                                      onFocus={clearMessages}
                                      disabled={disableInput.entertainment}/>
                            <button type="button" onClick={() => activateInput("entertainment")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
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
                                onChange={(e) => {
                                    setImagesAll(e.target.files);
                                }}
                                />
                        </label>

                        <label>
                            <span>Enfants :</span>
                            <textarea
                                name="children" 
                                value={inputs.children}
                                onChange={handleChange}
                                disabled={disableInput.children}/>
                            <button type="button" onClick={() => activateInput("children")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </label> 

                        <label>
                            <span>Note Tripadvisor :</span>
                            <input type="text" 
                                name="tripadvisor" 
                                value={inputs.tripadvisor}
                                onChange={handleChange}
                                disabled={disableInput.tripadvisor}/>
                            <button type="button" onClick={() => activateInput("tripadvisor")}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </label> 

                        <label>
                            <span>Coordonnées :</span>
                            <input type="text" 
                                name="coordinates" 
                                value={inputs.coordinates}
                                onChange={handleChange}
                                disabled={disableInput.coordinates}
                                placeholder="(format décimal)"/>
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
            </section>
}

export default AdminDashLodgingCreateModify;