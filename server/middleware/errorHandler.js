export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' })
}

export function errorHandler(err, req, res, next) {
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID' })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message })
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'That value already exists' })
  }

  console.error(err)
  res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' })
}
