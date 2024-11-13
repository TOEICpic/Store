const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Create a new user
const createUser = async (req, res) => {
    const { first_name, last_name, email, phone, role = 'buyer', password, login_method } = req.body;

    // ตรวจสอบความถูกต้องของข้อมูลก่อน
    if (!first_name || !last_name || !password || !login_method) {
        return res.status(400).json({
            status: "error",
            message: "Please provide all required fields."
        });
    }
  
    try {
        // Hash the password before storing
        const password_hash = await bcrypt.hash(password, 10);

        // Insert new user data
        const user = await prisma.users.create({
            data: {
                first_name,
                last_name,
                email,
                phone,
                role,
                password_hash,
                login_method
            }
        });

        res.status(201).json({
            status: "ok",
            message: `User with ID = ${user.user_id} created successfully.`,
            user: user
        });
    } catch (err) {
        if (err.code === 'P2002') {  // Unique constraint violation
            const field = err.meta.target.includes('email') ? 'Email' : 'Phone';
            res.status(400).json({ status: "error", message: `${field} already exists.` });
        } else {
            res.status(500).json({ status: "error", message: "Failed to create user", error: err.message });
        }
    }
};

const updateUser = async (req, res) => {
    const { first_name, last_name, email, phone, role, login_method } = req.body;
    const { id } = req.params;

    const data = {};
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (email) data.email = email;
    if (phone) data.phone = phone;
    if (role) data.role = role;
    if (login_method) data.login_method = login_method;

    try {
        const user = await prisma.users.update({
            where: { user_id: Number(id) },
            data
        });

        res.status(200).json({
            status: "ok",
            message: `User with ID = ${id} updated successfully.`,
            user: user
        });
    } catch (err) {
        if (err.code === 'P2002') {
            res.status(400).json({ status: "error", message: "Email or phone already exists." });
        } else if (err.code === 'P2025') {
            res.status(404).json({ status: "error", message: `User with ID = ${id} not found.` });
        } else {
            res.status(500).json({ status: "error", message: "An unexpected error occurred." });
        }
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.users.delete({
            where: { user_id: Number(id) }
        });

        res.status(200).json({
            status: "ok",
            message: `User with ID = ${id} deleted successfully.`
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({ status: "error", message: `User with ID = ${id} not found.` });
        } else {
            res.status(500).json({ status: "error", message: "An unexpected error occurred." });
        }
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.users.findUnique({
            where: { user_id: Number(id) }
        });

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById
};
