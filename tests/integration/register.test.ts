import request from 'supertest'
// import { app } from '../src/index' // Đường dẫn tới ứng dụng Express.js của bạn
import { MongoClient } from 'mongodb' // Nếu sử dụng MongoDB
import { MongoMemoryServer } from 'mongodb-memory-server' // Nếu dùng MongoDB in-memory cho test
import { HTTP_STATUS_CODE } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { app } from '~/index'
import { User } from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'

let mongoServer: MongoMemoryServer
let client: MongoClient
let db: any

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  client = new MongoClient(uri)
  await client.connect()
  db = client.db('testdb') // Sử dụng database tạm thời cho test
})

afterAll(async () => {
  await client.close()
  await mongoServer.stop()
})

afterEach(async () => {
  await db.collection('users').deleteMany({})
})

describe('Integration Test for Register API', () => {
  it('should register successfully with valid data', async () => {
    // Kiểm tra không có người dùng trước khi test
    const userCountBefore = await db.collection('users').countDocuments()
    expect(userCountBefore).toBe(0) // Đảm bảo không có người dùng nào

    const email = `quangdo${new Date().valueOf()}@gmail.com`

    const payload = {
      name: 'Quang Do',
      email,
      password: 'ValidPass123!',
      confirm_password: 'ValidPass123!',
      date_of_birth: '2000-01-01'
    }

    const res = await request(app)
      .post('/users/register') // Endpoint cần test
      .send(payload)

    // Kiểm tra mã trạng thái HTTP
    expect(res.statusCode).toBe(HTTP_STATUS_CODE.CREATED)

    // Kiểm tra phản hồi trả về
    expect(res.body).toHaveProperty('message', USER_MESSAGES.REGISTER_SUCCESS)

    const result = await db.collection('users').insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    expect(result).toBeTruthy()

    // Kiểm tra dữ liệu người dùng đã được lưu vào database
    const user = await db.collection('users').findOne({ email })
    expect(user).toBeTruthy()
    expect(user.email).toBe(email)
  })

  it('should return error when user already exists', async () => {
    // Đầu tiên đăng ký một người dùng
    await db.collection('users').insertOne({
      name: 'Quang Do',
      email: 'quangdo@example.com',
      password: 'ValidPass123!',
      date_of_birth: '2000-01-01'
    })

    // Thử đăng ký lại với cùng email
    const res = await request(app).post('/users/register').send({
      name: 'Quang Do',
      email: 'quangdo@example.com', // Email đã tồn tại
      password: 'ValidPass123!',
      confirm_password: 'ValidPass123!',
      date_of_birth: '2000-01-01'
    })

    // Kiểm tra mã trạng thái HTTP
    expect(res.statusCode).toBe(HTTP_STATUS_CODE.CONFLICT) // 409 Conflict khi người dùng đã tồn tại

    // Kiểm tra phản hồi trả về
    expect(res.body).toHaveProperty('message', USER_MESSAGES.USER_EXISTS)
  })
})
