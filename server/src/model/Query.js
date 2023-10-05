import pool from "../config/db.js";

class Query{

    static async find(query){
        return await pool.query(query);
    }

    static async findByValue(query, value){
        return await pool.query(query, [value]);
    }
    
    static async write(query, data) {
        return await pool.query(query, [...Object.values(data)]);
    }
}

export default Query;