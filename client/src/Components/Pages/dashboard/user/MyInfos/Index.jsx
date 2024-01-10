import styles from './MyInfos.module.scss';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from "react-responsive";
import { formatDate } from '../../../../Functions/utils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { validateInput } from '../../../../Functions/sanitize';
import MainBtn from '../../../../Containers/buttons/MainBtn/Index';

function UserDashboardMyInfos(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");

    // pour récuperer l'ID de l'utilisateur :
    const { userInfo } = useSelector(state => state.user);

    // les champs du formulaire :
    const [inputs, setInputs] = useState({
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
                const dataUser = await (await fetch(`${BASE_URL}/api/v.0.1/user/${userInfo.userID}`, {
                    headers: { Authentication: "Bearer " + TOKEN }
                })).json();
                // initialiser les données utilisateur :
                setInputs({
                    lastName: dataUser.datas[0].last_name,
                    firstName: dataUser.datas[0].first_name,
                    email: dataUser.datas[0].email,
                    tel: dataUser.datas[0].tel,
                    address: dataUser.datas[0].address,
                    birthDate: formatDate(dataUser.datas[0].birth_date),
                    occupation: dataUser.datas[0].occupation
                });
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser();
    },[]);

    // on vérifie tous les champs avant de soumettre le formulaire :
    const checkFormValidation = () => {
        const lNameVerif = validateInput("lastName", inputs.lastName.trim());
        const fNameVerif = validateInput("firstName", inputs.firstName.trim());
        // si un numéro de tél est rempli, on vérifie. Si non, on vérifie pas, car ce n'est pas un champ obligatoire :
        let telVerif = { isValid: true, msg: '' }
        if (inputs.tel) {
            telVerif = validateInput("tel", inputs.tel.trim());
        }
        // si un numéro de tél est rempli, on vérifie. Si non, on vérifie pas, car ce n'est pas un champ obligatoire :
        let addressVerif = { isValid: true, msg: '' }
        if (inputs.address) {
            addressVerif = validateInput("address", inputs.address.trim());
        }
        //
        const bDateVerif = validateInput("birthDate", inputs.birthDate);

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
                headers: { "Content-Type": "application/json",
                            Authentication: "Bearer " + TOKEN },
                body: JSON.stringify(inputs)
            });
            const json = await res.json();
            
            if (res.status === 201) {
                setOkMsg("Les modifications ont été enregistrée.")
            }
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

    return inputs && 
        <main className={styles.user_db_main}>
            <h1>mes informations personnelles</h1>

            <form onSubmit={handleSubmit} className={styles.user_account_form}>
                <label>
                    <span>Nom :</span>
                    <input type="text" 
                        name="lastName" 
                        value={inputs.lastName}
                        onChange={handleChange}
                        disabled={disableInput.lastName}/>
                    <button type="button" onClick={() => activateInput("lastName")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label>
                    <span>Prénom :</span>
                    <input type="text" 
                        name="firstName" 
                        value={inputs.firstName}
                        onChange={handleChange}
                        disabled={disableInput.firstName}/>
                    <button type="button" onClick={() => activateInput("firstName")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label>
                    <span>Email :</span>
                    <input type="email" 
                        name="email" 
                        value={inputs.email}
                        className={styles.email}
                        disabled={true}/>
                </label>

                <label>
                    <span>Numéro de téléphone :</span>
                    <input type="tel" 
                        name="tel" 
                        value={inputs.tel}
                        onChange={handleChange}
                        disabled={disableInput.tel}/>
                    <button type="button" onClick={() => activateInput("tel")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label>
                    <span>Adresse postale :</span>
                    <textarea
                        name="address" 
                        value={inputs.address}
                        onChange={handleChange}
                        disabled={disableInput.address}/>
                    <button type="button" onClick={() => activateInput("address")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label>
                    <span>Date de naissance :</span>
                    <input type="date" 
                        name="birthDate" 
                        min="1923-01-01"
                        value={inputs.birthDate}
                        onChange={handleChange}
                        disabled={disableInput.birthDate}/>
                    <button type="button" onClick={() => activateInput("birthDate")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label>
                    <span>Métier :</span>
                    <input type="text" 
                        name="occupation" 
                        value={inputs.occupation}
                        onChange={handleChange}
                        disabled={disableInput.occupation}/>
                    <button type="button" onClick={() => activateInput("occupation")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <MainBtn type="submit" text="enregistrer"/>
            </form>

            { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
            { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }

        </main>
}

export default UserDashboardMyInfos;