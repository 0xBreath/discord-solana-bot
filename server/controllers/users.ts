import {PublicKey} from '@solana/web3.js';
import { userInfo } from 'os';
import db from "../models";
const User = db.users;


// Create and Save a new User
export const create = (req: any, res: any) => {

  console.log('CREATE')
    // Validate request
    if (!req.params.wallet) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
    }
    
    // Create a User
    const user = {
        wallet: req.params.wallet,
        discord: req.body.discord,
        signed: 0
    };
    
      // Save User in the database
    User.create(user)
        .then((data: any) => {
          res.send(data);
        })
        .catch((err: any) => {
          res.status(500).send({
            message:
              err.message || "Error creating User."
          });
        });
};

export const update = async (req: any, res: any) => {

  // Validate request
  if (!req.params.wallet) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  // Create a User
  const wallet = req.params.wallet;
  console.log('WALLET = ', wallet)

  // return existing user
  const oldUser = await User.findOne({
    where: { wallet: wallet },
  });
  if (oldUser == null) {
    console.log('ERROR: oldUser not found in database')
    return;
  }

  // change user to signed=1 (verified)
  const user = {
    wallet: wallet,
    discord: oldUser.discord,
    signed: 1
  }
  
  // update User in database
  User.update(user, {
    where: { wallet: wallet }
  })
    .then((num: any) => {
      if (num == 1) {
        console.log(`Success: User (${wallet}) was updated.`)
        res.send({
          message: `Success: User (${wallet}) was updated.`
        });
        return true;
      } else {
        res.send({
          message: `Failed to update User with wallet = ${wallet}. User was not found or req.body is empty!`
        });
        return false;
      }
    })
    .catch((err: any) => {
      res.status(500).send({
        message: "Error updating User with wallet = " + wallet
      });
      return false;
    });
    return false;
};

export const findByWallet = async (req: any, res: any) => {

  const wallet = req.params.wallet;
  console.log('## WALLET = ', wallet)

  await User.findOne({
    where: { wallet: wallet },
  })
  .then((data: any) => {
    res.send(data);
  });
}


export const findByDiscord = async (req: any, res: any) => {

  console.log('DISCORD = ', req.params.discord)

  const discord = req.params.discord;

  try {
    let user = await User.findOne({
      where: { discord: discord },
    });

    if (user.dataValues != null) {
      console.log(`Success: User (${user.dataValues.wallet}) was updated.`)
      res.send(user.dataValues);
    } else {
      res.send({
        message: `Failed to update User with wallet = ${user.dataValues.wallet}. User not found!`
      });
    }
  } 
  catch(err: any) {
    res.status(500).send({
      message: "Error getting User with error, " + err
    });
  }
}

export default {create, update, findByWallet, findByDiscord};