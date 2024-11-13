const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    const { category_id, vendor_id, name, description, price, weight, stock_status, rating } = req.body;
    try {
        const prod = await prisma.products.create({
            data: {
                category_id,
                vendor_id,
                name,
                description,
                price,
                weight,
                stock_status,
                rating
            }
        });
        res.status(200).json(prod);
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to create product',
            error: err.message
        });
    }
};

const updateProduct = async (req, res) => {
    const { category_id, vendor_id, name, description, price, weight, stock_status, rating } = req.body;
    const { id } = req.params;

    const data = {};
    if (category_id) data.category_id = category_id;
    if (vendor_id) data.vendor_id = vendor_id;
    if (name) data.name = name;
    if (description) data.description = description;
    if (price) data.price = price;
    if (weight) data.weight = weight;
    if (stock_status) data.stock_status = stock_status;
    if (rating) data.rating = rating;

    try {
        const prod = await prisma.products.update({
            where: { product_id: Number(id) },
            data
        });
        res.status(200).json({
            status: 'ok',
            message: `Product with ID = ${id} is updated`,
            product: prod
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Product with ID = ${id} not found.`
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred.',
                error: err.message
            });
        }
    }
};

// Delete
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const existingProduct = await prisma.products.findUnique({
            where: { product_id: Number(id) }
        });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await prisma.products.delete({
            where: { product_id: Number(id) }
        });

        res.status(200).json({
            status: "ok",
            message: `Product with ID = ${id} is deleted`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// get all
const getProducts = async (req, res) => {
    try {
        const products = await prisma.products.findMany({
            include: {
                vendors: { // ดึงข้อมูล vendor ที่เชื่อมโยงกับ product
                    select: {
                        name: true,
                        location: true
                    }
                },
                product_images: { // ดึงรายการรูปภาพของสินค้า
                    select: {
                        image_url: true
                    }
                },
                categories: { // ดึงข้อมูล category ที่เชื่อมโยงกับ product
                    select: {
                        name: true
                    }
                }
            }
        });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// get only one by id
const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.products.findUnique({
            where: { product_id: Number(id) },
            include: {
                vendors: { // ดึงข้อมูล vendor ที่เชื่อมโยงกับ product
                    select: {
                        name: true,
                        location: true
                    }
                },
                product_images: { // ดึงรายการรูปภาพของสินค้า
                    select: {
                        image_url: true
                    }
                },
                categories: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found!' });
        }

        // โครงสร้างข้อมูลที่ต้องการส่งกลับ
        const responseData = {
            name: product.name,
            vendorName: product.vendors?.name || '',
            vendorLocation: product.vendors?.location || '',
            mainImage: product.product_images[0]?.image_url || '', // รูปภาพหลักของสินค้า
            images: product.product_images, // รายการรูปภาพทั้งหมด
            weight: product.weight,
            price: product.price,
            stockStatus: product.stock_status,
            description: product.description,
            categories: product.categories
        };

        res.status(200).json(responseData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// search any by name
const getProductsByTerm = async (req, res) => {
    const searchString = req.params.term;
    try {
        const products = await prisma.products.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchString,
                            mode: 'insensitive' // ค้นหาโดยไม่คำนึงถึงตัวพิมพ์ใหญ่/เล็ก
                        }
                    },
                    {
                        description: {
                            contains: searchString,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found!' });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createProduct, getProduct, getProducts,
    updateProduct, deleteProduct, getProductsByTerm
};


