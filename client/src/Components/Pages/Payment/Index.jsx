import styles from './Payment.module.scss';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm/Index';

function Payment(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");
    const { bookingInfo, bookedData } = useSelector((state) => state.booking);

    const [stripePromise, setStripePromise] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    // remonter au top de la page lors de chargement
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        async function getPK(){
            try {
                const res = await fetch(`${BASE_URL}/api/v.0.1/payment/config`);
                const { publishableKey } = await res.json();
                setStripePromise(() => loadStripe(publishableKey));
            } catch (err) {
                console.log(err.message);
            }
        }
        getPK(); 
    },[]);

    useEffect(() => {
        async function getClientSecret(){
            try {
                let toPay = 0;
                // deux cas : une partie a déjà été payée ou tout est à payer :
                if (bookedData.datasBook) {
                    toPay = bookedData.datasBook[0].status !== "validée" ? bookingInfo.prices.totalAll : bookingInfo.prices.totalAll - bookedData.datasBook[0].price_total_booking;
                } else {
                    toPay = bookingInfo.prices.totalAll;
                }
                const res = await fetch(`${BASE_URL}/api/v.0.1/payment/create-payment-intent`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        Authentication: "Bearer " + TOKEN },
                    body: JSON.stringify({
                        paymentMethodType: 'card',
                        currency: 'eur',
                        amount: toPay*100
                    })
                });
                const { clientSecret } = await res.json();
                setClientSecret(clientSecret);
            } catch (err) {
                console.log(err.message);
            }
        }
        if (bookingInfo.prices.totalAll) {
            getClientSecret(); 
        }
    },[bookingInfo]);

    return <main id="payment">
                <section className={styles.payment_section}>
                    <h1>Paiement</h1>
                    {/* s'il reste à payer dans le cas de modif de la réservation : */}
                    <p>Montant du paiement : {!bookedData.datasBook ? 
                    bookingInfo.prices.totalAll.toFixed(2) : bookedData.datasBook[0].status === "validée" ? 
                    (bookingInfo.prices.totalAll - bookedData.datasBook[0].price_total_booking).toFixed(2) :
                    bookingInfo.prices.totalAll.toFixed(2)} &euro;</p>
                    {stripePromise && clientSecret &&
                        <Elements 
                            stripe={stripePromise} 
                            options={{ clientSecret }}
                            key={clientSecret}>
                            <CheckoutForm clientSecret={clientSecret}/>
                        </Elements>
                    }
                </section>
            </main>
}

export default Payment;