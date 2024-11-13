const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createUser = async (req, res) => {
    const { UserName, Password, Role, Email } = req.body;

    // Check if all required fields are provided
    if (!UserName || !Password || !Role || !Email) {
        return res.status(400).json({ message: "All fields are required: userId, username, password, role, and email." });
    }

    try {
        // Hash the password with salt rounds
        const hashResult = await bcrypt.hash(Password, 10); // 10 is the salt rounds
  
        // Store the user data
        const userData = {
            UserName: UserName,
            Role: Role,
            Status: "Active",
            Password: hashResult,
            Email: Email
        };
  
        const user = await prisma.users.create({
            data: userData
        });
        res.status(200).json({ message: 'ok' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "insert user data fail!",
            error,
        });
    } 
}

module.exports = { createUser };
