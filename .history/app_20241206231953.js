import express from "express";
import db from "./config/Database.js";
import dotenv from "dotenv";


dotenv.config()

const app = express()
const port = 5000





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