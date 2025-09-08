declare module "serverless-http" {
  import type { Application, RequestHandler } from "express";
  type Handler = (app: Application) => RequestHandler | any;
  const serverless: Handler;
  export default serverless;
}


