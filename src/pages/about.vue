<template>
  <div class="container">
    <h1>About Us</h1>
    <p>Learn more about our shop</p>
    <NuxtLink to="/">Back to Home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About Us',
  description: 'Learn more about our shop',
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

a {
  color: #00dc82;
  text-decoration: none;
  display: inline-block;
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  border: 1px solid #00dc82;
  border-radius: 4px;
}

a:hover {
  background-color: #00dc82;
  color: white;
}
</style>
