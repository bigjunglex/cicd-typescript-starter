import { NextFunction, Request, Response } from "express";
import { respondWithError } from "./json.js";
import { getUser } from "../db/queries/users.js";
import { User } from "../db/schema.js";
import { getAPIKey } from "./auth.js";
import { AddressInfo } from "node:net";

export function middlewareAuth(
  handler: (req: Request, res: Response, user: User) => void,
) {
  return async (req: Request, res: Response) => {
    try {
      const apiKey = getAPIKey(req.headers);
      if (!apiKey) {
        respondWithError(res, 401, "Couldn't find api key");
        return;
      }

      const user = await getUser(apiKey);
      if (!user) {
        respondWithError(res, 404, "Couldn't get user");
        return;
      }

      handler(req, res, user);
    } catch (err) {
      respondWithError(res, 500, "Couldn't authenticate user", err);
    }
  };
}

export function consoleLogger(req: Request, res: Response, next: NextFunction) {
  const { address, port } = req.socket.address() as AddressInfo;
  const mtd = req.method;
  console.log(`TO:[${req.url}]\nMETHOD: ${mtd}\nFROM:${address}:${port}`);
  next();
}
