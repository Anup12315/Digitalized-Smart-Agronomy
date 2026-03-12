const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const router = express.Router();

// Set up multer storage to save the image in a 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  }
});

const upload = multer({ storage: storage });

// API to add a new product with image
router.post('/addNewProduct', upload.single('image'), async (req, res) => {
  try {
    const { productName, productDetails } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Get image URL

    if (!productName || !productDetails) {
      return res.status(400).json({ error: 'Product name and details are required' });
    }

    const newProduct = new Product({ productName, productDetails, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// API to get all products
router.get('/getNewProduct', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// API to delete a product by ID
router.delete('/DeleteProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the product
    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully', id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
