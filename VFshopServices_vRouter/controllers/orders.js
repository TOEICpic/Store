const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Order
const createOrder = async (req, res) => {
    const { order_id, user_id, address_id, items, total_amount, shipping_cost } = req.body;

    if (!user_id || !items || !address_id || !total_amount) {
        return res.status(400).json({ message: 'Invalid order data' });
    }

    try {
        const order = await prisma.orders.create({
            data: {
                order_id: order_id,
                user_id: user_id,
                address_id: address_id,
                order_status: 'Pending',
                total_amount: total_amount,
                shipping_cost: shipping_cost || 0.00,
            },
        });

        // Create order items in `order_items` table without specifying `total_price`
        const orderItems = await prisma.order_items.createMany({
            data: items.map(item => ({
                order_id: order.order_id,
                product_id: item.product_id,
                name: item.name,
                vendor_id: item.vendor_id,
                quantity: item.quantity,
                unit_price: parseFloat(item.unit_price),
                // Do not include total_price here; MySQL will calculate it automatically.
            })),
        });

        res.status(200).json({
            message: 'Order and order items created successfully.',
            orderId: order.order_id,
            totalAmount: order.total_amount,
            userId: order.user_id,
        });
    } catch (err) {
        console.error('Failed to create order:', err.message);
        res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
};


// Create Payment
const createPayment = async (req, res) => {
    const { order_id, paymentMethod, amount } = req.body;

    if (!order_id || !paymentMethod || !amount) {
        return res.status(400).json({ message: 'Invalid payment data' });
    }

    try {
        const payment = await prisma.payments.create({
            data: {
                order_id: order_id,
                amount: amount,
                payment_method: paymentMethod,
                payment_status: 'Pending',
            },
        });

        res.status(200).json({
            message: 'Payment created successfully.',
            paymentId: payment.payment_id,
            paymentStatus: payment.payment_status,
        });
    } catch (err) {
        console.error('Failed to create payment:', err.message);
        res.status(500).json({ message: 'Failed to create payment', error: err.message });
    }
};

// Get Orders
const getOrders = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                order_items: true,
                users: true,
                addresses: true,
            },
        });
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { order_status, address_id } = req.body;

    if (!order_status || !address_id) {
        return res.status(400).json({ message: 'Both order_status and address_id are required.' });
    }

    try {
        const updatedOrder = await prisma.orders.update({
            where: { order_id: parseInt(id) }, // Ensure order_id is an integer
            data: {
                order_status,
                address_id: parseInt(address_id), // Ensure address_id is an integer
                updated_at: new Date(), // Set updated_at to current time
            },
        });

        res.status(200).json({
            message: `Order with ID = ${id} has been updated.`,
            order: updatedOrder,
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({ message: `Order with ID = ${id} not found.` });
        } else {
            console.error('Error updating order status:', err);
            res.status(500).json({ message: 'An error occurred while updating the order.' });
        }
    }
};

// Get Orders by Customer ID
const getOrderCus = async (req, res) => {
    const { customer_id } = req.params;

    if (isNaN(customer_id)) {
        return res.status(400).json({ message: 'Invalid customer ID' });
    }

    try {
        const orders = await prisma.orders.findMany({
            where: { user_id: parseInt(customer_id) },
            include: { order_items: true },
            orderBy: { created_at: 'desc' },
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this customer' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

// Get Payment History by Customer ID
const getPaymentHistoryByCustomerId = async (req, res) => {
    const { customer_id } = req.params;

    if (!customer_id) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
        const payments = await prisma.payments.findMany({
            where: {
                orders: { user_id: parseInt(customer_id) },
            },
            include: { orders: true },
            orderBy: { transaction_date: 'desc' },
        });

        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payment history:', error.message);
        res.status(500).json({ message: 'Failed to fetch payment history', error: error.message });
    }
};

const getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Fetch order with related data
        const order = await prisma.orders.findUnique({
            where: {
                order_id: parseInt(orderId),  // Parse orderId to ensure it's an integer
            },
            include: {
                order_items: {
                    include: {
                        products: {
                            include: {
                                product_images: true,
                            },
                        }
                    },
                },
                users: true,        // Include user data if available
                addresses: true,    // Include address data if available
            },
        });

        // If the order is not found, return a 404 response
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Send the order details in the response
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAddress = async (req, res) => {
    const { customer_id } = req.params;

    try {
        // Fetch addresses for the specified user_id
        const addresses = await prisma.addresses.findMany({
            where: {
                user_id: parseInt(customer_id) , // Ensure user_id is treated as an integer
            },
        });

        // If no addresses found, return 404
        if (addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user.' });
        }

        // Return the list of addresses
        res.status(200).json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Failed to fetch addresses.', error: error.message });
    }
};

const createAddress = async (req, res) => {
    const { user_id } = req.params;
    const { label, address_line1, address_line2, city, postal_code, phone } = req.body;

    // Validate required fields
    if (!label || !address_line1 || !city || !postal_code || !phone) {
        return res.status(400).json({ message: 'Missing required address fields.' });
    }

    try {
        // Create the new address
        const newAddress = await prisma.addresses.create({
            data: {
                user_id: parseInt(user_id), // Associate with specified user_id
                label,
                address_line1,
                address_line2: address_line2 || "", // Optional field
                city,
                postal_code,
                country: "ประเทศไทย",
                phone,
            },
        });

        // Return the created address
        res.status(201).json({
            message: 'Address created successfully',
            address: newAddress
        });
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ message: 'Failed to create address.', error: error.message });
    }
};

// Update address
const updateAddress = async (req, res) => {
    const { address_id } = req.params;
    const { label, address_line1, address_line2, city, postal_code, phone } = req.body;

    try {
        const updatedAddress = await prisma.addresses.update({
            where: { address_id: parseInt(address_id) },
            data: {
                label,
                address_line1,
                address_line2,
                city,
                postal_code,
                phone,
            },
        });

        res.status(200).json({ message: 'Address updated successfully', updatedAddress });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Failed to update address', error: error.message });
    }
};

// Delete address
const deleteAddress = async (req, res) => {
    const { address_id } = req.params;

    try {
        await prisma.addresses.delete({
            where: { address_id: parseInt(address_id) },
        });

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Failed to delete address', error: error.message });
    }
};

const getProductbyOrderId = async (req, res) => {
    const { orderId } = req.params;

    try {
        const orderItems = await prisma.order_items.findMany({
            where: {
                order_id: parseInt(orderId),
            },
        });

        if (orderItems.length === 0) {
            return res.status(404).json({ message: 'No products found for this order' });
        }

        res.status(200).json(orderItems);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
}

const getSalesByDate = async (req, res) => {
    try {
        // Retrieve and validate the date parameter from the query
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'Date parameter is required' });
        }

        // Parse the date and define the date range for the specified day
        const startDate = new Date(`${date}T00:00:00Z`);
        const endDate = new Date(`${date}T23:59:59Z`);

        // Fetch order items created within the specified date range
        const sales = await prisma.order_items.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            include: {
                products: true, // Ensure `products` relation includes product details
            },
        });

        // Format the response data to include only relevant fields
        const formattedSales = sales.map((item) => ({
            order_item_id: item.order_item_id,
            product_name: item.products?.name || 'Unknown', // Use the related product name
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price || item.unit_price * item.quantity,
        }));

        res.json(formattedSales);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ message: 'Failed to fetch sales data' });
    }
};

module.exports = {
    createOrder,
    createPayment,
    getOrders,
    updateOrderStatus,
    getOrderCus,
    getPaymentHistoryByCustomerId,
    getOrderById,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    getProductbyOrderId,
    getSalesByDate
};
