
import Product from "../models/Product.js";
import { isAdmin } from "./userController.js";

//create a new product 

export async function createProduct(req, res) {
 try {
    if(!isAdmin(req)){
        res.status(403).json({
            message : "Forbidden Access.!",
        });
        
    }

    const product = new Product(req.body);
    await product.save();

    res.json({message:"Product created successfully.!"})

   } catch (error) {

            res.status(500).json({
                message : "Error creating product.!",
                error : error.message
            });
        }
 }

 //get all products

export function getAllProducts(req, res) {
    try {
        if (isAdmin(req)) {
            Product.find()
                .then((products) => {
                    res.json(products);
                })
                .catch((error) => {
                    res.status(500).json({
                        message: "Error retrieving products.!",
                        error: error.message
                    });
                });
        } else {
            Product.find({ isAvailable: true })
                .then((products) => {
                    res.json(products);
                })
                .catch((error) => {
                    res.status(500).json({
                        message: "Error retrieving products.!",
                        error: error.message
                    });
                });
        }
    } catch (error) {
        res.status(500).json({
            message: "Unexpected error occurred while retrieving products.!",
            error: error.message
        });
    }
}


// Delete product
export function deleteProduct(req, res) {
    try {
        if (!isAdmin(req)) {
            res.status(403).json({
                message: "Only admins can delete products.!"
            });
            return;
        }

        const productId = req.params.productID;

        Product.deleteOne({ productID: productId })
            .then((result) => {
                if (result.deletedCount === 0) {
                    res.status(404).json({
                        message: "Product not found.!"
                    });
                } else {
                    res.json({
                        message: "Product deleted successfully.!"
                    });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error deleting product.!",
                    error: error.message
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Unexpected error occurred while deleting product.!",
            error: error.message
        });
    }
}

// Update product
export function updateProduct(req, res) {
    try {
        if (!isAdmin(req)) {
            res.status(403).json({
                message: "Only admins can update products.!"
            });
            return;
        }

        const productID = req.params.productID;

        Product.updateOne({ productID: productID }, req.body)
            .then((result) => {
                if (result.matchedCount === 0) {
                    res.status(404).json({
                        message: "Product not found.!"
                    });
                } else {
                    res.json({
                        message: "Product updated successfully.!"
                    });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error updating product.!",
                    error: error.message
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Unexpected error occurred while updating product.!",
            error: error.message
        });
    }
}

// Get product by ID
export function getProductById(req, res) {
    try {
        const productID = req.params.productID;

        Product.findOne({ productID: productID })
            .then((product) => {
                if (product == null) {
                    res.status(404).json({
                        message: "Product not found.!"
                    });
                } else {
                    if (product.isAvailable) {
                        res.json(product);
                    } else {
                        if (isAdmin(req)) {
                            res.json(product);
                        } else {
                            res.status(403).json({
                                message: "Product not available.!"
                            });
                        }
                    }
                }
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error retrieving product.!",
                    error: error.message
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "Unexpected error occurred while retrieving product.!",
            error: error.message
        });
    }
}    