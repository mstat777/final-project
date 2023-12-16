import styles from './userdash.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from "react-responsive";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

import { validateInput } from '../../../Functions/sanitize';

function UserDashboardMyInfos(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    // pour récuperer l'ID de l'utilisateur :
    const { userInfo } = useSelector(state => state.user);

    // les champs du formulaire :
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        email: "",
        tel: "",
        address: "",
        birthDate: "",
        occupation: ""
    });

    // activer/désactiver les champs :
    const [disableInput, setDisableInput] = useState({
        lastName: true,
        firstName: true,
        tel: true,
        address: true,
        birthDate: true,
        occupation: true
    });

    // pour ne pas soumettre le formulaire, si les inputs ne sont pas valides:
    const [isFormValidated, setIsFormValidated] = useState(false);

    // pour afficher les messages suite à la modif des champs :
    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // remonter au top de la page lors de chargement
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    useEffect(() => {
        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 0); }
    }, [])

    // on récupère les données de l'utilisateur pour 'automatiquement' remplir le formulaire lors du chargement de la page :
    useEffect(() => {
        async function fetchUser() {
            try {
                //console.log("userInfo.userID = "+userInfo.userID);
                const dataUser = await (await fetch(`${BASE_URL}/api/v.0.1/user/${userInfo.userID}`)).json();
                // initialiser les données utilisateur :
                setFormData({
                    lastName: dataUser.datas[0].last_name,
                    firstName: dataUser.datas[0].first_name,
                    email: dataUser.datas[0].email,
                    tel: dataUser.datas[0].tel,
                    address: dataUser.datas[0].address,
                    birthDate: dataUser.datas[0].birth_date.slice(0,dataUser.datas[0].birth_date.indexOf('T')),
                    occupation: dataUser.datas[0].occupation
                });
                //console.log("dataUser.datas[0].birth_date = "+dataUser.datas[0].birth_date);
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser();
    },[]);

    // on vérifie tous les champs avant de soumettre le formulaire :
    const checkFormValidation = () => {
        const lNameVerif = validateInput("lastName", formData.lastName.trim());
        const fNameVerif = validateInput("firstName", formData.firstName.trim());
        // si un numéro de tél est rempli, on vérifie. Si non, on vérifie pas, car ce n'est pas un champ obligatoire :
        let telVerif = { isValid: true, msg: '' }
        if (formData.tel) {
            telVerif = validateInput("tel", formData.tel.trim());
        }
        // si un numéro de tél est rempli, on vérifie. Si non, on vérifie pas, car ce n'est pas un champ obligatoire :
        let addressVerif = { isValid: true, msg: '' }
        if (formData.address) {
            addressVerif = validateInput("address", formData.address.trim());
        }
        //
        const bDateVerif = validateInput("birthDate", formData.birthDate);
        // --------------------------------------------------------
        /*console.log("lastNameVerif.isValid = "+lNameVerif.isValid);
        console.log("firstNameVerif.isValid = "+fNameVerif.isValid);
        console.log("telVerif.isValid = "+telVerif.isValid);
        console.log("addressVerif.isValid = "+addressVerif.isValid);
        console.log("birthDateVerif.isValid = "+bDateVerif.isValid);*/

        // rassembler toutes les messages d'erreur pour les afficher au-dessous du formulaire :
        setErrMsg(lNameVerif.msg 
                    + fNameVerif.msg 
                    + telVerif.msg
                    + addressVerif.msg
                    + bDateVerif.msg);
        // si tous les champs obligatoires sont validés, on valide le formulaire :
        ( lNameVerif.isValid && 
        fNameVerif.isValid && 
        telVerif.isValid &&
        addressVerif.isValid &&
        bDateVerif.isValid) ? setIsFormValidated(true) : setIsFormValidated(false);
        console.log("isFormValidated = "+isFormValidated);
    }

    useEffect(() => {
        if (isFormValidated === true) {
            submitForm();
        }
    },[isFormValidated]);

    async function submitForm() {
        if (isFormValidated) {
            console.log("User Data modif form sent!");
            const res = await fetch(`${BASE_URL}/api/v.0.1/user/modify-user-info`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
                    /*{lastName,
                    firstName,
                    email,
                    tel,
                    address,
                    birthDate,
                    occupation})*/
            });
            const json = await res.json();
            //console.log(json.msg);
            
            if (res.status === 201) {
                setOkMsg("Les modifications ont été enregistrée.")
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
        {formData && 
        <main className={styles.user_db_main}>
        
            <h2>mes informations personnelles</h2>

            <form onSubmit={handleSubmit} className={styles.user_db_account_form}>
                <label className={styles.user_db_label}>
                    <span>Nom :</span>
                    <input type="text" 
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={disableInput.lastName}/>
                    <button type="button" onClick={() => activateInput("lastName")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.user_db_label}>
                    <span>Prénom :</span>
                    <input type="text" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={disableInput.firstName}/>
                    <button type="button" onClick={() => activateInput("firstName")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.user_db_label}>
                    <span>Email :</span>
                    <input type="email" 
                        name="email" 
                        value={formData.email}
                        className={styles.email}
                        disabled={true}/>
                </label>

                <label className={styles.user_db_label}>
                    <span>Numéro de téléphone :</span>
                    <input type="tel" 
                        name="tel" 
                        value={formData.tel}
                        onChange={handleChange}
                        disabled={disableInput.tel}/>
                    <button type="button" onClick={() => activateInput("tel")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.user_db_label}>
                    <span>Adresse postale :</span>
                    <textarea
                        name="address" 
                        value={formData.address}
                        onChange={handleChange}
                        disabled={disableInput.address}/>
                    <button type="button" onClick={() => activateInput("address")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.user_db_label}>
                    <span>Date de naissance :</span>
                    <input type="date" 
                        name="birthDate" 
                        min="1923-01-01"
                        value={formData.birthDate}
                        onChange={handleChange}
                        disabled={disableInput.birthDate}/>
                    <button type="button" onClick={() => activateInput("birthDate")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label className={styles.user_db_label}>
                    <span>Métier :</span>
                    <input type="text" 
                        name="occupation" 
                        value={formData.occupation}
                        onChange={handleChange}
                        disabled={disableInput.occupation}/>
                    <button type="button" onClick={() => activateInput("occupation")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <button type="submit">enregistrer</button>

            </form>

            { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
            { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }

        </main>
        }
    </>
}

export default UserDashboardMyInfos;