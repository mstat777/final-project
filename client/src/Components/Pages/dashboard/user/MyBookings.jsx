import styles from './userdash.module.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { modifyBooking } from '../../../../store/slices/user';
import { setBookedData } from '../../../../store/slices/booking';

function UserDashboardMyBookings(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector(state => state.user);

    const [ userBookings, setUserBookings] = useState([]);

    // pour afficher des messages suite à la suppression :
    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // remonter au top de la page lors de chargement
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    useEffect(() => {
        console.log("isMobile = "+isMobile);
        console.log("isTabletOrDesktop = "+isTabletOrDesktop);
        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 0); }
    }, [])

    // on récupère les données de toutes les réservations effectuées par l'utilisateur :
    useEffect(() => {
        async function fetchBookings() {
            try {
                const dataBookings = await (await fetch(`${BASE_URL}/api/v.0.1/user/mybookings/${userInfo.userID}`)).json();
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
            // récupérer toutes les données de la réservation sélectionnée :
            const res = await fetch(`${BASE_URL}/api/v.0.1/user/booking-all-data`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingID })
            });
            const dataAll = await res.json();
            console.log(dataAll);

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
        const shouldRemove = window.confirm("Êtez-vous sûr ?");
        if (shouldRemove) {
            console.log("User booking delete query sent!");
            const res = await fetch(`${BASE_URL}/api/v.0.1/user/booking/delete`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const json = await res.json();

            if (res.status === 201) {
                setOkMsg("La réservation a été supprimée.");
                // on supprime l'élément du tableau :
                userBookings.splice(index, 1);
            }
        }
    }

    return <main className={styles.user_db_main}>
            <div className={styles.user_db_section}>

                <h2>mes réservations</h2>

                {userBookings[0] ? 
                <>
                    <div className={styles.bookings_main_ctn}>
                    { userBookings.map((booking, index) => 
                        <div key={index} className={styles.booking_ctn}>
                            
                            <div className={styles.booking_el_index}>
                                <span>N&deg;</span> 
                                <span>{index+1}</span>
                            </div>
                            <div className={styles.booking_el_d_created}>
                                <span>date :</span>
                                <span>{new Date(booking.b.date_created).toLocaleString().slice(0,-9)}</span>
                            </div>
                            <div className={styles.booking_el_btn_ctn}>
                                <button type="button"
                                    onClick={() => handleModify(booking.b.id, booking.p.id
                                    )}>
                                    <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                                </button>
                                <button type="button"
                                    onClick={() => handleDelete(booking.b.id, index)}>
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.delete_icon}/>
                                </button>
                            </div>

                            <div className={styles.booking_el_destination}>
                                <span>dest{!isMobile ? "ination" : "."} :</span>
                                <span>{booking.d.name}</span>
                            </div>
                            <div className={styles.booking_el_country}>
                                <span>pays :</span>
                                <span>{booking.d.country}</span>
                            </div>

                            <div className={styles.booking_el_adults}>
                                <span>adultes :</span>
                                <span>{booking.b.nb_adults}</span>
                            </div>                
                            <div className={styles.booking_el_children}>
                                <span>enfants :</span>
                                <span>{booking.b.nb_children}</span>
                            </div>                
                            <div className={styles.booking_el_total_pr}>
                                <span>{!isMobile && "prix "}total :</span>
                                <span>{booking.b.price_total_booking.slice(0,-3)}&euro;</span>
                            </div>              
                            

                        </div>
                    )}
                    </div> 
                    { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
                    { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }
                </>
                : <p className={styles.msg_nok}>Aucun réservation trouvée</p>
                }
            </div>
        </main>
}

export default UserDashboardMyBookings;