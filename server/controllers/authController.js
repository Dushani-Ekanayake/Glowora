import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role }
}

export async function register(req, res) {
  const { name, email, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashed })

  res.status(201).json({ success: true, data: { token: signToken(user), user: publicUser(user) } })
}

export async function login(req, res) {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  const valid = user && (await bcrypt.compare(password, user.password))
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Incorrect email or password' })
  }

  res.json({ success: true, data: { token: signToken(user), user: publicUser(user) } })
}

export function getMe(req, res) {
  res.json({ success: true, data: { user: publicUser(req.user) } })
}