
import {PublicKey} from '@solana/web3.js'
import nacl from 'tweetnacl'
import {NextFunction, Request, Response} from "express"
import * as user from "../controllers/users"
import {Express} from 'express'
import * as express from 'express'
import app from '../server'

// verify trx signature on backend before updating User
const verifyOwnerShip = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (!req) {
    return;
  } else {

    const pubkey = new PublicKey(req.params.wallet);
    const signature = req.body.signature;
    const signedMsg = req.body.message;
  
    const encoder = new TextEncoder()
    const parsedMessage = encoder.encode(signedMsg)
    //let parsedSignature = Uint8Array.from(JSON.parse(signature));
    const parsedSignature = Uint8Array.from(signature.signature.data);
  
    const verify = nacl.sign.detached.verify(parsedMessage, parsedSignature, pubkey.toBytes())
  
    console.log('verify = ', verify)
    if (!verify) {
        res.status(400);
        res.send("Invalid signed message!")
        return;
    }
  
    // continue to users.update
    next();
  }
}

export const UserRoutes = (app: Express) => {
  //const users = require("../controllers/users.js");
  const router = express.Router();

  // Create a new User (unverified)
  router.post("/:wallet", user.create);

  // Retrieve single User
  router.get("/:wallet", user.findByWallet);

  router.get("/discord/:discord", user.findByDiscord);

  // Update existing User (verify)
  router.put("/:wallet", verifyOwnerShip, user.update);

  // redirect all /users routes to this file
  app.use('/users', router);
}

export default UserRoutes;