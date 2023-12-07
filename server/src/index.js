import express from "express";
import cors from "cors";
import router from "./router/index.routes.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || process.env.LOCAL_PORT;

// --------------------- Middleware : ---------------------- //
// use 'express.static' to serve images, CSS files, and JavaScript files in a directory named 'public'
app.use(express.static("public"));
app.use(express.static("../../client/build"));
// 'cors' pour faire des requêtes inter-origine
app.use(cors());
// 'express.urlencoded' parses incoming requests with URL-encoded payloads
// 'extended: true' precises that the req.body object will contain values of any type instead of just strings
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

app.get("*", (req, res) => {
    res.sendFile("../../client/build", "index.html");
});

app.listen(PORT);
//app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`));