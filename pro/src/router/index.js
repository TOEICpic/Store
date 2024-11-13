import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetails from '../views/DetailPage.vue';
import Swal from 'sweetalert2';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    ,
    {
      path: '/home',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfilePage.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/OrderPage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterPage.vue')
    },
    {
      path: '/vegtetable',
      name: 'vegtetable',
      component: () => import('../views/Vegetable.vue')
    },
    {
      path: '/fruit',
      name: 'fruit',
      component: () => import('../views/Fruit.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/dashboard.vue')
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../views/ProductPage.vue')
    },
    {
      path: '/products/:id',
      component: ProductDetails,
      props: true
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartPage.vue')
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import('../views/Payment.vue')
    },
    {
      path: '/order-details',
      name: 'order-details',
      component: () => import('../views/OrderDetails.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token !== null;

  // Redirect to /login if trying to access restricted paths when logged out
  if (!isAuthenticated && !['/login', '/register', '/home'].includes(to.path)) {
    
      next('/login');
  } else {
    next();
  }
});

export default router
