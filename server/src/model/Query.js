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

    // Insérer plusieurs lignes dans la BDD en rajoutant un id en tant que dernier élément de chaque ligne. 'data' est un tableau de tableaux.
    static async writeAndAddId(query, data, id) {
        console.log(data);
        let newData = [];
        data.map(el => {
            el = [...el, id];
            newData.push(el);
            console.log(el);
        });
        console.log(newData);
        return await pool.query(query, [newData]);
    }
}

export default Query;