import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import tokensRoute from './routes/tokens'; 

const app = express();

dotenv.config({path : path.resolve(__dirname, "../.env")}   );

app.use(express.json());

app.use('/api', tokensRoute);


const port = process.env.PORT;

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})
