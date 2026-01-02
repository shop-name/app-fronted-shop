<template>
  <v-app>
    <LayoutHeader />
    <v-main class="main-content">
      <slot />
    </v-main>
    <LayoutFooter />
  </v-app>
</template>

<style scoped>
.main-content {
  min-height: calc(100vh - 70px - 50px);
  background-color: #F0F4F8;
}
</style>
