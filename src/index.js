import cors from "cors";
import dotenv from "dotenv";
import express from 'express'; // -> ES Module
import {handleUserSignUp} from "./controllers/user.controller.js";

dotenv.config();

const app = express()
const port = process.env.PORT;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post("/users",handleUserSignUp);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})