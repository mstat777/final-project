import styles from '../dashboard.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function UserDashboardMyInfos(){
    // pour récuperer l'ID de l'utilisateur
    const { userInfo } = useSelector(state => state.user);

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        email: "",
        tel: "",
        address: "",
        birthDate: "",
        occupation: ""
    });

    // pour ne pas soumettre le formulaire, si les inputs ne sont pas valides:
    const [isFormValidated, setIsFormValidated] = useState(false);

    const [msg, setMsg] = useState(null);

    useEffect(() => {
        // on récupère les données de l'utilisateur pour 'automatiquement' remplir le formulaire lors du chargement de la page :
        async function fetchUser() {
            try {
                //console.log("userInfo.userID = "+userInfo.userID);
                const dataUser = await (await fetch(`/api/v.0.1/user/${userInfo.userID}`)).json();
                setFormData({
                    lastName: dataUser.datas[0].last_name,
                    firstName: dataUser.datas[0].first_name,
                    email: dataUser.datas[0].email,
                    tel: dataUser.datas[0].tel,
                    address: dataUser.datas[0].address,
                    birthDate: dataUser.datas[0].birth_date,
                    occupation: dataUser.datas[0].occupation
                });
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser();
    },[])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const checkFormValidation = () => {
        
    }

    useEffect(() => {
        if (isFormValidated === true) {
            submitForm();
        }
    },[isFormValidated]);

    async function submitForm() {
        if (isFormValidated) {
            console.log("User Data modif form sent!");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // vérifier si tous les champs sont valides :
        checkFormValidation();
    }

    return <main className={styles.user_db_main}>
            <h2>mes informations personnelles</h2>

            <form onSubmit={handleSubmit} className={styles.user_db_account_form}>
                <label className={styles.user_db_label}>
                    <span>Nom :</span>
                    <input type="text" 
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleChange}/>
                    <button onClick={() => {}}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>
                <label className={styles.user_db_label}>
                    <span>Prénom :</span>
                    <input type="text" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleChange}/>
                    <button onClick={() => {}}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>
                <label className={styles.user_db_label}>
                    <span>Email :</span>
                    <span className={styles.email}>{formData.email}</span>
                </label>
                <label className={styles.user_db_label}>
                    <span>Numéro de téléphone :</span>
                    <input type="tel" 
                        name="tel" 
                        value={formData.tel}
                        onChange={handleChange}/>
                    <button onClick={() => {}}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>
                <label className={styles.user_db_label}>
                    <span>Adresse postale :</span>
                    <textarea type="text" 
                        name="address" 
                        value={formData.address}
                        onChange={handleChange}/>
                    <button onClick={() => {}}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>
                <label className={styles.user_db_label}>
                    <span>Date de naissance :</span>
                    <input type="date" 
                        name="birthDate" 
                        min="1923-01-01"
                        value={formData.birthDate}
                        onChange={handleChange}/>
                    <button onClick={() => {}}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>
                <label className={styles.user_db_label}>
                    <span>Métier :</span>
                    <input type="text" 
                        name="occupation" 
                        value={formData.occupation}
                        onChange={handleChange}/>
                    <button onClick={() => {}}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>
                <button type="submit">enregistrer</button>
            </form>
        </main>
}

export default UserDashboardMyInfos;