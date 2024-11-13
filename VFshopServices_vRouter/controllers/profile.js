const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/v1/orders
// Fetch all orders for the authenticated user
const getOrders = async (req, res) => {
    const { user_id } = req.user;  // Assuming user ID is available from token
    try {
        const orders = await prisma.orders.findMany({
            where: { user_id },
            include: {
                order_items: true,
                addresses: true,
            },
        });
        res.json(orders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/v1/orders/pending
// Fetch all orders with status "Pending" for the user
const getPendingOrders = async (req, res) => {
    const { user_id } = req.user;
    try {
        const pendingOrders = await prisma.orders.findMany({
            where: {
                user_id,
                order_status: 'Pending',
            },
            include: {
                order_items: true,
                addresses: true,
            },
        });
        res.json(pendingOrders);
    } catch (error) {
        console.error('Failed to fetch pending orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/v1/favorites/products
// Fetch favorite products for the user
const getFavoriteProducts = async (req, res) => {
    const { user_id } = req.user;
    try {
        const favoriteProducts = await prisma.favorite_products.findMany({
            where: { user_id },
            include: {
                product: true,
            },
        });
        res.json(favoriteProducts);
    } catch (error) {
        console.error('Failed to fetch favorite products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/v1/favorites/stores
// Fetch favorite stores for the user
const getFavoriteStores = async (req, res) => {
    const { user_id } = req.user;
    try {
        const favoriteStores = await prisma.favorite_stores.findMany({
            where: { user_id },
            include: {
                store: true,
            },
        });
        res.json(favoriteStores);
    } catch (error) {
        console.error('Failed to fetch favorite stores:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT /api/v1/users/profile
// Update user profile details
const updateUserProfile = async (req, res) => {
    const { user_id } = req.user;
    const { firstName, lastName, email, phone } = req.body;
    try {
        const updatedUser = await prisma.users.update({
            where: { user_id },
            data: {
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
            },
        });
        res.json(updatedUser);
    } catch (error) {
        console.error('Failed to update user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /api/v1/addresses
// Add a new shipping address for the user
const addAddress = async (req, res) => {
    const { user_id } = req.user;
    const { label, subDistrict, district, province, postalCode, phone } = req.body;
    try {
        const newAddress = await prisma.addresses.create({
            data: {
                user_id,
                label,
                address_line1: subDistrict,
                address_line2: district,
                city: province,
                postal_code: postalCode,
                phone,
            },
        });
        res.json(newAddress);
    } catch (error) {
        console.error('Failed to add address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/v1/reviews
// Fetch reviews submitted by the user
const getUserReviews = async (req, res) => {
    const { user_id } = req.user;
    try {
        const reviews = await prisma.reviews.findMany({
            where: { user_id },
            include: {
                product: true,
            },
        });
        res.json(reviews);
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /api/v1/reviews
// Submit a new review for a product
const submitReview = async (req, res) => {
    const { user_id } = req.user;
    const { product_id, rating, comment } = req.body;
    try {
        const review = await prisma.reviews.create({
            data: {
                user_id,
                product_id,
                rating,
                comment,
            },
        });
        res.json(review);
    } catch (error) {
        console.error('Failed to submit review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    getOrders,
    getPendingOrders,
    getFavoriteProducts,
    getFavoriteStores,
    updateUserProfile,
    addAddress,
    getUserReviews,
    submitReview,
};
