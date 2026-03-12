const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product'); // Assuming your schema is in models/product.js
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Define file naming convention
  },
});
const upload = multer({ storage });

// Route to get all products
router.get('/getNewProduct', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve products' });
  }
});

// Route to add a product
router.post('/addNewproduct', upload.single('productImage'), async (req, res) => {
  try {
    const { productName, productDescription, amount, category } = req.body;

    const newProduct = new Product({
      productName,
      productDescription,
      amount,
      category,
      productImage: {
        filename: req.file.filename,
        location: path.join('uploads', req.file.filename),
      },
    });

    await newProduct.save();
    res.status(200).json({ success: true, message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add product' });
  }
});

// Route to delete a product
router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

// Route to edit a product
router.put('/editProduct/:id', upload.single('productImage'), async (req, res) => {
  try {
    const productId = req.params.id;
    const { productName, productDescription, amount, category } = req.body;

    const updatedData = {
      productName,
      productDescription,
      amount,
      category,
    };

    if (req.file) {
      updatedData.productImage = {
        filename: req.file.filename,
        location: path.join('uploads', req.file.filename),
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

module.exports = router;
