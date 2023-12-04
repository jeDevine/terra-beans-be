import express from "express";
import { getClient } from "../db";
import Account from "../models/account";

const terraBeansRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};
terraBeansRouter.get("/", async (req, res) => {
  try {
    const client = await getClient();
    const cursor = client.db().collection<Account>("tbaccounts").find();
    const results = await cursor.toArray();
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});
terraBeansRouter.get("/year", async (req, res) => {
  let year = req.query.year as string;
  try {
    const client = await getClient();
    const cursor = client
      .db()
      .collection<Account>("tbaccounts")
      .find({ "uploadedPhotos.date": new RegExp(year, "i") });
    const results = await cursor.toArray();
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});
terraBeansRouter.get("/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const client = await getClient();
    const cursor = client
      .db()
      .collection<Account>("tbaccounts")
      .findOne({ uid });
    const results = await cursor;
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

terraBeansRouter.post("/", async (req, res) => {
  try {
    const client = await getClient();
    const newItem = req.body;
    client.db().collection<Account>("tbaccounts").insertOne(newItem);
    res.status(200);
    res.json(newItem);
  } catch (error) {
    errorResponse(error, res);
  }
});

terraBeansRouter.put("/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const replacement = req.body;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("tbaccounts")
      .replaceOne({ uid: uid }, replacement);
    if (result.modifiedCount) {
      res.status(200);
      res.json(replacement);
    } else {
      res.status(404);
      res.send("ID not found");
    }
  } catch (error) {
    errorResponse(error, res);
  }
});

// terraBeansRouter.delete('/', async (req, res) => {
//   try {
// const client = await getClient();
// const result = await client.db().collection<Account>('tbaccounts').deleteOne();
// if (result.deletedCount) {
//   res.sendStatus(204);
// } else {
//   res.status(404);
//   res.send('No ID found');
// }
//   } catch (error) {
//     errorResponse(error, res);
//   }
// });

export default terraBeansRouter;
