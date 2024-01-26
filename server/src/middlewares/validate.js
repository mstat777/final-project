import { body, validationResult } from 'express-validator';

export const validationRules = (method) => {
    switch (method) {
        case 'createUser': {
            return [
                body('lastName')
                    .exists()
                    .matches(/^[a-zàâçéèêëîïôûùüÿñæœ .'-]*$/i),
                body('firstName')
                    .exists()
                    .matches(/^[a-zàâçéèêëîïôûùüÿñæœ .'-]*$/i),
                body('email')
                    .exists()
                    .isEmail(),
                body('tel')
                    .exists()
                    .matches(/^[+0]{1}\d{9,14}$/),
                body('address')
                    .optional({ checkFalsy: true })
                    .matches(/\w+(\s\w+){2,}/),
                body('birthDate')
                    .exists()
                    .notEmpty()
                    .isDate(),
                body('occupation')
                    .optional({ nullable: true })
                    .escape()
                    .isLength({ max: 50 }),
                body('password')
                    .exists()
                    .escape()
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
            ];
        }
        case 'modifyUser': {
            return [
                body('lastName')
                    .exists()
                    .matches(/^[a-zàâçéèêëîïôûùüÿñæœ .'-]*$/i),
                body('firstName')
                    .exists()
                    .matches(/^[a-zàâçéèêëîïôûùüÿñæœ .'-]*$/i),
                body('email')
                    .exists()
                    .isEmail(),
                body('tel')
                    .exists()
                    .matches(/^[+0]{1}\d{9,14}$/),
                body('address')
                    .optional({ checkFalsy: true })
                    .matches(/\w+(\s\w+){2,}/),
                body('birthDate')
                    .exists()
                    .notEmpty()
                    .isDate(),
                body('occupation')
                    .optional({ checkFalsy: true })
                    .escape()
                    .isLength({ max: 50 }),
                body('passwordNew')
                    .optional({ checkFalsy: true })
                    .escape()
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
            ];
        }
        case 'signin': {
            return [
                body('email')
                    .exists()
                    .isEmail(),
                body('password')
                    .exists()
                    .escape()
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
            ];
        }
        case 'subscribeNewsletter': {
            return [
                body('userEmail')
                    .exists()
                    .isEmail()
            ];
        }
        case 'sendMail': {
            return [
                body('userName')
                    .exists()
                    .matches(/^[a-zàâçéèêëîïôûùüÿñæœ .'-]*$/i),
                body('userEmail')
                    .exists()
                    .isEmail(),
                body('userMessage')
                    .exists()
                    .escape()
                    .isLength({ min: 2, max: 600 })
            ];
        }
        case 'payment': {
            return [
                body('amount')
                    .exists()
                    .isInt({ min: 50, max: 100000000}),
                body('currency')
                    .exists()
                    .matches(/^[a-zA-Z]{3}$/)
            ];
        }
        case 'findPacks': {
            return [
                body('searchDestination')
                    .exists()
                    .matches(/^[a-zA-ZÀ-ÿ-'"(). ]*$/),
                body('departureDate')
                    .optional({ checkFalsy: true })
                    .isDate(),
                body('maxPrice')
                    .optional({ checkFalsy: true })
                    .matches(/^\d{0,5}(\.\d{1,2})?$/)
            ];
        }
        case 'createBooking': {
            return [
                body('nbAdults')
                    .exists()
                    .isInt({ min: 0, max: 100}),
                body('nbChildren')
                    .exists()
                    .isInt({ min: 0, max: 100}),
                body('priceTotalBooking')
                    .exists()
                    .matches(/^\d{0,6}(\.\d{1,2})?$/),
                body('paymentType')
                    .exists()
                    .isInt({ min: 1, max: 3}),
                body('status')
                    .exists()
                    .matches(/^[A-zÀ-ÿ][A-zÀ-ÿ ]+$/),
                body('packID')
                    .exists()
                    .matches(/^\d{0,20}$/),
                body('userID')
                    .exists()
                    .matches(/^\d{0,20}$/)
            ];
        }
        case 'modifyBooking': {
            return [
                body('nbAdults')
                    .exists()
                    .isInt({ min: 0, max: 100}),
                body('nbChildren')
                    .exists()
                    .isInt({ min: 0, max: 100}),
                body('priceTotalBooking')
                    .exists()
                    .matches(/^\d{0,6}(\.\d{1,2})?$/),
                body('paymentType')
                    .exists()
                    .isInt({ min: 1, max: 3}),
                body('status')
                    .exists()
                    .matches(/^[A-zÀ-ÿ][A-zÀ-ÿ ]+$/),
                body('bookingID')
                    .exists()
                    .matches(/^\d{0,20}$/)
            ];
        }
    }
}

export const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else { 
        next(); 
    }
}