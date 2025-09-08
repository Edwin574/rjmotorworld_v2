import express from "express";
import dotenv from "dotenv";
import serverless from "serverless-http";
import { registerRoutes } from "../server/routes";
import { connectToDatabase } from "../server/db";

let cachedHandler: any;

async function createHandler() {
  dotenv.config();

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  await connectToDatabase();

  await registerRoutes(app);

  return serverless(app);
}

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    cachedHandler = await createHandler();
  }
  return cachedHandler(req, res);
}


