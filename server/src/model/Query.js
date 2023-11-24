import pool from "../config/db.js";

class Query{

    static async find(query){
        return await pool.query(query);
    }

    static async findByValue(query, value){
        return await pool.query(query, [value]);
    }

    // la même fonction, mais dans le cas on joint plusieurs tables. "nestTables: true" pour éviter l'écrasement de données dont les colonnes ont le même nom
    static async findByValueMultipleTables(query, value){
        return await pool.query({sql: query, nestTables: true}, [value]);
    }

    static async findByDatas(query, datas){
        return await pool.query(query, [...Object.values(datas)]);
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