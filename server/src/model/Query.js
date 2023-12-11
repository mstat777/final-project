import pool from "../config/db.js";

class Query{
    // ----------------- READ ------------------------
    static async find(query){
        return await pool.query(query);
    }

    // chercher par une seule valeur :
    static async findByValue(query, value){
        return await pool.query(query, [value]);
    }
    // une seule valeur dans le cas on joint plusieurs tables :
    static async findByValueNTables(query, value){
        return await pool.query({sql: query, nestTables: true}, [value]);
    }

    // 'datas' est un objet
    static async findByDatas(query, datas){
        return await pool.query(query, [...Object.values(datas)]);
    }
    // 'datas' est un objet dans le cas on joint plusieurs tables :
    static async findByDatasNTables(query, datas){
        return await pool.query({sql: query, nestTables: true}, [...Object.values(datas)]);
    }

    // 'datas' est un array
    static async findByArrayDatas(query, datas){
        return await pool.query(query, datas);
    }
    // 'datas' est un array dans le cas on joint plusieurs tables :
    static async findByArrayDatasNTables(query, datas){
        return await pool.query({sql: query, nestTables: true}, datas);
    }

    // ----------------- WRITE ------------------------
    static async write(query, data) {
        //console.log([...Object.values(data)]);
        return await pool.query(query, [...Object.values(data)]);
    }

    // 'datas' est un array
    static async writeWithArray(query, data) {
        //console.log(...data);
        return await pool.query(query, data);
    }

    // Insérer plusieurs lignes dans un tableau dépendant en rajoutant un id en tant que dernier élément de chaque ligne. 
    // 'data' est un tableau de tableaux.
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

    // ------------------- UPDATE -----------------------
    // mettre à jour avec un objet :
    static async update(query, data) {
        return await pool.query(query, [...Object.values(data)]);
    }

    // mettre à jour avec un tableau (array) :
    static async updateByArray(query, data) {
        return await pool.query(query, data);
    }

    // ----------------- SUPPRIMER ----------------------
    // supprimer par une seule valeur :
    static async delete(query, value){
        return await pool.query(query, [value]);
    }

}

export default Query;