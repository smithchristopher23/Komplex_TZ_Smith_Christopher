const express = require("express");
const mysql = require("mysql")
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const { error } = require("console");
app.use(cors());
app.use(bodyparser.json());

const db = mysql.createConnection(
    {
        user: "root",
        host: "localhost",
        port: 3307,
        password: "",
        database: "felveteli"
    }

)
app.get("/", (req, res) => {
    res.send("Szerver működik!")
}
)

app.get("/rangsor", (req, res) => {
    const sql = `
        SELECT 
            d.nev AS 'Tanulo neve',
            t.agazat AS 'Agazat',
            (d.hozott * 2 + d.kpmagy + d.kpmat) AS 'Osszes pontszam'
        FROM 
            diakok d
            INNER JOIN jelentkezesek j ON d.oktazon = j.diak
            INNER JOIN tagozatok t ON j.tag = t.akod
        WHERE 
            j.hely = 1
        ORDER BY 
            t.agazat ASC,
            (d.hozott * 2 + d.kpmagy + d.kpmat) DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});
app.listen(3000, () => {
    console.log("A server a 3000 porton fut!")
})