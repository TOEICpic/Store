const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCategory = async (req, res) => {
    const { category_id, name, sort, category_update } = req.body;
    try {
        const cate = await prisma.categorys.create({
            data: {
                category_id,
                name,
                sort,
                category_update
            }
        });
        res.status(200).json(cate);
    } catch (err) {        
        res.status(500).json(err);
    }
};

const updateCategory = async (req, res) => {
    const { name, sort, category_update } = req.body;
    const { id } = req.params; // Get the Product ID from the URL parameter

    // Build the data object for the update
    const data = {};
    if (name) data.name = name;
    if (sort) data.sort = sort;
    if (category_update) data.category_update = category_update;

    // Check if there's any data to update
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ 
            status: 'error',
            message: 'No data provided for update.'
        });
    }

    try {
        const cate = await prisma.categorys.update({
            data,
            where: { category_id: Number(id) } // Use the ID from the URL
        });
        res.status(200).json({
            status: 'ok',
            message: `Product with ID = ${id} is updated`,
            product: cate
        });
    } catch (err) {
        // Handle known Prisma errors
        if (err.code === 'P2025') {
            // Record not found
            res.status(404).json({ 
                status: 'error',
                message: `Product with ID = ${id} not found.` 
            });
        } else {
            // Handle other unexpected errors
            console.error('Update Product error: ', err);
            res.status(500).json({ 
                status: 'error',
                message: 'An unexpected error occurred.' 
            });
        }
    }
};

// Delete

const deleteCategory = async (req, res) => {
    const id = req.params.id;
  
    try {
      // ตรวจสอบว่าลูกค้ามีอยู่หรือไม่
      const existingProduct = await prisma.categorys.findUnique({
        where: {
            category_id: Number(id),  // ตรวจสอบว่า product_id เป็นตัวเลข
        },
      });
  
      // ถ้าไม่พบลูกค้า
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // ลบลูกค้า
      await prisma.categorys.delete({
        where: {
            category_id: Number(id),
        },
      });
  
      // ส่งข้อความเมื่อทำการลบสำเร็จ
      res.status(200).json({
        status: "ok",
        message: `Product with ID = ${id} is deleted`  // แสดง ID ที่ถูกลบ
      });
    } catch (err) {
      console.error('Delete Product error: ', err);  // แสดงข้อผิดพลาดใน console
      res.status(500).json({ error: err.message });  // ส่งข้อความข้อผิดพลาดกลับไปที่ client
    }
  };

// get all
const getCategorys = async (req, res) => {
    const cate = await prisma.categorys.findMany(); // Use 'product' instead of 'products'
    res.json(cate);
};

// get only one by id
const getCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const cate = await prisma.categorys.findUnique({
            where: { category_id: Number(id) },
        });
        if (!cate) {
            res.status(404).json({ 'message': 'Product not found!' });
        } else {
            res.status(200).json(cate);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
// search any by name
const getCategorysByTerm = async (req, res) => {
    const searchString = req.params.term;
    try {
        const prod = await prisma.categorys.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchString
                        }
                    },
                    {
                        price: {
                            contains: searchString
                        }
                    }
                ]
            },
        });
        if (!prod || prod.length == 0) {
            res.status(404).json({ 'message': 'Product not found!' });
        } else {
            res.status(200).json(prod);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    createCategory, getCategory, getCategorys,
    updateCategory, deleteCategory, getCategorysByTerm
};


