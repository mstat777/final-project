import styles from '../../admindash.module.css';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function AdminDashDestinationsModify(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    // on récupère l'index de l'hébergement sélectionné :
    let { index } = useParams();

    const { resultsDestinations } = useSelector((state) => state.dashboard);

    // les champs du formulaire :
    const [formData, setFormData] = useState({
        reference: "",
        nameDest: "",
        country: "",
        continent: "",
        overview: "",
        departurePlace: ""
    });

    const [imageInitial, setImageInitial] = useState(null);
    const [imagesAll, setImagesAll] = useState([]);

    // activer/désactiver les champs :
    const [disableInput, setDisableInput] = useState({
        reference: true,
        nameDest: true,
        country: true,
        continent: true,
        overview: true,
        departurePlace: true
    });

    // pour ne pas soumettre le formulaire, si les inputs ne sont pas valides:
    const [isModFormValidated, setIsModFormValidated] = useState(false);

    // pour afficher les messages suite à la modif des champs :
    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // charger les données dans le formulaire lors du chargement de la page :
    useEffect(() => {
        if (resultsDestinations[index]) {
            setFormData({
                reference: resultsDestinations[index].d.reference,
                nameDest: resultsDestinations[index].d.nameDest,
                country: resultsDestinations[index].d.country,
                continent: resultsDestinations[index].d.continent,
                overview: resultsDestinations[index].d.overview,
                departurePlace: resultsDestinations[index].d.departurePlace,
                lodgingID: resultsDestinations[index].d.lodgingID
            });
        }
    },[resultsDestinations[index]])

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
            console.log("Destination Data modif form sent!");
            formData.id = resultsDestinations[index].d.id;
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/destinaions/modify`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const json = await res.json();
            
            if (res.status === 201) {
                setOkMsg("Les modifications ont été enregistrée.");
            }
        }
    }

    async function handleDelete() {
        console.log("Destination delete data query sent!");
        formData.id = resultsDestinations[index].d.id;
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/destinaions/delete`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const json = await res.json();
        if (res.status === 201) {
            setOkMsg("La destination a été supprimée.");
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

    return <section className={styles.admin_db_section}>
            { formData && 
            <>
                <h1>modifier/supprimer une destination</h1>
                <form onSubmit={handleSubmit} className={styles.modify_form}>
                    <label className={styles.modify_label}>
                        <span>Nom de la destination :</span>
                        <input type="text" 
                            name="nameDest" 
                            value={formData.nameDest}
                            onChange={handleChange}
                            onFocus={() => {
                                setOkMsg('');
                                setErrMsg('');}}
                            disabled={disableInput.nameDest}/>
                        <button type="button" onClick={() => activateInput("nameDest")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>
                    </label>

                    <label className={styles.modify_label}>
                        <span>Numéro de référence :</span>
                        <input type="text" 
                            name="reference" 
                            value={formData.reference}
                            onChange={handleChange}
                            onFocus={() => {
                                setOkMsg('');
                                setErrMsg('');}}
                            disabled={disableInput.reference}/>
                        <button type="button" onClick={() => activateInput("reference")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>
                    </label>

                    <label className={styles.modify_label}>
                        <span>Pays :</span>
                        <input
                            name="country" 
                            value={formData.country}
                            onChange={handleChange}
                            onFocus={() => {
                                setOkMsg('');
                                setErrMsg('');}}
                            disabled={disableInput.country}/>
                        <button type="button" onClick={() => activateInput("country")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>
                    </label>

                    <label className={styles.modify_label}>
                        <span>Continent :</span>
                        <input
                            name="continent" 
                            value={formData.continent}
                            onChange={handleChange}
                            onFocus={() => {
                                setOkMsg('');
                                setErrMsg('');}}
                            disabled={disableInput.continent}/>
                        <button type="button" onClick={() => activateInput("continent")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>
                    </label>

                    <label className={styles.modify_label}>
                        <span>Description :</span>
                        <textarea
                            name="overview" 
                            value={formData.overview}
                            onChange={handleChange}
                            disabled={disableInput.overview}/>
                        <button type="button" onClick={() => activateInput("overview")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>
                    </label> 

                    <label className={styles.modify_label}>
                        <span>Point(s) de départ :</span>
                        <textarea
                            name="departurePlace" 
                            value={formData.departurePlace}
                            onChange={handleChange}
                            disabled={disableInput.departurePlace}/>
                        <button type="button" onClick={() => activateInput("departurePlace")}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </button>
                    </label> 

                    <label className={styles.modify_label}>  
                        <span>Image initiale :</span>
                        <input type="file" 
                            name="imageInitial" 
                            accept="image/jpg"
                            onChange={(e) => setImageInitial(e.target.files[0])}
                            />
                    </label>
                    <label className={styles.modify_label}>
                        <span>Images pour slideshow :</span>
                        <input type="file" 
                            name="imageAll" 
                            accept="image/jpg"
                            multiple
                            onChange={(e) => setImagesAll(e.target.files)}
                            />
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

export default AdminDashDestinationsModify;