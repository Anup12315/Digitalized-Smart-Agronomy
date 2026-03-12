const mongoose = require('mongoose');

const newProductSchema = new mongoose.Schema({
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
  
});

// Prevent model overwrite if already defined
const newProduct = mongoose.models.newProduct || mongoose.model('newProduct', newProductSchema);

module.exports = newProduct;
