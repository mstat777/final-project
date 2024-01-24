import styles from './MyBookings.module.scss';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";
import { modifyBooking } from '../../../../../store/slices/user';
import { setBookedData } from '../../../../../store/slices/booking';
import { formatDate } from '../../../../Functions/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import BtnWithAlert from '../../../../Containers/buttons/BtnWithAlert/Index';

function UserDashboardMyBookings(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const { userInfo } = useSelector(state => state.user);
    const [ userBookings, setUserBookings] = useState([]);

    const { bookedData, bookingInfo } = useSelector((state) => state.booking);

    // pour afficher des messages suite à la suppression :
    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // remonter au top de la page lors de chargement
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    // on récupère les données de toutes les réservations effectuées par l'utilisateur :
    useEffect(() => {
        async function fetchBookings() {
            try {
                const dataBookings = await (await fetch(`${BASE_URL}/api/v.0.1/booking/user/${userInfo.userID}`, 
                    { headers: { Authentication: "Bearer " + TOKEN }})).json();
                setUserBookings(dataBookings.datas);
            } catch (error) {
                console.log(error);
            }
        }
        fetchBookings();
    }, [userBookings.length]);

    // modifier une des réservations de l'utilisateur :
    async function handleModify(bookingID, packID) {
        try {
            console.log("bookingID= "+bookingID);
            console.log("packID= "+packID);
            // récupérer toutes les données de la réservation sélectionnée :
            const res = await fetch(`${BASE_URL}/api/v.0.1/booking/all-data`, {
                method: "post",
                headers: { "Content-Type": "application/json",
                            Authentication: "Bearer " + TOKEN },
                body: JSON.stringify({ bookingID })
            });
            const dataAll = await res.json();

            if (res.status === 200) {
                setOkMsg("Les données ont été trouvées.");
                dispatch(setBookedData(dataAll));

                // pour indiquer quel pack sera modifier
                const bookingIDs = {
                    bookingID: bookingID,
                    packID: packID
                }
                dispatch(modifyBooking(bookingIDs));
                navigate("/db/user/booking-modify");
            }  else {
                console.log(res.status);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // supprimer une des réservations de l'utilisateur :
    async function handleDelete(id, index) {
        const res = await fetch(`${BASE_URL}/api/v.0.1/booking/delete`, {
            method: "post",
            headers: { "Content-Type": "application/json",
                        Authentication: "Bearer " + TOKEN },
            body: JSON.stringify({ id })
        });
        if (res.status === 201) {
            setOkMsg("La réservation a été supprimée.");
            // on supprime l'élément du tableau :
            userBookings.splice(index, 1);
        }
    }

    return <main className={styles.user_db_main}>
            <section className={styles.user_db_section}>

                <h1>mes réservations</h1>
                { console.log(bookingInfo)}

                {userBookings[0] ? 
                <>
                    { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
                    { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }

                    <div className={styles.bookings_main_ctn}>
                    { userBookings.map((booking, index) => 
                        <div key={index} className={styles.booking_ctn}>
                            
                            <div className={styles.el_index}>
                                <span>N&deg;</span> 
                                <span>{index+1}</span>
                            </div>
                            <div className={styles.el_d_created}>
                                <span>date :</span>
                                <span>{formatDate(booking.b.date_created)}</span>
                            </div>

                            <div className={styles.el_btn_ctn}>
                                <button type="button"
                                    onClick={() => handleModify(booking.b.id, booking.p.id
                                    )}>
                                    <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                                </button>
                                <BtnWithAlert 
                                    type="button"
                                    clickFunc={() => handleDelete(booking.b.id, index)}
                                    text={
                                        <FontAwesomeIcon icon={faTrashCan} className={styles.delete_icon}/>
                                    }/>
                            </div>

                            <div className={styles.el_destination}>
                                <span>dest{!isMobile ? "ination" : "."} :</span>
                                <span>{booking.d.name}</span>
                            </div>

                            <div className={styles.el_country}>
                                <span>pays :</span>
                                <span>{booking.d.country}</span>
                            </div>

                            <div className={styles.el_adults}>
                                <span>adultes :</span>
                                <span>{booking.b.nb_adults}</span>
                            </div>                
                            <div className={styles.el_children}>
                                <span>enfants :</span>
                                <span>{booking.b.nb_children}</span>
                            </div>                
                            <div className={styles.el_total_pr}>
                                <span>{!isMobile && "prix "}total :</span>
                                <span>{booking.b.price_total_booking.slice(0,-3)}&euro;</span>
                            </div>              
                            
                        </div>
                    )}
                    </div> 
                </>
                : <p className={styles.err_msg}>Aucun réservation trouvée</p>
                }
            </section>
        </main>
}

export default UserDashboardMyBookings;