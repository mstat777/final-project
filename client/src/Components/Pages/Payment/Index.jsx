import styles from './Payment.module.scss';
import variables from './Stripe.module.scss';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm/Index';

function Payment(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");
    const { bookingInfo } = useSelector((state) => state.booking);

    const [stripePromise, setStripePromise] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: variables.secondaryColor,
            colorBackground: variables.primaryColor,
            colorText: variables.tertiaryColor,
            colorTextPlaceholder: variables.secondaryColor,
            colorDanger: variables.highlightColor,
            iconCardCvcColor: variables.tertiaryColor,
            iconChevronDownColor: variables.tertiaryColor,
            fontFamily: variables.mainFont,
            spacingGridRow: '1rem',
            spacingUnit: '2px',
            borderRadius: '4px',
        },
        rules: {
            '.Input': {
                color: variables.colorPrimary,
            },
        }
    }

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
                const res = await fetch(`${BASE_URL}/api/v.0.1/payment/create-payment-intent`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        Authentication: "Bearer " + TOKEN },
                    body: JSON.stringify({
                        paymentMethodType: 'card',
                        currency: 'eur',
                        amount: bookingInfo.prices.total_all*100
                    })
                });
                const { clientSecret } = await res.json();
                setClientSecret(clientSecret);
            } catch (err) {
                console.log(err.message);
            }
        }
        if (bookingInfo.prices.total_all) {
            getClientSecret(); 
        }
    },[bookingInfo]);

    return <main id="payment">
                <section className={styles.payment_section}>
                    <h1>Paiement</h1>
                    <p>Montant du paiement : {bookingInfo.prices.total_all.toFixed(2)} &euro;</p>
                    {stripePromise && clientSecret &&
                        <Elements 
                            stripe={stripePromise} 
                            options={{ clientSecret, appearance }}
                            key={clientSecret}>
                            <CheckoutForm clientSecret={clientSecret}/>
                        </Elements>
                    }
                </section>
            </main>
}

export default Payment;