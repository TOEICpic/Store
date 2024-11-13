<template>
  <div class="product-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb">
      <p><a href="/home">หน้าแรก</a> > ผลไม้</p>
    </nav>

    <!-- Category Tab -->
    <div class="tabs">
      <button class="tab active">ผลไม้</button>
    </div>

    <!-- Product List -->
    <div class="product-grid">
      <div v-for="(product, index) in products" :key="index" class="product-card">
        <div class="product-info" @click="viewProduct(product)">
          <img :src="product.product_images[0]?.image_url" alt="Thumbnail" class="product-image"
            style="width: 100%; height: 200px; object-fit: cover;" />

          <p class="product-name">{{ product.name }}</p>
          <p class="product-price">{{ product.price }} บาท</p>
          <p class="product-weight">{{ product.weight }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: []
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8800/api/v1/products');
        this.products = response.data.filter(product => product.category_id === 2);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    viewProduct(product) {
      console.log('View product:', product.product_id);
      this.$router.push({ path: `/products/${product.product_id}`, state: product });
    }
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>


<style scoped>
/* Container Styles */
.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Breadcrumb Styles */
.breadcrumb {
  padding: 12px 0;
  margin-bottom: 24px;
}

.breadcrumb a {
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Tabs Styles */
.tabs {
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.tab {
  position: relative;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.tab.active {
  color: #2563eb;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2563eb;
}

/* Product Grid Styles */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  padding: 0;
}

/* Product Card Styles */
.product-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-info {
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
}

.product-name {
  padding: 12px 16px 8px;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.product-price {
  padding: 0 16px 8px;
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
  margin: 0;
}

.product-weight {
  padding: 0 16px 16px;
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .product-name {
    font-size: 14px;
  }
  
  .product-price {
    font-size: 16px;
  }
  
  .product-weight {
    font-size: 12px;
  }
}

/* Loading Skeleton Animation */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.skeleton {
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  animation: shimmer 1.2s linear infinite;
}

/* Hover Effects */
.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(37, 99, 235, 0.1);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.product-card:hover::before {
  opacity: 1;
}

/* Empty State Styles */
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #6b7280;
}

.empty-state img {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Error State Styles */
.error-state {
  text-align: center;
  padding: 48px 0;
  color: #dc2626;
}
</style>