const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path : path.resolve(__dirname, "../.env")}   );

app.use(express.json());

const port = process.env.PORT;


app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})

export {}