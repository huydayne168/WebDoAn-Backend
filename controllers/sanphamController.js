const Product = require("../model/sanpham");
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");
const path = require("path");

const validatePricePair = (productData) => {
    const salePrice = Number(productData.gia);
    const originalPrice = Number(productData.gia_goc);

    if (Number.isNaN(salePrice) || Number.isNaN(originalPrice)) {
        return "Giá bán và giá gốc phải là số hợp lệ.";
    }

    if (originalPrice <= salePrice) {
        return "Giá gốc phải lớn hơn giá bán.";
    }

    return null;
};

exports.getAllProducts = (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize || 10;

    Product.getAll({ page, pageSize }, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        console.log(result);
        res.send(page ? result[0] : result);
    });
};

exports.getProductById = (req, res) => {
    const { ma_san_pham } = req.params;
    Product.getById(ma_san_pham, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.send(result);
    });
};

exports.getProductByIdDM = (req, res) => {
    const { ma_danh_muc } = req.params;
    Product.getByIdDM(ma_danh_muc, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        const priceError = validatePricePair(productData);
        if (priceError) {
            return res.status(400).send(priceError);
        }

        // If files are uploaded via multer, upload them to Cloudinary
        if (req.files) {
            if (req.files.anh_sanpham && req.files.anh_sanpham[0]) {
                const filePath = req.files.anh_sanpham[0].path;
                const uploadRes = await cloudinary.uploader.upload(filePath, {
                    folder: "products",
                });
                productData.anh_sanpham = uploadRes.secure_url;
                // remove temp file
                try {
                    fs.unlinkSync(filePath);
                } catch (e) {
                    /* ignore */
                }
            }
            if (req.files.anhhover1 && req.files.anhhover1[0]) {
                const filePath = req.files.anhhover1[0].path;
                const uploadRes = await cloudinary.uploader.upload(filePath, {
                    folder: "products",
                });
                productData.anhhover1 = uploadRes.secure_url;
                try {
                    fs.unlinkSync(filePath);
                } catch (e) {
                    /* ignore */
                }
            }
        }

        Product.create(productData, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.send("Product added successfully");
        });
    } catch (err) {
        console.error("Error uploading image or creating product:", err);
        res.status(500).send(err.message || err);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { ma_san_pham } = req.params;
        const productData = { ...req.body };
        const priceError = validatePricePair(productData);
        if (priceError) {
            return res.status(400).send(priceError);
        }

        if (req.files) {
            if (req.files.anh_sanpham && req.files.anh_sanpham[0]) {
                const filePath = req.files.anh_sanpham[0].path;
                const uploadRes = await cloudinary.uploader.upload(filePath, {
                    folder: "products",
                });
                productData.anh_sanpham = uploadRes.secure_url;
                try {
                    fs.unlinkSync(filePath);
                } catch (e) {
                    /* ignore */
                }
            }
            if (req.files.anhhover1 && req.files.anhhover1[0]) {
                const filePath = req.files.anhhover1[0].path;
                const uploadRes = await cloudinary.uploader.upload(filePath, {
                    folder: "products",
                });
                productData.anhhover1 = uploadRes.secure_url;
                try {
                    fs.unlinkSync(filePath);
                } catch (e) {
                    /* ignore */
                }
            }
        }

        Product.update(ma_san_pham, productData, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.send("Product updated successfully");
        });
    } catch (err) {
        console.error("Error uploading image or updating product:", err);
        res.status(500).send(err.message || err);
    }
};

exports.deleteProduct = (req, res) => {
    const { ma_san_pham } = req.params;
    Product.delete(ma_san_pham, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Product deleted successfully");
    });
};

exports.searchProductByName = (req, res) => {
    const { searchTerm } = req.params;
    Product.searchByName(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.searchServiceByPriceAndName = (req, res) => {
    const { minPrice, maxPrice, id_danh_muc } = req.query;

    // Gọi hàm tìm kiếm và chắc chắn rằng callback là một hàm
    Product.searchByPriceAndName(
        minPrice,
        maxPrice,
        id_danh_muc,
        (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(result); // Trả kết quả nếu không có lỗi
        },
    );
};
