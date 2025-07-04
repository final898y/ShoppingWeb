<template>
  <div class="orders-container">
    <h1>我的訂單</h1>
    <div v-if="isLoading" class="loading">
      <p>正在載入訂單...</p>
    </div>
    <div v-else-if="orders.length === 0" class="no-orders">
      <p>您目前沒有任何訂單。</p>
      <router-link to="/" class="btn btn-primary">去逛逛</router-link>
    </div>
    <div v-else class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div>
            <span class="order-id">訂單編號: {{ order.id }}</span>
            <span :class="['order-status', getStatusClass(order.status)]">{{ translateStatus(order.status) }}</span>
          </div>
          <div class="order-date">{{ new Date(order.createdAt).toLocaleDateString() }}</div>
        </div>
        <div class="order-body">
          <div class="order-items">
             <div v-for="item in order.items" :key="item.productId" class="order-item">
                <span>{{ item.product.name }} x {{ item.quantity }}</span>
                <span>NT$ {{ item.price * item.quantity }}</span>
            </div>
          </div>
          <div class="order-total">
            <p>總金額: <strong>NT$ {{ order.totalAmount }}</strong></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import type { Order } from '@/models/backendApiModel';

const orderStore = useOrderStore();
const orders = ref<Order[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // 假設 store 有一個 `fetchUserOrders` 的 action
    orders.value = await orderStore.fetchUserOrders();
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  } finally {
    isLoading.value = false;
  }
});

const translateStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'PENDING': '待付款',
    'PAID': '已付款',
    'SHIPPED': '已出貨',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: string) => {
  return `status-${status.toLowerCase()}`;
};

</script>

<style scoped>
.orders-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
}

.loading, .no-orders {
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.order-id {
  font-weight: bold;
  font-size: 1.1rem;
  margin-right: 1rem;
}

.order-date {
  color: #6c757d;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
}

.status-paid {
  background-color: #28a745;
}
.status-pending {
  background-color: #ffc107;
  color: #212529;
}
.status-shipped {
  background-color: #17a2b8;
}
.status-completed {
  background-color: #007bff;
}
.status-cancelled {
  background-color: #6c757d;
}

.order-body {
    padding: 1.5rem;
}

.order-items {
    margin-bottom: 1rem;
}

.order-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
    border-bottom: none;
}

.order-total {
  text-align: right;
  margin-top: 1rem;
  font-size: 1.2rem;
}

.btn-primary {
    text-decoration: none;
    background-color: #007bff;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.btn-primary:hover {
    background-color: #0056b3;
}
</style>