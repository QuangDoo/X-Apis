import { Collection, Db, MongoClient } from 'mongodb'
import { User } from '~/models/schemas/User.schema'
import dotenv from 'dotenv'
dotenv.config()

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const DB_USER_COLLECTION = process.env.DB_USER_COLLECTION

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@x-apis.zzybz.mongodb.net/?retryWrites=true&w=majority&appName=X-APIs`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error(error)
    } finally {
      // Ensures that the client will close when you finish/error
      // await this.client.close()
    }
  }

  get users(): Collection<User> {
    return this.db.collection(DB_USER_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
