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

const products = [
{ name: 'VelvetSkin Gentle Cleanser', categorySlug: 'cleansers', price: 2800, stock: 40,
    description: 'A soft foaming cleanser for daily use. Removes dirt and excess oil without leaving skin tight.' },

{ name: 'HydraBoost Moisturizer', categorySlug: 'moisturizers', price: 3500, stock: 30,
    description: 'A lightweight, fast-absorbing moisturizer that hydrates and protects the skin.' },

{ name: 'Lumina Serum', categorySlug: 'serums', price: 4500, stock: 20,
    description: 'A potent serum that brightens and evens out the skin tone.' },

{ name: 'PureGlow Daily Cleanser', categorySlug: 'cleansers', price: 2600, stock: 35,
    description: 'A gentle daily cleanser that removes impurities while keeping the skin feeling fresh and balanced.' },

{ name: 'DewDrop Hydrating Cream', categorySlug: 'moisturizers', price: 3900, stock: 25,
    description: 'A nourishing daily cream designed to provide long-lasting hydration without feeling heavy.' },

{ name: 'ClearBalance Niacinamide Serum', categorySlug: 'serums', price: 4200, stock: 22,
    description: 'A lightweight serum formulated to support clearer-looking skin and a more balanced complexion.' },

{ name: 'SilkTouch Body Lotion', categorySlug: 'body-care', price: 3200, stock: 28,
    description: 'A smooth, fast-absorbing body lotion that leaves skin soft, hydrated and comfortable throughout the day.' },

{ name: 'CoconutCare Body Wash', categorySlug: 'body-care', price: 2900, stock: 32,
    description: 'A refreshing body wash with a creamy lather that gently cleanses without drying the skin.' },

{ name: 'SoftRoot Nourishing Shampoo', categorySlug: 'haircare', price: 3400, stock: 24,
    description: 'A gentle shampoo that cleanses the scalp and helps leave hair feeling soft, clean and manageable.' },

{ name: 'SilkRepair Hair Mask', categorySlug: 'haircare', price: 4100, stock: 3,
    description: 'A rich conditioning hair mask designed to restore moisture and improve the feel of dry, damaged hair.' },

{ name: 'RadiantSkin Vitamin C Serum', categorySlug: 'serums', price: 4800, stock: 0,
    description: 'A lightweight brightening serum designed to give the complexion a fresh and radiant appearance.' },

{ name: 'VelvetNight Renewal Cream', categorySlug: 'moisturizers', price: 4400, stock: 15,
    description: 'A rich overnight moisturizer designed to replenish moisture and leave skin feeling soft and refreshed by morning.' },
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