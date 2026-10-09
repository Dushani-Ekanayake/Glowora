import Product from '../models/Product.js'
import Category from '../models/Category.js'

const SORTS = { newest: '-createdAt', 'price-asc': 'price', 'price-desc': '-price' }

export async function getProducts(req, res) {
  const { search, category, minPrice, maxPrice, sort } = req.query
  const filter = { isActive: true }

  if (search) {
    const escaped = String(search).trim().slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    filter.name = { $regex: escaped, $options: 'i' }
  }

  if (category) {
    const found = await Category.findOne({ slug: String(category) })
    if (!found) return res.json({ success: true, data: [] })
    filter.category = found._id
  }

  const price = {}
  if (minPrice && !Number.isNaN(Number(minPrice))) price.$gte = Number(minPrice)
  if (maxPrice && !Number.isNaN(Number(maxPrice))) price.$lte = Number(maxPrice)
  if (Object.keys(price).length) filter.price = price

  const sortBy = Object.hasOwn(SORTS, sort) ? SORTS[sort] : SORTS.newest

  const products = await Product.find(filter).populate('category', 'name slug').sort(sortBy)
  res.json({ success: true, data: products })
}

export async function getProduct(req, res) {
  const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate(
    'category',
    'name slug'
  )
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  res.json({ success: true, data: product })
}
