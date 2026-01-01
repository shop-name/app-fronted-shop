<template>
  <v-footer color="white" class="footer" height="auto">
    <div class="footer-container">
      <div class="copyright">
        <span>© 2025 ShopName Inc. All rights reserved.</span>
      </div>

      <div class="footer-links">
        <span class="footer-link">プライバシーポリシー</span>
        <span class="footer-link">特定商取引法に基づく表記</span>
        <span class="footer-link">お問い合わせ</span>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer {
  border-top: 1px solid #e0e0e0;
}

.footer-container {
  width: 100%;
  padding: 16px 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.copyright {
  color: #666;
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 32px;
}
</style>
