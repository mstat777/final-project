import styles from '../dashboard.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function UserDashboardMyInfos(){
    // pour récuperer l'ID de l'utilisateur
    const { userInfo } = useSelector(state => state.user);

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        email: "",
        tel: "",
        addresse: "",
        birthDate: "",
        occupation: ""
    });

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
                    addresse: dataUser.datas[0].addresse,
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

    async function handleSubmit(e) {
        e.preventDefault();
    }

    return <main className={styles.user_db_main}>
            <h2>mes informations personnelles</h2>

            <form onSubmit={handleSubmit} className={styles.user_db_account_form}>
                <label className={styles.user_db_label}>
                    <span>Votre nom : </span>
                    <input type="text" 
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleChange}/>
                </label>
                <label className={styles.user_db_label}>
                    <span>Votre prénom : </span>
                    <input type="text" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleChange}/>
                </label>
                <label className={styles.user_db_label}>
                    <span>Votre prénom : </span>
                    <span className={styles.email}>{formData.email}</span>
                </label>
                <label className={styles.user_db_label}>
                    <span>Votre numéro de téléphone : </span>
                    <input type="tel" 
                        name="tel" 
                        value={formData.tel}
                        onChange={handleChange}/>
                </label>
                <label className={styles.user_db_label}>
                    <span>Votre adresse : </span>
                    <textarea type="text" 
                        name="addresse" 
                        value={formData.addresse}
                        onChange={handleChange}/>
                </label>
                <label className={styles.user_db_label}>
                    <span>Votre date de naissance : </span>
                    <input type="date" 
                        name="birthDate" 
                        min="1923-01-01"
                        value={formData.birthDate}
                        onChange={handleChange}/>
                </label>
                <label className={styles.user_db_label}>
                    <span>Votre métier : </span>
                    <input type="text" 
                        name="occupation" 
                        value={formData.occupation}
                        onChange={handleChange}/>
                </label>
                <button type="submit">modifier</button>
            </form>
        </main>
}

export default UserDashboardMyInfos;