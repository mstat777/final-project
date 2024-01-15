import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

const getPublishableKey = (req, res) => {
    res.send({publishableKey: `${process.env.STRIPE_PUBLISHABLE_KEY}`});
}

const createPaymentIntent = async (req, res) => {
    try {
        //console.log(req.body);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: req.body.currency,
            payment_method_types: ["card"],
        });
        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (err){
        res.status(400).json({error: err.message});
    }
}

export { 
    getPublishableKey,
    createPaymentIntent
}