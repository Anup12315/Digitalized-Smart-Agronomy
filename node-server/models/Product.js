const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  productImage: {
    filename: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
  },
  category: {
    type: String,
    ref: 'Category',
  },
});

// Prevent model overwrite if already defined
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
