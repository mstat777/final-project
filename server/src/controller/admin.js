import Query from "../model/Query.js";

const getBookingByLastName = async (req, res) => {
    const query = "SELECT b.id, b.nb_adults, b.nb_children, b.price_total_booking, b.payment_type, b.status, b.date_created, u.first_name, u.last_name, u.email, u.tel, p.reference, p.departure_date, p.return_date, p.duration, d.name, d.country, d.departure_place FROM bookings AS b JOIN users AS u ON u.id = b.user_id JOIN packs AS p ON p.id = b.pack_id JOIN destinations AS d ON d.id = p.destination_id WHERE u.last_name = ?";
    const [datas] = await Query.findByValue(query, req.params.name);
    res.status(200).json({datas});
} 

export { getBookingByLastName,
};