<template>
  <v-container class="cart-page">
    <!-- ページヘッダー -->
    <div class="page-header">
      <h1 class="page-title">ショッピングカート</h1>
      <p class="page-subtitle">カート内の商品：{{ cartStore.totalItems }}点</p>
    </div>

    <!-- カートが空の場合 -->
    <v-row v-if="cartStore.items.length === 0" justify="center">
      <v-col cols="12" md="8" class="text-center empty-cart">
        <v-icon size="80" color="grey-lighten-1">mdi-cart-outline</v-icon>
        <h2 class="mt-4 text-grey">カートは空です</h2>
        <p class="text-grey-darken-1 mt-2">商品を追加してください</p>
        <v-btn color="primary" size="large" class="mt-6" to="/">
          商品一覧へ戻る
        </v-btn>
      </v-col>
    </v-row>

    <!-- カートに商品がある場合 -->
    <v-row v-else>
      <!-- 商品一覧（左側） -->
      <v-col cols="12" md="8">
        <div class="cart-items">
          <v-card
            v-for="item in cartItems"
            :key="item.product.id"
            class="cart-item mb-4"
            elevation="2"
          >
            <div class="cart-item-content">
              <!-- 商品画像 -->
              <div class="item-image">
                <v-img
                  :src="item.product.image"
                  :alt="item.product.name"
                  width="120"
                  height="120"
                  cover
                />
              </div>

              <!-- 商品情報 -->
              <div class="item-info">
                <div class="product-brand">{{ item.product.brand }}</div>
                <h3 class="product-name">{{ item.product.name }}</h3>
                <div class="product-price mt-2">
                  ¥{{ item.product.price.toLocaleString() }}
                </div>

                <!-- 在庫情報 -->
                <div class="stock-info mt-1">
                  <span v-if="item.product.stock > 10" class="text-success">
                    在庫あり
                  </span>
                  <span v-else-if="item.product.stock > 0" class="text-warning">
                    残り{{ item.product.stock }}点
                  </span>
                  <span v-else class="text-error">
                    在庫切れ
                  </span>
                </div>
              </div>

              <!-- 数量変更と小計 -->
              <div class="item-actions">
                <!-- 数量変更 -->
                <div class="quantity-control">
                  <v-btn
                    icon
                    size="small"
                    variant="outlined"
                    :disabled="item.quantity <= 1"
                    @click="decreaseQuantity(item.product.id)"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="quantity-display">{{ item.quantity }}</span>
                  <v-btn
                    icon
                    size="small"
                    variant="outlined"
                    :disabled="item.quantity >= item.product.stock"
                    @click="increaseQuantity(item.product.id, item.quantity)"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>

                <!-- 小計 -->
                <div class="item-subtotal mt-3">
                  小計: <span class="subtotal-price">¥{{ (item.product.price * item.quantity).toLocaleString() }}</span>
                </div>

                <!-- 削除ボタン -->
                <v-btn
                  color="error"
                  variant="text"
                  size="small"
                  class="mt-2"
                  @click="removeItem(item.product.id)"
                >
                  <v-icon left size="small">mdi-delete</v-icon>
                  削除
                </v-btn>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>

      <!-- 注文概要（右側） -->
      <v-col cols="12" md="4">
        <v-card class="order-summary" elevation="3">
          <v-card-title class="summary-title">注文概要</v-card-title>
          <v-card-text>
            <div class="summary-row">
              <span>小計</span>
              <span>¥{{ subtotal.toLocaleString() }}</span>
            </div>
            <div class="summary-row">
              <span>消費税（10%）</span>
              <span>¥{{ tax.toLocaleString() }}</span>
            </div>
            <div class="summary-row">
              <span>手数料</span>
              <span>¥0</span>
            </div>
            <v-divider class="my-3" />
            <div class="summary-row total">
              <span class="total-label">合計金額</span>
              <span class="total-price">¥{{ total.toLocaleString() }}</span>
            </div>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              block
              elevation="2"
              class="checkout-btn"
              @click="proceedToCheckout"
            >
              <v-icon left>mdi-credit-card</v-icon>
              レジに進む
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- ショッピングを続けるボタン -->
        <v-btn
          variant="text"
          color="primary"
          block
          class="mt-3 continue-shopping-btn"
          to="/"
        >
          <v-icon left size="small">mdi-arrow-left</v-icon>
          ショッピングを続ける
        </v-btn>
      </v-col>
    </v-row>

    <!-- エラー通知 -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cartStore'
import { useProductStore } from '~/stores/productStore'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '~/constants/messages'
import type { Product } from '~/data/products'

const cartStore = useCartStore()
const productStore = useProductStore()
const router = useRouter()

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// カート内の商品情報を取得
const cartItems = computed(() => {
  return cartStore.items.map(item => {
    const product = productStore.getProductById(item.productId)
    return {
      product: product as Product,
      quantity: item.quantity
    }
  }).filter(item => item.product) // 商品が見つからない場合は除外
})

// 小計の計算
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity)
  }, 0)
})

// 消費税の計算（10%）
const tax = computed(() => {
  return Math.round(subtotal.value * 0.1)
})

// 合計金額の計算
const total = computed(() => {
  return subtotal.value + tax.value
})

// 数量を減らす
const decreaseQuantity = (productId: number) => {
  const item = cartStore.items.find(i => i.productId === productId)
  if (item && item.quantity > 1) {
    const result = cartStore.updateQuantity(productId, item.quantity - 1)
    if (!result.success) {
      showNotification(result.message || ERROR_MESSAGES.UPDATE_QUANTITY_FAILED, 'error')
    }
  }
}

// 数量を増やす
const increaseQuantity = (productId: number, currentQuantity: number) => {
  const result = cartStore.updateQuantity(productId, currentQuantity + 1)
  if (!result.success) {
    showNotification(result.message || ERROR_MESSAGES.UPDATE_QUANTITY_FAILED, 'error')
  }
}

// 商品を削除
const removeItem = (productId: number) => {
  cartStore.removeFromCart(productId)
  showNotification(SUCCESS_MESSAGES.REMOVED_FROM_CART, 'success')
}

// レジに進む
const proceedToCheckout = () => {
  router.push('/checkout')
}

// 通知を表示
const showNotification = (message: string, color: 'success' | 'error' | 'info' = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

// ページ読み込み時に商品データを取得
onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }
})

// SEOメタ情報
useSeoMeta({
  title: 'ショッピングカート - ShopName',
  description: 'カート内の商品を確認して、レジに進みましょう',
})
</script>

<style scoped lang="scss">
.cart-page {
  padding: 48px 5%;
  max-width: 1400px;
}

.page-header {
  margin-bottom: 32px;
}

// 空のカート
.empty-cart {
  padding: 80px 20px;
}

// カート商品一覧
.cart-items {
  .cart-item {
    border-radius: 12px;
    overflow: hidden;

    .cart-item-content {
      display: flex;
      gap: 20px;
      padding: 20px;

      @media (max-width: 600px) {
        flex-direction: column;
      }
    }

    .item-image {
      flex-shrink: 0;

      @media (max-width: 600px) {
        align-self: center;
      }
    }

    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      min-width: 180px;

      @media (max-width: 600px) {
        align-items: center;
        width: 100%;
      }
    }

    .quantity-control {
      display: flex;
      align-items: center;
      gap: 12px;

      .quantity-display {
        min-width: 30px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .item-subtotal {
      font-size: 14px;
      color: #666;

      .subtotal-price {
        font-size: 18px;
        font-weight: 700;
        color: #1976d2;
        margin-left: 8px;
      }
    }

    .stock-info {
      font-size: 12px;
      font-weight: 500;
    }
  }
}

// 注文概要
.order-summary {
  border-radius: 12px;

  .summary-title {
    font-size: 20px;
    font-weight: 700;
    padding: 20px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 14px;

    &.total {
      font-size: 16px;
      margin-top: 8px;

      .total-label {
        font-weight: 700;
      }

      .total-price {
        font-size: 24px;
        font-weight: 700;
        color: #1976d2;
      }
    }
  }

  .checkout-btn {
    text-transform: none;
    font-size: 16px;
    font-weight: 600;
    height: 50px;
  }
}

.continue-shopping-btn {
  font-weight: 700;
}
</style>
