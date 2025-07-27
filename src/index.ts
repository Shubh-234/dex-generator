import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from 'http';
import {initSocket} from './socketServer'
import tokensRoute from './routes/tokens';
import startScheduler from './startScheduler'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path : path.resolve(__dirname, "../.env")}   );

const server = http.createServer(express());
initSocket(server);
startScheduler();
const app = express();


app.use(express.json());

app.use('/api', tokensRoute);


const port = process.env.PORT;

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})
