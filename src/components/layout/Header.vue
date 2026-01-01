<template>
  <v-app-bar elevation="1">
    <div class="header-container">
      <div class="d-flex">
        <v-icon size="32" color="primary" class="mr-2">mdi-store</v-icon>
        <span class="text-h6 font-weight-bold">ShopName</span>
      </div>

      <div class="d-flex align-center justify-end">
        <v-badge
          color="error"
          :content="cartStore.totalItems"
          :model-value="cartStore.totalItems > 0"
          offset-x="12"
          offset-y="12"
        >
          <v-btn icon variant="text" size="large" disabled title="カートページは準備中です">
            <v-icon size="28">mdi-cart-outline</v-icon>
          </v-btn>
        </v-badge>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cartStore'

const cartStore = useCartStore()

// アプリ起動時にローカルストレージからカートデータを読み込む
onMounted(() => {
  cartStore.loadFromStorage()
})
</script>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  padding: 0 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
</style>
