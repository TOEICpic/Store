<template>
    <div v-if="order" class="order-details-page">
        <h2>รายละเอียดการสั่งซื้อ</h2>
        <div class="consignment-details">
            <p><strong>รหัสสินค้า:</strong> <span class="highlight">{{ order.order_id }}</span></p>
            <p><strong>วันที่สั่งซื้อ:</strong> <span class="highlight">{{ formatDate(order.created_at) }}</span></p>
            <p><strong>สถานะการสั่งซื้อ:</strong> {{ getOrderStatus(order.order_status) }} </p>
            <p><strong>ชื่อผู้สั่งซื้อ:</strong> {{ order.users.first_name }}  {{ order.users.last_name }}</p>
        </div>

        <div class="shipping-info">
            <h3>ข้อมูลการจัดส่ง</h3>
            <p><strong>ที่อยู่:</strong> {{ order.addresses.label }} ต.{{ order.addresses.address_line1 }} อ.{{
                order.addresses.address_line2 }} จ.{{ order.addresses.city }}, {{ order.addresses.postal_code }}</p>
            <p><strong>เบอร์โทร:</strong> {{ order.addresses.phone }}</p>
        </div>

        <div class="order-items">
            <h3>รายการสินค้า</h3>
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>สินค้า</th>
                        <th>จำนวน</th>
                        <th>ราคาต่อหน่วย</th>
                        <th>ราคารวม</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in order.order_items" :key="item.order_item_id">
                        <td>{{ item.products.name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.unit_price }} บาท</td>
                        <td>{{ item.quantity * item.unit_price }} บาท</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Shipping Timeline -->
        <!-- <div class="shipping-timeline">
            <ul class="timeline">
                <li v-for="(status, index) in orders.shipping_statuses" :key="index" :class="{ active: index === 0 }">
                    <div class="status-date-time">
                        <p><strong>Date:</strong> {{ formatDate(status.date) }}</p>
                        <p><strong>Time:</strong> {{ formatTime(status.time) }}</p>
                    </div>
                    <div class="status-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="status-detail">
                        <p>{{ status.description }}</p>
                        <p>{{ status.location }}</p>
                    </div>
                </li>
            </ul>
        </div> -->

    </div>

    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            order: null,

            orders: {
                consignment_number: "RCBSZ00021279",
                due_date: "2023-12-14",
                sender: "เสื้อกันหนาว GAP แท้ ราคาโรงงาน",
                consignee: "คุณณัชชา จิรพงษ์ธนาวงษ์",
                shipping_statuses: [
                    { date: "2023-12-13", time: "11:08", description: "พัสดุรอนำส่ง", location: "สมุทรปราการ - ประเทศไทย" },
                    { date: "2023-12-13", time: "09:32", description: "พัสดุถึงสาขาปลายทาง", location: "สมุทรปราการ - ประเทศไทย" },
                    { date: "2023-12-12", time: "17:46", description: "พัสดุถึงศูนย์คัดแยกสินค้า", location: "กรุงเทพฯ - ประเทศไทย" },
                    { date: "2023-12-12", time: "16:56", description: "เคอรี่เข้ารับพัสดุแล้ว", location: "เชียงใหม่ - ประเทศไทย" },
                    { date: "2023-12-12", time: "16:43", description: "ผู้ส่งมอบพัสดุที่จุดส่ง", location: "เชียงใหม่ - ประเทศไทย" }
                ]
            }
        };
    },
    methods: {
        async fetchOrderDetails() {
            const orderId = this.$route.query.orderId;
            try {
                const response = await axios.get(`http://localhost:8800/api/v1/orders/${orderId}`);
                this.order = response.data;
                console.log("Order details:", this.order);
            } catch (error) {
                console.error("Failed to fetch order details:", error);
            }
        },
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        },
        formatTime(timeString) {
            if (!timeString) return "";
            const time = new Date(`1970-01-01T${timeString}Z`);
            return time.toLocaleTimeString("th-TH", {
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        },
        formatTime(timeString) {
            if (!timeString) return "";
            const time = new Date(`1970-01-01T${timeString}Z`);
            return time.toLocaleTimeString("th-TH", {
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        getOrderStatus(status) {
            switch (status) {
                case "Pending":
                    return "รอดำเนินการ";
                case "Processing":
                    return "กำลังดำเนินการ";
                case "Completed":
                    return "เสร็จสิ้น";
                case "Cancelled":
                    return "ยกเลิก";
                default:
                    return "Unknown";
            }
        }
    },
    mounted() {
        this.fetchOrderDetails();
    }
};
</script>

<style scoped>
.order-items-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.order-items-table th,
.order-items-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.order-items-table th {
    background-color: #007bff;
    color: white;
}

/* Shipping Timeline Styles */
.shipping-timeline {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.order-details-page {
    font-family: Arial, sans-serif;
    padding: 20px;
    max-width: 800px;
    margin: 20px auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.consignment-details {
    margin-bottom: 20px;
    line-height: 1.6;
}

.highlight {
    color: orange;
    font-weight: bold;
}

.shipping-timeline {
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    background-color: #f9f9f9;
    margin-bottom: 20px;
}

.timeline {
    list-style: none;
    padding: 0;
    margin: 0;
}

.timeline li {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #ddd;
}

.timeline li:last-child {
    border-bottom: none;
}

.timeline li.active .status-icon i {
    color: orange;
}

.status-date-time {
    flex: 1;
    font-size: 0.9em;
    color: #666;
}

.status-icon {
    font-size: 24px;
    color: #007bff;
    margin: 0 15px;
}

.status-detail {
    flex: 3;
    color: #333;
}

.contact-info {
    display: flex;
    align-items: center;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    margin-top: 20px;
}

.logo img {
    width: 50px;
    height: 50px;
}

.contact-details {
    margin-left: 10px;
}

.contact-details p {
    margin: 0;
    color: #666;
}
</style>
