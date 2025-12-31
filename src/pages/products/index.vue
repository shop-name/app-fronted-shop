<template>
  <div class="container">
    <h1>Products</h1>
    <p>Browse our product catalog</p>
    <div class="product-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }}</p>
        <NuxtLink :to="`/products/${product.id}`">View Details</NuxtLink>
      </div>
    </div>
    <NuxtLink to="/" class="back-link">Back to Home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: string
}

const products = ref<Product[]>([
  { id: 1, name: 'Product 1', price: '$10.00' },
  { id: 2, name: 'Product 2', price: '$20.00' },
  { id: 3, name: 'Product 3', price: '$30.00' },
])

useSeoMeta({
  title: 'Products',
  description: 'Browse our product catalog',
})
</script>

<style scoped>
.container {
  padding: 2rem;
  font-family: sans-serif;
}

h1 {
  color: #00dc82;
  margin-bottom: 1rem;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.product-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

.product-card h3 {
  margin: 0 0 0.5rem 0;
}

.product-card a {
  color: #00dc82;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link {
  color: #00dc82;
  text-decoration: none;
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid #00dc82;
  border-radius: 4px;
}

.back-link:hover {
  background-color: #00dc82;
  color: white;
}
</style>
