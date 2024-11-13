<template>
    <div class="order-details-page">
        <div class="consignment-details">
            <p><strong>Consignment:</strong> <span class="highlight">{{ order.consignment_number }}</span></p>
            <p><strong>Due Date:</strong> <span class="highlight">{{ formatDate(order.due_date) }}</span></p>
            <p><strong>Reference:</strong></p>
            <p><strong>Sender:</strong> {{ order.sender }}</p>
            <p><strong>Consignee:</strong> {{ order.consignee }}</p>
        </div>

        <!-- Shipping Timeline -->
        <div class="shipping-timeline">
            <ul class="timeline">
                <li v-for="(status, index) in order.shipping_statuses" :key="index" :class="{ active: index === 0 }">
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
        </div>

        <!-- Contact Info -->
        <div class="contact-info">
            <div class="logo">
                <img src="https://via.placeholder.com/50" alt="Kerry Express Thailand" />
            </div>
            <div class="contact-details">
                <p>Kerry Express Thailand</p>
                <p>TH.Expresscallcenter@kerrylogistics.com</p>
                <p>1217</p>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            order: {
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
        }
    }
};
</script>
<style scoped>
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
