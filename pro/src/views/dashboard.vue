<template>
  <div class="dashboard">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>จัดการระบบ</h2>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li :class="{ active: currentTab === 'products' }" @click="currentTab = 'products'">
            <i class="fa fa-box"></i> รายการสินค้า
          </li>
          <li :class="{ active: currentTab === 'customers' }" @click="currentTab = 'customers'">
            <i class="fa fa-users"></i> รายการข้อมูลลูกค้า
          </li>
          <li :class="{ active: currentTab === 'orders' }" @click="currentTab = 'orders'">
            <i class="fa fa-shopping-cart"></i> รายการการสั่งซื้อ
          </li>
          <li :class="{ active: currentTab === 'sales' }" @click="currentTab = 'sales'">
            <i class="fa fa-chart-line"></i> รายการสินค้าที่ขาย
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div v-if="currentTab === 'products'" class="tab-content">
        <div class="product-list">
          <h2>รายการสินค้า</h2>
          <button @click="openAddProductModal" class="add-product-button">เพิ่มสินค้า</button>
          <table class="product-table">
            <thead>
              <tr>
                <th>รูปภาพ</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่</th>
                <th>ราคา</th>
                <th>น้ำหนัก</th>
                <th>สถานะสต็อก</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.product_id">
                <td>
                  <img :src="product.product_images[0]?.image_url || 'default-image.jpg'" alt="Product Image"
                    class="product-image" />
                </td>
                <td>{{ product.name }}</td>
                <td>
                  {{
                    product.category_id === 1 ? 'ผัก' :
                      product.category_id === 2 ? 'ผลไม้' :
                        product.category_id
                  }}
                </td>
                <td>{{ product.price }} บาท</td>
                <td>{{ product.weight }}</td>
                <td>
                  {{
                    product.stock_status === 'Available' ? 'มีขาย' :
                      product.stock_status === 'Unavailable' ? 'ไม่ขาย' :
                        product.stock_status
                  }}
                </td>
                <td>
                  <button @click="editProduct(product.product_id)">แก้ไข</button>
                  <button @click="deleteProduct(product.product_id)">ลบ</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="showAddProductModal" class="modal-overlay" @click.self="closeAddProductModal">
          <div class="modal-content">
            <h3>เพิ่มสินค้าใหม่</h3>
            <form @submit.prevent="submitNewProduct">

              <label>ชื่อสินค้า</label>
              <input type="text" v-model="newProduct.name" required /><br>

              <label>หมวดหมู่</label>
              <select v-model="newProduct.category_id" required>
                <option value=1>ผัก</option>
                <option value=2>ผลไม้</option>
              </select><br>

              <label>รายละเอียดสินค้า</label>
              <textarea v-model="newProduct.description"></textarea><br>

              <label>ราคา</label>
              <input type="number" v-model="newProduct.price" required /><br>

              <label>น้ำหนัก</label>
              <input type="text" v-model="newProduct.weight" /><br>

              <label>สถานะสต็อก</label>
              <select v-model="newProduct.stock_status">
                <option value="Available">มีขาย</option>
                <option value="Unavailable">ไม่ขาย</option>
              </select><br>

              <div class="modal-buttons">
                <button type="submit">บันทึก</button>
                <button type="button" @click="closeAddProductModal">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="showEditProductModal" class="modal-overlay" @click.self="closeEditProductModal">
          <div class="modal-content">
            <h3>แก้ไขสินค้า</h3>
            <form @submit.prevent="submitEditProduct">
              <label>ชื่อสินค้า</label>
              <input type="text" v-model="editProductData.name" required /><br>

              <label>หมวดหมู่</label>
              <select v-model="newProduct.category_id" required>
                <option value=1>ผัก</option>
                <option value=2>ผลไม้</option>
              </select><br>

              <label>รายละเอียดสินค้า</label>
              <textarea v-model="editProductData.description"></textarea><br>

              <label>ราคา</label>
              <input type="number" v-model="editProductData.price" required /><br>

              <label>น้ำหนัก</label>
              <input type="text" v-model="editProductData.weight" /><br>

              <label>สถานะสต็อก</label>
              <select v-model="editProductData.stock_status">
                <option value="Available">มีขาย</option>
                <option value="Unavailable">ไม่ขาย</option>
              </select><br>

              <div class="modal-buttons">
                <button type="submit">บันทึกการแก้ไข</button>
                <button type="button" @click="closeEditProductModal">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>

      </div>
      <div v-if="currentTab === 'customers'" class="tab-content">
        <h3>รายการข้อมูลลูกค้า</h3>
        <table class="customer-table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>นามสกุล</th>
              <th>อีเมล</th>
              <th>โทรศัพท์</th>
              <th>สถานะ</th>
              <th>วิธีการเข้าสู่ระบบ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.user_id">
              <td>{{ user.first_name }}</td>
              <td>{{ user.last_name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.login_method }}</td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6">ไม่พบข้อมูลลูกค้า</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="currentTab === 'orders'" class="tab-content">
        <h3>รายการการสั่งซื้อ</h3>
        <table class="orders-table">
          <thead>
            <tr>
              <th>รหัสสินค้า</th>
              <th>ชื่อลูกค้า</th>
              <th>จำนวนรายการ</th>
              <!-- <th>ที่อยู่</th> -->
              <th>ราคารวม</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.order_id" >
              <td>{{ order.order_id }}</td>
              <td>{{ order.users.first_name }} {{ order.users.last_name }}</td>
              <td>
                {{ order.order_items.length }} รายการ
              </td>
              <!-- <td>{{ order.addresses }} </td>
                ต.{{ order.addresses.address_line1 }} อ.{{ order.addresses.address_line2
                }} จ.{{ order.addresses.city }} {{ order.addresses.postal_code }}</td> -->
              <td>{{ order.total_amount }} บาท</td>
            </tr>
          </tbody>
        </table>

      </div>
      <div v-if="currentTab === 'sales'" class="tab-content">
        <h3>รายการสินค้าที่ขาย</h3>
        <!-- Date Filter -->
        <div class="date-filter">
          <label for="sales-date">เลือกวันที่:</label>
          <input type="date" id="sales-date" v-model="selectedDate" @change="fetchSalesByDate" />
        </div>
        <table class="sales-table">
          <thead>
            <tr>
              <th>รายการ</th>
              <th>ชื่อสินค้า</th>
              <th>จำนวน/กิโลกรัม</th>
              <th>ราคารวม</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sales.length === 0">
              <td colspan="4">ไม่มีข้อมูลการขายสำหรับวันที่ระบุ</td>
            </tr>
            <tr v-for="(sale, index) in sales" :key="sale.order_item_id">
              <td>{{ index + 1 }}</td>
              <td>{{ sale.product_name }}</td>
              <td>{{ sale.quantity }}</td>
              <td>{{ sale.total_price }} บาท</td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  setup() {
    const currentTab = ref('products');
    const products = ref([]);
    const users = ref([]);
    const orders = ref([]);
    const sales = ref([]);
    const selectedDate = ref('');
    const showAddProductModal = ref(false);
    const showEditProductModal = ref(false);
    const editProductData = ref({});
    const newProduct = ref({
      category_id: 1,
      name: '',
      description: '',
      price: 0,
      weight: '',
      stock_status: 'Available',
    });

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/v1/products');
        products.value = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        Swal.fire('Error', 'Failed to load product data.', 'error');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/v1/customers'); // Update with your actual endpoint
        users.value = response.data;
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/v1/orders'); // Update with your actual endpoint
        orders.value = response.data;
        console.log('Orders:', orders.value[0]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const editProduct = (productId) => {
      // Find the product by ID and set it as the editProductData
      const product = products.value.find(p => p.product_id === productId);
      if (product) {
        editProductData.value = { ...product }; // Clone the product data for editing
        showEditProductModal.value = true;
      }
    };


    const fetchSalesByDate = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/v1/sales?date=${selectedDate.value}`);
        const salesData = response.data;

        // Aggregate sales by product name
        const aggregatedSales = salesData.reduce((acc, sale) => {
          const existingProduct = acc.find(
            item =>
              item.product_name === sale.product_name
          );

          if (existingProduct) {
            // Update quantity and total_price for existing product
            existingProduct.quantity += sale.quantity;
            existingProduct.total_price += sale.total_price;
          } else {
            // Add new product entry
            acc.push({ ...sale });
          }

          return acc;
        }, []);

        sales.value = aggregatedSales;
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    const deleteProduct = async (productId) => {
      try {
        await axios.delete(`http://localhost:8800/api/v1/products/${productId}`);
        products.value = products.value.filter(product => product.product_id !== productId);
        Swal.fire('ลบ', 'ลบสินค้าเรียบร้อยแล้ว', 'success');
      } catch (error) {
        console.error('Failed to delete product:', error);
        Swal.fire('Error', 'เกิดข้อผิดพลาดในการลบสินค้า', 'error');
      }
    };

    const openAddProductModal = () => {
      showAddProductModal.value = true;
    };

    const closeAddProductModal = () => {
      showAddProductModal.value = false;
      resetNewProduct();
    };

    const submitNewProduct = async () => {
      try {
        const response = await axios.post('http://localhost:8800/api/v1/products', newProduct.value);

        if (response.status === 200) {
          products.value.push(response.data); // Add the new product to the list
          Swal.fire('สำเร็จ', 'เพิ่มสินค้าเรียบร้อยแล้ว', 'success').then(() => {
            location.reload();
          });
          closeAddProductModal(); // Close the modal here after successful addition
        } else {
          Swal.fire('Error', 'เกิดข้อผิดพลาดในการเพิ่มสินค้า', 'error');
        }
      } catch (error) {
        console.error('Failed to add product:', error);
        Swal.fire('Error', 'เกิดข้อผิดพลาดในการเพิ่มสินค้า', 'error');
      } finally {
        closeAddProductModal();
      }
    };

    const closeEditProductModal = () => {
      showEditProductModal.value = false;
      editProductData.value = {}; // Reset the edit data
    };

    const submitEditProduct = async () => {
      try {
        const response = await axios.put(`http://localhost:8800/api/v1/products/${editProductData.value.product_id}`, editProductData.value);

        if (response.status === 200) {
          const updatedProduct = response.data.product;
          const index = products.value.findIndex(p => p.product_id === updatedProduct.product_id);
          if (index !== -1) {
            products.value[index] = updatedProduct; // Update the product in the list
          }

          Swal.fire('สำเร็จ', 'แก้ไขสินค้าเรียบร้อยแล้ว', 'success').then(() => {
            location.reload();
          });
          closeEditProductModal();
        } else {
          Swal.fire('Error', 'เกิดข้อผิดพลาดในการแก้ไขสินค้า', 'error');
        }
      } catch (error) {
        console.error('Failed to edit product:', error);
        Swal.fire('Error', 'เกิดข้อผิดพลาดในการแก้ไขสินค้า', 'error');
      }
    };

    const resetNewProduct = () => {
      newProduct.value = {
        category_id: 1,
        name: '',
        description: '',
        price: 0,
        weight: '',
        stock_status: 'Available',
      };
    };

    onMounted(() => {
      fetchUsers();
      fetchProducts();
      fetchOrders();
      fetchSalesByDate();
    });

    return {
      currentTab,
      products,
      showAddProductModal,
      newProduct,
      openAddProductModal,
      closeAddProductModal,
      submitNewProduct,
      showEditProductModal,
      editProductData,
      editProduct,
      closeEditProductModal,
      submitEditProduct,
      users,
      orders,
      sales,
      selectedDate,
      deleteProduct,
      fetchSalesByDate
    };
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  background-color: #f4f6f9;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #2d3436;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  background-color: #1e272e;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
}

.sidebar-nav ul li {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar-nav ul li:hover {
  background-color: #353b48;
}

.sidebar-nav ul li i {
  margin-right: 10px;
  font-size: 18px;
}

.sidebar-nav ul li.active {
  background-color: #353b48;
  color: #1dd1a1;
}

/* Main Content */
.main-content {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
}

.tab-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-table th,
.product-table td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.product-table th {
  background-color: #45a049;
  color: #fff;
  font-weight: bold;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

button {
  padding: 5px 10px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:nth-child(1) {
  background-color: #3498db;
  color: white;
}

button:nth-child(2) {
  background-color: #e74c3c;
  color: white;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table th,
.customer-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.customer-table th {
  background-color: #f8f9fa;
  color: #333;
}

.customer-table tr:hover {
  background-color: #f1f1f1;
}

.orders-table {
  text-align: center;
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.orders-table th,
.orders-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: center;
}

.orders-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.orders-table tr:hover {
  background-color: #f1f1f1;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.date-filter label {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.date-filter input[type="date"] {
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
}

.date-filter input[type="date"]:focus {
  border-color: #45a049;
  box-shadow: 0 0 5px rgba(69, 160, 73, 0.3);
}

.sales-table,
.orders-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.sales-table th,
.sales-table td,
.orders-table th,
.orders-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  text-align: left;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
}

form label {
  display: block;
  font-weight: bold;
  color: #555;
  margin-top: 5px;
}

form input[type="number"],
form input[type="text"],
form textarea,
form select {
  width: 90%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  outline: none;
  transition: border-color 0.3s;
}

form input[type="number"]:focus,
form input[type="text"]:focus,
form textarea:focus,
form select:focus {
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

textarea {
  resize: vertical;
  height: 50px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
}

.modal-buttons button[type="submit"] {
  background-color: #3498db;
  color: white;
}

.modal-buttons button[type="button"] {
  background-color: #e74c3c;
  color: white;
}

.modal-buttons button:hover {
  opacity: 0.9;
}
</style>