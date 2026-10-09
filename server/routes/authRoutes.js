import { Router } from 'express'
import { z } from 'zod'
import { register, login, getMe } from '../controllers/authController.js'
import { validate } from '../middleware/validate.js'
import { protect } from '../middleware/auth.js'

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(60, 'Name is too long'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password is too long'),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email'),
  password: z.string().min(1, 'Please enter your password'),
})

const router = Router()
router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', protect, getMe)

export default router
