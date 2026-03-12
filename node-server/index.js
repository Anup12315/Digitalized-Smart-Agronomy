const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const routes = require('./routes/userroutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const User = require('./models/User');
const newProduct = require('./models/newProduct');

// Connect to MongoDB
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://anupgoudar199:anup%40123@cluster0.g648j.mongodb.net/myDatabaseName?retryWrites=true&w=majority&appName=Cluster0');
  console.log('DB connected');
}

const server = express();

// Middleware
server.use(cors({ origin: '*' })); // Enable CORS for all origins
server.use(bodyParser.json());

// API to add a new product
server.post('/api/addNewProduct', async (req, res) => {
  try {
    const { productName, productDescription,amount} = req.body;

    // Create a new product without an image
    const products = new newProduct({ productName, productDescription,amount });
    await products.save();

    res.status(201).json(products);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// API to get all products
server.get('/api/getproduct', async (req, res) => {
  try {
    const newproducts = await newProduct.find();
    res.status(200).json(newproducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// API to get all users
server.get('/api/getNewUser', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// API to delete a product by ID
server.delete('/api/DeleteProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting product with ID:", id); 
    // Check if this logs when you click the delete button

    // Check if the product exists
    const product = await newProduct.findById(id);
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



// Other routes
server.use('/api', routes);
server.use('/admin/products', productRoutes);
server.use('/admin/categories', categoryRoutes);

// Start the server
server.listen(8080, () => {
  console.log('Server started on port localhost:8080');
});
