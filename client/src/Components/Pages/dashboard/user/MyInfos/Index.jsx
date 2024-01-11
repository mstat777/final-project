import styles from './MyInfos.module.scss';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from "react-responsive";
import { formatDate } from '../../../../Functions/utils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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
        occupation: "",
        passwordOld: "",
        passwordNew: "",
        passwordNew2: ""
    });

    // activer/désactiver les champs :
    const [disableInputs, setDisableInputs] = useState({
        lastName: true,
        firstName: true,
        tel: true,
        address: true,
        birthDate: true,
        occupation: true
    });

    // afficher/cacher les champs de modif du mdp :
    const [showPswdModif, setShowPswdModif] = useState(false);

    // pour l'icone "l'oeil" d'affichage du mdp :
    const [passInputType, setPassInputType] = useState({
        old: "password",
        new: "password",
        new2: "password"
    });
    const [passIcon, setPassIcon] = useState({
        old: faEyeSlash,
        new: faEyeSlash,
        new2: faEyeSlash
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
        if (errMsg || okMsg) { window.scrollTo(0, document.body.scrollHeight); }
    }, [errMsg, okMsg])

    // afficher/cacher les mdp :
    function handlePassIconToggle(e) {
        if (passInputType[e.currentTarget.name] === "password") {
            setPassIcon({...passIcon, [e.currentTarget.name]: faEye});
            setPassInputType({...passInputType, [e.currentTarget.name]: 'text'});
        } else {
            setPassIcon({...passIcon, [e.currentTarget.name]: faEyeSlash});
            setPassInputType({...passInputType, [e.currentTarget.name]: 'password'});
        }
    }

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
        // si modification de mdp :
        if (inputs.passwordOld || inputs.passwordNew || inputs.passwordNew2) {
            if (!inputs.passwordOld) {
                setErrMsg("Vous n'avez pas renseigné votre ancien mot de passe.");
                return;
            } 
            if (!inputs.passwordNew) {
                setErrMsg("Vous n'avez pas indiqué un nouveau mot de passe.");
                return;
            }
            if (!inputs.passwordNew2) {
                setErrMsg("La confirmation du nouveau mot de passe est erronée.");
                return;
            }
            if (inputs.passwordNew !== inputs.passwordNew2){
                setErrMsg("La confirmation du nouveau mot de passe est erronée.");
                return;
            }
            // vérifier le nouveau mot de passe :
            const passVerif = validateInput("passwordNew", inputs.passwordNew); 
            if (!passVerif.isValid) {
                setErrMsg(passVerif.msg);
                return;
            } 
        }
        // Vérifier les champs obligatoires :
        const lNameVerif = validateInput("lastName", inputs.lastName.trim());
        const fNameVerif = validateInput("firstName", inputs.firstName.trim());
        const bDateVerif = validateInput("birthDate", inputs.birthDate);

        // Vérifier les champs facultatifs (si remplis) :
        let telVerif = { isValid: true, msg: '' }
        if (inputs.tel) {
            telVerif = validateInput("tel", inputs.tel.trim());
        }
        let addressVerif = { isValid: true, msg: '' }
        if (inputs.address) {
            addressVerif = validateInput("address", inputs.address.trim());
        }

        // afficher toutes les messages d'erreur :
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
    }

    useEffect(() => {
        if (isFormValidated === true) {
            submitForm();
        }
    },[isFormValidated]);

    async function submitForm() {
        if (isFormValidated) {
            const res = await fetch(`${BASE_URL}/api/v.0.1/user/modify-user-info`, {
                method: "post",
                headers: { "Content-Type": "application/json",
                            Authentication: "Bearer " + TOKEN },
                body: JSON.stringify(inputs)
            });
            const json = await res.json();  
            if (res.status === 201) {
                setOkMsg("Les modifications ont été enregistrée.")
            } else {
                setErrMsg(json.msg)
            }
        }
    }

    const activateInput = (inputName) => {
        setDisableInputs({ ...disableInputs, [inputName]: false });
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
                        disabled={disableInputs.lastName}/>
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
                        disabled={disableInputs.firstName}/>
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
                        disabled={disableInputs.tel}/>
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
                        disabled={disableInputs.address}/>
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
                        disabled={disableInputs.birthDate}/>
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
                        disabled={disableInputs.occupation}/>
                    <button type="button" onClick={() => activateInput("occupation")}>
                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                    </button>
                </label>

                <label>
                    <span>Mot de passe :</span>
                    <button type="button" 
                            className={styles.passwordBtn}
                            onClick={() => setShowPswdModif(true)}>modifier mon mot de passe</button>
                </label>
                {showPswdModif && <>
                    <label>
                        <span>Mot de passe actuel :</span>
                        <input type={passInputType.old}  
                            name="passwordOld" 
                            value={inputs.passwordOld}
                            onChange={handleChange}/>
                        <button type="button"
                                className={styles.pass_icon_ctn} 
                                name="old" 
                                onClick={handlePassIconToggle}>
                            <FontAwesomeIcon icon={passIcon.old} className={styles.pass_icon}/>
                        </button>
                    </label>    
                    <label>
                        <span>Nouveau mot de passe :</span>
                        <input type={passInputType.new}  
                            name="passwordNew" 
                            value={inputs.passwordNew}
                            onChange={handleChange}/>
                        <button type="button"
                                className={styles.pass_icon_ctn} 
                                name="new" 
                                onClick={handlePassIconToggle}>
                            <FontAwesomeIcon icon={passIcon.new} className={styles.pass_icon}/>
                        </button>
                    </label> 
                    <label>
                        <span>Confirmer le nouveau mdp :</span>
                        <input type={passInputType.new2}  
                            name="passwordNew2" 
                            value={inputs.passwordNew2}
                            onChange={handleChange}/>
                        <button type="button"
                                className={styles.pass_icon_ctn} 
                                name="new2" 
                                onClick={handlePassIconToggle}>
                            <FontAwesomeIcon icon={passIcon.new2} className={styles.pass_icon}/>
                        </button>
                    </label> 
                </>}

                <MainBtn type="submit" text="enregistrer"/>
            </form>

            { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
            { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }

        </main>
}

export default UserDashboardMyInfos;