import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      address: { type: String, required: true, trim: true },
    },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['payhere', 'whatsapp'], required: true },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Processing', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)