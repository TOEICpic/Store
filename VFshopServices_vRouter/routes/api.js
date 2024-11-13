const express = require('express');
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 1000*60*3,   // 3 minutes
    max: 100,
    message: 'Too many requests, please try again after 3 minutes!'
});
const router = express.Router();
const customerController = require('../controllers/customers');
const productController = require('../controllers/products');
const categoryController = require('../controllers/category');
const orderController = require('../controllers/orders');
const authController = require('../controllers/auth');
const userController = require('../controllers/users');
const pageProfileController = require('../controllers/profile');

router.post('/customers', apiLimiter, customerController.createUser);
router.put('/customers/:id', apiLimiter, customerController.updateUser);
router.delete('/customers/:id', apiLimiter, customerController.deleteUser);
router.get('/customers/:id', customerController.getUserById);
// router.get('/customers/q/:term', apiLimiter, customerController.getCustomersByTerm);
//router.get('/customers', authController.verifyToken, customerController.getCustomers);
router.get('/customers', apiLimiter, customerController.getUsers);

router.post('/products', apiLimiter, productController.createProduct);
router.put('/products/:id', apiLimiter, productController.updateProduct);
router.delete('/products/:id', apiLimiter, productController.deleteProduct);
router.get('/products/:id', productController.getProduct);
router.get('/products/q/:term', apiLimiter, productController.getProductsByTerm);
//router.get('/products', authController.verifyToken, productController.getProducts);
router.get('/products', apiLimiter, productController.getProducts);

router.post('/categorys', apiLimiter, categoryController.createCategory);
router.put('/categorys/:id', apiLimiter, categoryController.updateCategory);
router.delete('/categorys/:id', apiLimiter, categoryController.deleteCategory);
router.get('/categorys/:id', categoryController.getCategory);
router.get('/categorys/q/:term', apiLimiter, categoryController.getCategorysByTerm);
//router.get('/products', authController.verifyToken, productController.getProducts);
router.get('/categorys', apiLimiter, categoryController.getCategorys);

router.post('/orders', apiLimiter, orderController.createOrder);
router.get('/orders', apiLimiter, orderController.getOrders);
router.get('/orders/:orderId', apiLimiter, orderController.getOrderById);
router.put('/orders/:id', apiLimiter, orderController.updateOrderStatus);
router.get('/orders/customer/:customer_id', apiLimiter, orderController.getOrderCus);
router.get('/payments/customer/:customer_id', apiLimiter, orderController.getPaymentHistoryByCustomerId);
router.post('/pays', apiLimiter, orderController.createPayment);
router.get('/address/customer/:customer_id', apiLimiter, orderController.getAddress);
router.post('/address/customer/:user_id', apiLimiter, orderController.createAddress);
router.put('/address/:address_id', apiLimiter, orderController.updateAddress);
router.delete('/address/:address_id', apiLimiter, orderController.deleteAddress);
router.get('/products/:orderId', apiLimiter, orderController.getProductbyOrderId);
router.get('/sales', apiLimiter, orderController.getSalesByDate);

router.get('/profile/orders/pending', apiLimiter, pageProfileController.getPendingOrders);
router.get('/profile/favorites/products', apiLimiter, pageProfileController.getFavoriteProducts);
router.get('/profile/favorites/stores', apiLimiter, pageProfileController.getFavoriteStores);
router.put('/users/profile', apiLimiter, pageProfileController.updateUserProfile);
router.get('/reviews', apiLimiter, pageProfileController.getUserReviews);

router.post('/users', userController.createUser);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;


/**
 * @swagger
 * components:
 *    schemas:
 *      Customer:
 *        type: object
 *        properties:
 *          customer_id:
 *            type: integer
 *            description: The unique identifier of the customer.
 *          first_name:
 *            type: string
 *            description: The customer's firstname.
 *          last_name:
 *            type: string
 *            description: The customer's lastname.
 *          address:
 *            type: string
 *            description: The customer's address.
 *          email:
 *            type: string
 *            description: The customer's email (unique).
 *          phone_number:
 *            type: string
 *            description: The customer's phone number.
 *        required:
 *          - none
 */

/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: Get All Customers
 *     tags: [Customers]
 *     description: Returns a list of all customers in the database.
 *     responses:
 *       200:
 *         description: A list of customers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Internal server error.
 * 
 */

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   get:
 *     summary: Get Customer by ID
 *     tags: [Customers]
 *     description: Returns a single customer object based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The unique identifier of the customer.
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Customer object found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating customer not found.
 *       500:
 *         description: Internal server error.
 *
 */

/**
 * @swagger
 * /api/v1/customers:
 *   post:
 *     summary: Create a new Customer 
 *     tags: [Customers]
 *     description: create a new customer on database 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Customer object created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Internal server error.
 *
 */

