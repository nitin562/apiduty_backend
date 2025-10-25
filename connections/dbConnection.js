import mongoose from "mongoose";
import { DbConfig } from "../config.js";

class MongoConnection {
  constructor() {
    this.retries = 3;
    this.url = DbConfig.dbUrl;
  }

  async connect() {
    let last_err = null

    for (let _ = 0; _ < this.retries; _++) {
      try {
        await mongoose.connect(this.url);
        return "Connection Established"
      } catch (err) {
        console.log("Error on Connection -", err)
        last_err = err
        continue
      }
    }
    throw last_err
  }
}

export function initDbConnection(){
    const db = new MongoConnection()
    db.connect().then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(`[Error]: ${err.name}: ${err.message}`)
    })
}
