<template>
  <v-card class="product-card" elevation="2">
    <v-img :src="product.image" height="250" cover></v-img>

    <v-card-text class="product-info">
      <div class="product-brand">{{ product.brand }}</div>

      <h3 class="product-name">{{ product.name }}</h3>

      <p class="product-description">{{ product.description }}</p>

      <div class="product-footer">
        <div class="product-price">¥{{ product.price.toLocaleString() }}</div>
        <div v-if="product.stock === 0" class="sold-out">売り切れ</div>
        <v-btn v-else color="primary" size="small" class="add-button" @click="addToCart">
          <v-icon left size="small">mdi-cart-plus</v-icon>
          追加
        </v-btn>
      </div>
    </v-card-text>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import type { Product } from '~/data/products'
import { useCartStore } from '~/stores/cartStore'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const addToCart = () => {
  const result = cartStore.addToCart(props.product.id)

  if (result.success) {
    snackbarMessage.value = 'カートに追加しました'
    snackbarColor.value = 'success'
    snackbar.value = true
  } else {
    snackbarMessage.value = result.message || 'エラーが発生しました'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}
</script>

<style scoped>
.product-card {
  border-radius: 12px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.product-brand {
  margin-bottom: 8px;
}

.product-name {
  margin-bottom: 8px;
}

.product-description {
  margin-bottom: 16px;
  flex: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-button {
  text-transform: none;
}

.sold-out {
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #999;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}
</style>
