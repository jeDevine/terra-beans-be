import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import terraBeansRouter from "./routes/terraBeansRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/home", terraBeansRouter);
export const api = functions.https.onRequest(app);
