<template>
  <div class="container">
    <h1>Product Details</h1>
    <div v-if="product" class="product-detail">
      <h2>{{ product.name }}</h2>
      <p class="price">{{ product.price }}</p>
      <p class="description">{{ product.description }}</p>
    </div>
    <NuxtLink to="/products" class="back-link">Back to Products</NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: string
  description: string
}

const route = useRoute()
const productId = computed(() => Number(route.params.id))

const product = computed<Product | null>(() => {
  const products: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      price: '$10.00',
      description: 'This is a detailed description of Product 1',
    },
    {
      id: 2,
      name: 'Product 2',
      price: '$20.00',
      description: 'This is a detailed description of Product 2',
    },
    {
      id: 3,
      name: 'Product 3',
      price: '$30.00',
      description: 'This is a detailed description of Product 3',
    },
  ]
  return products.find((p) => p.id === productId.value) || null
})

useSeoMeta({
  title: product.value?.name || 'Product',
  description: product.value?.description || 'Product details',
})
</script>

<style scoped>
.container {
  padding: 2rem;
  font-family: sans-serif;
}

h1 {
  color: #00dc82;
  margin-bottom: 2rem;
}

.product-detail {
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.product-detail h2 {
  margin: 0 0 1rem 0;
}

.price {
  font-size: 1.5rem;
  color: #00dc82;
  font-weight: bold;
  margin: 1rem 0;
}

.description {
  color: #666;
  line-height: 1.6;
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
