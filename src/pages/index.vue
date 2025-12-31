<template>
  <div class="container">
    <h1>Welcome to Your Shop</h1>
    <p>This is the home page</p>
    <nav>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/products">Products</NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
const title = ref<string>('Shop Home')

useSeoMeta({
  title: title.value,
  description: 'Welcome to our shop',
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

nav {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

nav a {
  color: #00dc82;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid #00dc82;
  border-radius: 4px;
}

nav a:hover {
  background-color: #00dc82;
  color: white;
}
</style>
