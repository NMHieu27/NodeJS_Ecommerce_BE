const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { Error } = require("mongoose");

// Create a new product
const createProduct = asyncHandler( async (req, res) => {
  try{
    const product = await Product.create(req.body)
    res.json({product})
  }
  catch (err){
    throw new Error('Error creating product:', err);
  }
});
// Get all products
const getAllProducts = asyncHandler( async (req, res) => {
  try{
    const products = await Product.find();
    res.json(products)
  }
  catch (err){
    throw new Error('Error getting all products:', err);
  }
});
// Get a product by slug
const getProductBySlug = asyncHandler( async (req, res) =>{
  try{
    const product = await Product.findOne({slug:req.params.slug});
    if(product){
      res.json(product);
    }
    else throw new Error('Slug invalid');
  }
  catch(err){
    throw new Error('Error getting product by slug:', err);
  }
});

// Get a product by slug
const getProductById = asyncHandler( async (req, res) =>{
  try{
    const {id} = req.params;
    validateMongoDbId(id);
    const product = await Product.findById(id);
    if(product){
      res.json(product);
    }
    else throw new Error('Product not found');
  }
  catch(err){
    throw new Error(err);
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductBySlug,
  getProductById,
};
