const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = "NoIdeaNow";
const TOKEN_EXPIRATION = 60 * 60 * 1000; // 1 hour

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const session = await prisma.sessions.findUnique({ where: { token } });
        if (!session) return res.status(401).json({ error: 'Invalid session' });

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Failed to authenticate token' });
    }
};

// Login endpoint
const login = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        // Find user by email or phone using `findFirst`
        const user = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: email || undefined },
                    { phone: phone || undefined }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Delete any existing session for this user to avoid conflicts
        await prisma.sessions.deleteMany({
            where: { user_id: user.user_id }
        });

        // Generate a new JWT token
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Create a new session in the sessions table
        const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION);
        await prisma.sessions.create({
            data: {
                user_id: user.user_id,
                token,
                expires_at: expiresAt
            }
        });

        // Set the token in a secure cookie
        res.cookie("authToken", token, {
            maxAge: TOKEN_EXPIRATION,
            httpOnly: true,
            secure: false, // Set to true in production if using HTTPS
            sameSite: "Strict"
        });

        // Respond with the login details
        res.status(200).json({
            message: "Login successful",
            token,
            user_id: user.user_id,
            first_name: user.first_name
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Logout endpoint
const logout = async (req, res) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Delete the session from the database
        await prisma.sessions.deleteMany({ where: { user_id: decoded.user_id, token } });

        // Clear the auth token cookie
        res.clearCookie("authToken");

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error during logout:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(500).json({ message: "Failed to log out", error: error.message });
        
    }
};

module.exports = { login, logout, verifyToken, JWT_SECRET };
