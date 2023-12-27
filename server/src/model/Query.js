import pool from "../config/db.js";

class Query{
    static async find(query){
        return await pool.query(query);
    }

    static async queryByValue(query, value){
        return await pool.query(query, [value]);
    }
    // dans le cas de plusieurs tables :
    static async queryByValueNTables(query, value){
        return await pool.query({sql: query, nestTables: true}, [value]);
    }

    static async queryByObject(query, datas){
        return await pool.query(query, [...Object.values(datas)]);
    }

    static async queryByArray(query, datas){
        return await pool.query(query, datas);
    }
    // dans le cas de plusieurs tables :
    static async queryByArrayNTables(query, datas){
        return await pool.query({sql: query, nestTables: true}, datas);
    }    
}

export default Query;