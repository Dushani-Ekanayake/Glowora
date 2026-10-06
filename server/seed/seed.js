import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import Order from '../models/Order.js'

const categories = [
  { name: 'Cleansers', slug: 'cleansers' },
  { name: 'Moisturizers', slug: 'moisturizers' },
  { name: 'Serums', slug: 'serums' },
  { name: 'Body Care', slug: 'body-care' },
  { name: 'Haircare', slug: 'haircare' },
]

// Each product uses a categorySlug; we convert it to a real category ID below.
const products = [
  { name: 'VelvetSkin Gentle Cleanser', categorySlug: 'cleansers', price: 2800, stock: 40,
    description: 'A soft foaming cleanser for daily use. Removes dirt and excess oil without leaving skin tight.' },
  // TODO: you write the other 11 (see below)
]

async function seed() {
  await connectDB()

  await Promise.all([Order.deleteMany(), Product.deleteMany(), Category.deleteMany(), User.deleteMany()])

  const createdCategories = await Category.insertMany(categories)
  const idBySlug = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]))

  await Product.insertMany(
    products.map(({ categorySlug, ...rest }) => ({
      ...rest,
      category: idBySlug[categorySlug],
      imageUrl: 'https://placehold.co/600x600/F3EDE4/2B2B2B?text=Glowora',
    }))
  )

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
  await User.create({
    name: 'Glowora Admin',
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    role: 'admin',
  })

  console.log('Seed complete')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})