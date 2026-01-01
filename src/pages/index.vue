<template>
  <v-container class="product-list-page">
    <div class="page-header">
      <h1 class="page-title">商品一覧</h1>
      <p class="page-subtitle">今シーズンの最新トレンドアイテムをチェック</p>
    </div>

    <div v-if="productStore.loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <v-alert v-else-if="productStore.error" type="error" class="mb-4">
      {{ productStore.error }}
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="product in paginatedProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard :product="product" />
      </v-col>
    </v-row>

    <div
      v-if="!productStore.loading && !productStore.error"
      class="pagination-container"
    >
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        color="primary"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useProductStore } from '~/stores/productStore'

const productStore = useProductStore()

const currentPage = ref(1)
const itemsPerPage = 8

const totalPages = computed(() => {
  return Math.ceil(productStore.products.length / itemsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return productStore.products.slice(start, end)
})

onMounted(async () => {
  await productStore.fetchProducts()
})

useSeoMeta({
  title: '商品一覧 - ShopName',
  description: '今シーズンの最新トレンドアイテムをチェック',
})
</script>

<style scoped>
.product-list-page {
  padding: 48px 5%;
  max-width: 1400px;
}

.page-header {
  margin-bottom: 48px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}
</style>
