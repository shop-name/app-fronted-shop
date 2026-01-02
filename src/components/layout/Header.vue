<template>
  <v-app-bar elevation="1">
    <div class="header-container">
      <NuxtLink to="/" class="logo-link">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-2">mdi-store</v-icon>
          <span class="text-h6 font-weight-bold">ShopName</span>
        </div>
      </NuxtLink>

      <div class="d-flex align-center justify-end">
        <v-badge
          color="error"
          :content="cartStore.totalItems"
          :model-value="cartStore.totalItems > 0"
          offset-x="12"
          offset-y="12"
        >
          <v-btn
            icon
            variant="text"
            size="large"
            to="/cart"
            :active="false"
            title="カートを見る"
          >
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

.logo-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>
