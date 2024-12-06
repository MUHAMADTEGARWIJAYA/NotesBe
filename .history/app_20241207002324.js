import express from "express";
import db from "./config/Database.js";
import dotenv from "dotenv";
// import noteRouter from './routes/noteRouter.js';
import noteRouter from "./router/noteRouter.js"
import bodyParser from "body-parser";
dotenv.config()

const app = express()
const port = 5000



app.use(bodyParser.json()); // Parsing JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parsing URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    next();
});
app.use(cookieParser());

app.use('/api', noteRouter );

try {
  await db.authenticate();
  console.log('Database terhubung....');
} catch (error) {
  console.error(error);
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`aplikasi ini jalan di port ${port}`)
})