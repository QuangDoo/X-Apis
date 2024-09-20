// import { registerValidator } from '../validators/registerValidator' // Đường dẫn tới validator của bạn
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { USER_MESSAGES } from '~/constants/messages'
import { registerValidator } from '~/middlewares/users.middleware'
// import { USER_MESSAGES } from '../messages' // Đường dẫn tới các thông báo lỗi tùy chỉnh

// Mock Request và Response
const mockRequest = (body: any): Partial<Request> => ({ body })
const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnThis()
  res.json = jest.fn().mockReturnThis()
  return res
}

describe('Register Validator', () => {
  it('should fail validation for empty name', async () => {
    const req = mockRequest({
      name: '', // Tên rỗng
      email: 'valid@example.com',
      password: 'ValidPass123!',
      confirm_password: 'ValidPass123!',
      date_of_birth: '2024-09-04T09:18:23.364Z'
    })
    const res = mockResponse()

    // Chạy validator trực tiếp
    await registerValidator(req as Request, res as Response, jest.fn())

    // Lấy kết quả validation
    const errors = validationResult(req)

    // Kiểm tra lỗi trường 'name'
    expect(errors.isEmpty()).toBe(false) // Phải có lỗi
    const error = errors.mapped() // Trả về object chứa lỗi
    expect(error).toHaveProperty('name')
    expect(error.name.msg).toBe(USER_MESSAGES.USERNAME_NOT_EMPTY)
  })

  it('should fail validation for invalid email', async () => {
    const req = mockRequest({
      name: 'Quang Do',
      email: 'invalid-email', // Email không hợp lệ
      password: 'ValidPass123!',
      confirm_password: 'ValidPass123!',
      date_of_birth: '2024-09-04T09:18:23.364Z'
    })
    const res = mockResponse()

    // Chạy validator trực tiếp
    await registerValidator(req as Request, res as Response, jest.fn())

    // Lấy kết quả validation
    const errors = validationResult(req)

    // Kiểm tra lỗi trường 'email'
    expect(errors.isEmpty()).toBe(false) // Phải có lỗi
    const error = errors.mapped()
    expect(error).toHaveProperty('email')
    expect(error.email.msg).toBe(USER_MESSAGES.INVALID_EMAIL)
  })

  it('should fail validation for password mismatch', async () => {
    const req = mockRequest({
      name: 'Quang Do',
      email: 'valid@example.com',
      password: 'ValidPass123!',
      confirm_password: 'DifferentPass123!', // Mật khẩu xác nhận không khớp
      date_of_birth: '2024-09-04T09:18:23.364Z'
    })
    const res = mockResponse()

    // Chạy validator trực tiếp
    await registerValidator(req as Request, res as Response, jest.fn())

    // Lấy kết quả validation
    const errors = validationResult(req)

    // Kiểm tra lỗi trường 'confirm_password'
    expect(errors.isEmpty()).toBe(false) // Phải có lỗi
    const error = errors.mapped()
    expect(error).toHaveProperty('confirm_password')
    expect(error.confirm_password.msg).toBe(USER_MESSAGES.PASSWORD_NOT_MATCH)
  })

  it('should fail validation for invalid date_of_birth', async () => {
    const req = mockRequest({
      name: 'Quang Do',
      email: 'valid@example.com',
      password: 'ValidPass123!',
      confirm_password: 'ValidPass123!',
      date_of_birth: 'invalid-date' // Ngày sinh không hợp lệ
    })
    const res = mockResponse()

    // Chạy validator trực tiếp
    await registerValidator(req as Request, res as Response, jest.fn())

    // Lấy kết quả validation
    const errors = validationResult(req)

    // Kiểm tra lỗi trường 'date_of_birth'
    expect(errors.isEmpty()).toBe(false) // Phải có lỗi
    const error = errors.mapped()
    expect(error).toHaveProperty('date_of_birth')
    expect(error.date_of_birth.msg).toBe(USER_MESSAGES.INVALID_DATE_OF_BIRTH)
  })
})
