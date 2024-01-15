import styles from '../Payment.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import MainBtn from '../../../Containers/buttons/MainBtn/Index';

function CheckoutForm({clientSecret}){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const { bookingInfo } = useSelector((state) => state.booking);
    const { userInfo } =  useSelector((state) => state.user);

    const [isProcessing, setIsProcessing] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [okMsg, setOkMsg] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (!stripe || !elements){
            return;
        } 
        setIsProcessing(true);

        const {error, paymentIntent} = await stripe.confirmCardPayment(
            clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            }
        );

        if (error) {
            setErrMsg(error.message);
            const redirectTimeout = setTimeout(() => {
                navigate(-1);
            }, 9000);
            return () => clearTimeout(redirectTimeout);
        } 
        else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setOkMsg("Statut de paiement : "+paymentIntent.status);
            // on enregistre la réservation dans la BDD :
            const res = await fetch(`${BASE_URL}/api/v.0.1/booking/create`, {
                method: "post",
                headers: { "Content-Type": "application/json",
                            Authentication: "Bearer " + TOKEN },
                body: JSON.stringify({ 
                    nb_adults: bookingInfo.nb_adults.pack,
                    nb_children: bookingInfo.nb_children.pack,
                    price_total_booking: bookingInfo.prices.total_all,
                    paymentType: '1',
                    status: 'validée',
                    pack_id: bookingInfo.packID,
                    user_id: userInfo.userID,
                    activities: bookingInfo.selectedActivities
                })
            });
            if (res.status === 201) {
                const redirectTimeout = setTimeout(() => {
                    navigate("/confirmation");
                }, 9000);
                return () => clearTimeout(redirectTimeout);
            }
        } else {
            setErrMsg("état inattendu");
        }
        setIsProcessing(false);
    }

    return <>
        <form onSubmit={handleSubmit} className={styles.payment_form}>
            <CardElement/>
            <MainBtn type="submit" 
                    disabled={isProcessing} 
                    text={isProcessing ? "traitement ..." : "payer"}/>
        </form>
        { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
        { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }
    </>
}

export default CheckoutForm;