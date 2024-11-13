<template>
  <div class="promo-slider">
    <div class="slider">
      <!-- Display the current image based on activeIndex -->
      <img :src="images[activeIndex]" alt="Promotional Image" class="slider-image" />
    </div>
    <!-- Dots for navigating between slides manually -->
    <div class="dots">
      <span v-for="(image, index) in images" :key="index" :class="{ active: index === activeIndex }"
        @click="setActiveIndex(index)"></span>
    </div>
  </div>

  <div class="homepage">
    <h2 class="category-title">กลุ่มสินค้า</h2>
    <div class="category-line"></div>
    <div class="product-categories">
      <!-- <div v-for="(category, index) in categories" :key="index" class="category-card">
        <img :src="category.image" :alt="category.name" class="category-image" />
        <div class="category-name">{{ category.name }}</div>
      </div> -->
      <div class="category-card">
        <img src="../assets/images/vegetable.jpg" alt="ผัก" class="category-image" />
        <div class="category-name">ผัก</div>
      </div>
      <div class="category-card">
        <img src="../assets/images/fruit.jpg" alt="ผลไม้" class="category-image" />
        <div class="category-name">ผลไม้</div>
      </div>
    </div>
  </div>

  <div class="product-showcase">
    <div class="header">
      <h2>สินค้า</h2>

      <a href="/product" class="view-all-link">ดูสินค้าทั้งหมด</a>
    </div>
    <div class="product-line"></div>
    <div class="product-list">
      <!-- Display only the first 5 products -->
      <div v-for="(product, index) in limitedProducts" :key="index" class="product-card">
        <img :src="product.product_images[0]?.image_url" :alt="product.name" class="product-image" />
        <div class="product-details">
          <h3 class="product-name">{{ product.name }}</h3>
        </div>
      </div>
    </div>
  </div>

  <div class="promo-banner">
    <div class="promo-content">
      <h2>สมัครสมาชิก ฟรี!</h2>
      <p>ค้นหาผักและเลือกซื้อผัก-ผลไม้ได้ง่ายๆ</p>
      <button class="promo-button" @click="gotoRegister">สมัครสมาชิก คลิกที่นี่</button>
    </div>
  </div>

  <div class="info-section">
    <div class="info-item" v-for="(item, index) in infoItems" :key="index">
      <div class="icon-circle">
        <img :src="item.icon" alt="Icon" style="color: aliceblue;" />
        <!-- <span class="number">{{ item.number }}</span> -->
      </div>
      <p class="title">{{ item.title }}</p>
      <p class="description">{{ item.description }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8800/api/v1/products');
        this.products = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  },

  mounted() {
    this.fetchProducts();
  },
  setup() {
    const router = useRouter();
    const products = ref([]);

    const gotoRegister = () => {
      router.push('/register');
    };

    // Computed property to limit products to the first 5
    const limitedProducts = computed(() => products.value.slice(0, 5));

    const images = ref([
      "https://chillpainai.com/src/wewakeup/scoop/images/af142749a7a2f9d1ed2a04b5481029ec7b21cb90.jpg", // Replace with actual paths
      "https://www.postcardmania.com/wp-content/uploads/blog/img/22-restaurant-marketing-ideas.jpg",
      "https://assets-h2.izmocars.com/userfiles/102960/ARTICLE/izmocars_banner_04_article.jpg",
    ]);

    const activeIndex = ref(0);
    let slideInterval = null;

    // Function to start the automatic slide rotation
    const startSlideShow = () => {
      slideInterval = setInterval(() => {
        activeIndex.value = (activeIndex.value + 1) % images.value.length;
      }, 3000); // Change every 3 seconds
    };

    // Function to stop the slide rotation when component is destroyed
    const stopSlideShow = () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };

    // Function to manually set active slide
    const setActiveIndex = (index) => {
      activeIndex.value = index;
    };

    // Start slideshow on mount and stop on unmount
    onMounted(startSlideShow);
    onUnmounted(stopSlideShow);

    return {
      router,
      gotoRegister,
      products,
      limitedProducts,
      images,
      activeIndex,
      setActiveIndex
    };
  },
  data() {
    return {
      infoItems: [
        {
          icon: "https://cdn-icons-png.flaticon.com/512/4862/4862440.png", // Update with actual path
          number: "30,000",
          title: "ลูกค้าสามารถเข้ามาช้อปปิ้งได้",
          description: "เลือกซื้อสินค้าจากเว็บไซต์ได้"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/512/2554/2554978.png", // Update with actual path
          number: "4,000",
          title: "มีบริการขนส่งสินค้า",
          description: "มีบริการขนส่งสินค้าไปถึงบ้านคุณ"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/512/3225/3225196.png", // Update with actual path
          number: "24",
          title: "ทำการเลือกซื้อได้อย่างต่อเนื่อง",
          description: "ตลอด 24 ชั่วโมง"
        }
      ]
    };
  },
};
</script>

<style scoped>
/* Main Variables */
/* Main Variables */
:root {
  --primary-green: #4CAF50;
  --secondary-green: #45a049;
  --light-green: #e8f5e9;
  --accent-orange: #FF9800;
  --text-dark: #333333;
  --text-light: #666666;
  --background-light: #ffffff;
  --border-radius: 8px;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Auth Section */
.auth-buttons {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 1rem;
  z-index: 1000;
}

.auth-button {
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.login-button {
  background: transparent;
  border: 2px solid var(--primary-green);
  color: var(--primary-green);
}

.login-button:hover {
  background: var(--light-green);
}

.signup-button {
  background: var(--primary-green);
  border: none;
  color: white;
}

.signup-button:hover {
  background: var(--secondary-green);
  transform: translateY(-2px);
}

/* Promo Slider Styles */
.promo-slider {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 2rem;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.slider-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dots span.active {
  background: var(--background-light);
  transform: scale(1.2);
}

/* Homepage Categories */
.homepage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.category-title {
  color: var(--text-dark);
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.category-line {
  height: 3px;
  width: 80px;
  background-color: var(--primary-green);
  margin: 0 auto 2rem;
}

.product-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.category-card {
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: var(--shadow);
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.category-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 1.2rem;
}

/* Product Showcase */
.product-showcase {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.product-showcase .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.product-showcase h2 {
  color: var(--text-dark);
  font-size: 2rem;
}

.view-all-link {
  color: var(--primary-green);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-all-link:hover {
  color: var(--secondary-green);
}

.product-line {
  height: 3px;
  width: 80px;
  background-color: var(--primary-green);
  margin-bottom: 2rem;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.product-card {
  background: var(--background-light);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-details {
  padding: 1rem;
}

.product-name {
  color: var(--text-dark);
  font-size: 1.1rem;
  margin: 0;
  text-align: center;
}

/* Promo Banner */
.promo-banner {
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
  position: relative;
  padding: 5rem 1rem;
  margin: 4rem 0;
  overflow: hidden;
}

/* Decorative elements */
.promo-banner::before,
.promo-banner::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.1;
}

.promo-banner::before {
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h-2v-2h2v2zm0-4h-2V7h2v7z"/></svg>');
  left: -50px;
  top: -50px;
  transform: rotate(-15deg);
}

.promo-banner::after {
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h-2v-2h2v2zm0-4h-2V7h2v7z"/></svg>');
  right: -50px;
  bottom: -50px;
  transform: rotate(15deg);
}

.promo-content {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.promo-content h2 {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  animation: fadeInDown 0.6s ease-out;
}

.promo-content p {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.promo-button {
  background: #ff6f00;
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.promo-button:hover {
  background: #ff8f00;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.promo-button:active {
  transform: translateY(-1px);
}

/* Info Section */
.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
}

.info-item {
  text-align: center;
  padding: 2rem;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background: var(--light-green);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-circle img {
  width: 40px;
  height: 40px;
}

.info-item .title {
  color: var(--text-dark);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.info-item .description {
  color: var(--text-light);
  line-height: 1.6;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-buttons {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .auth-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .slider-image {
    height: 300px;
  }
  
  .category-card {
    margin: 0 1rem;
  }
  
  .promo-banner {
    padding: 4rem 1rem;
  }

  .promo-content h2 {
    font-size: 2.5rem;
  }

  .promo-content p {
    font-size: 1.2rem;
  }

  .promo-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
  
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 480px) {
  .auth-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .slider-image {
    height: 200px;
  }
  
  .category-title,
  .product-showcase h2 {
    font-size: 1.5rem;
  }
  
  .promo-banner {
    padding: 3rem 1rem;
  }

  .promo-content h2 {
    font-size: 2rem;
  }

  .promo-content p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .promo-button {
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
    width: 100%;
    max-width: 280px;
  }
}
</style>
