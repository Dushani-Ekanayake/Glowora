import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Please log in to continue' })
  }

  let decoded
  try {
    decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' })
  }

  const user = await User.findById(decoded.id)
  if (!user) {
    return res.status(401).json({ success: false, message: 'Please log in to continue' })
  }

  req.user = user
  next()
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You do not have access to this' })
  }
  next()
}
