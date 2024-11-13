<template>
  <div class="orders-page">
    <div class="sidebar">
      <ul>
        <li v-for="(item, index) in menuItems" :key="index" :class="{ active: index === activeItem }"
          @click="setActiveItem(index)">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="orders-content">
      <h2>{{ pageTitle }}</h2>
      <button v-if="activeItem === 0" class="main-order-button">เลขที่ใบสั่งซื้อ (Main Order)</button>

      <!-- Search Bar -->
      <div class="search-bar">
        <label>Search:</label>
        <input type="text" v-model="searchQuery" @input="filterOrders" />
      </div>

      <!-- Orders Table -->
      <table class="orders-table">
        <thead>
          <tr>
            <th>วันที่จบการสั่งซื้อ</th>
            <th>เลขที่ใบสั่งซื้อ</th>
            <th>Status</th>
            <th>รูปแบบการจัดส่ง</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredOrders.length === 0">
            <td colspan="4">No data available in table</td>
          </tr>
          <tr v-for="(order, index) in filteredOrders" :key="index">
            <td>{{ order.date }}</td>
            <td>{{ order.orderNumber }}</td>
            <td>{{ order.status }}</td>
            <td>{{ order.deliveryMethod }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination (Placeholder) -->
      <div class="pagination">
        <button>«</button>
        <button>»</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeItem: 0,
      menuItems: [
        "รายการสั่งซื้อของฉัน",
        "รายการสั่งซื้อรอชำระ",
        "สินค้าที่ชื่นชอบ",
        "ร้านค้าที่ชื่นชอบ",
        "จัดการข้อมูลส่วนตัว",
        "จัดการที่อยู่จัดส่ง",
        "การรีวิวและให้คะแนนสินค้า"
      ],
      orders: [
        { date: "2024-10-26", orderNumber: "12345", status: "Completed", deliveryMethod: "Delivery" },
        { date: "2024-10-27", orderNumber: "12346", status: "Pending", deliveryMethod: "Pick-up" }
        // More sample orders
      ],
      searchQuery: "",
      filteredOrders: []
    };
  },
  computed: {
    pageTitle() {
      return this.activeItem === 0 ? "รายการสั่งซื้อของฉัน" : "รายการสั่งซื้อรอชำระ";
    }
  },
  methods: {
    setActiveItem(index) {
      this.activeItem = index;
      this.filterOrders();
    },
    filterOrders() {
      this.filteredOrders = this.orders.filter(order => {
        return (
          order.orderNumber.includes(this.searchQuery) ||
          order.status.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.deliveryMethod.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  },
  mounted() {
    this.filterOrders();
  }
};
</script>

<style scoped>
.orders-page {
  display: flex;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 200px;
  background-color: #f8f8f8;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
}

.sidebar li.active {
  font-weight: bold;
  color: #007bff;
}

.orders-content {
  flex: 1;
  padding: 20px;
}

.main-order-button {
  background-color: #d9534f;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.main-order-button:hover {
  background-color: #c9302c;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.search-bar input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.orders-table th,
.orders-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.orders-table th {
  background-color: #f2f2f2;
}

.pagination {
  text-align: center;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}
</style>