import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import connectDB from './config/db.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

const PORT = process.env.PORT || 5000
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)


connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
