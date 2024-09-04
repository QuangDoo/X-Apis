import { Collection, Db, MongoClient } from 'mongodb'
import { User } from '~/models/schemas/User.schema'

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const DB_USER_COLLECTION = process.env.DB_USER_COLLECTION

const uri = `mongodb+srv://doquang039:03031993Thu1@x-apis.zzybz.mongodb.net/?retryWrites=true&w=majority&appName=X-APIs`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db('X-dev')
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }

  get users(): Collection<User> {
    return this.db.collection('users')
  }
}

const databaseService = new DatabaseService()
export default databaseService
