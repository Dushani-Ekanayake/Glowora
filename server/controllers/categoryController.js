import Category from '../models/Category.js'

export async function getCategories(req, res) {
  const categories = await Category.find().sort('name')
  res.json({ success: true, data: categories })
}
// the route file only maps URL to function. The controller holds the logic. This is the whole “routes → controllers” structure
