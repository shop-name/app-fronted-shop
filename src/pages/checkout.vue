<template>
  <v-container class="checkout-page">
    <!-- ページヘッダー -->
    <div class="page-header">
      <h1 class="page-title">注文内容の確認</h1>
      <p class="page-subtitle">
        ご注文内容にお間違いがないか、最後にご確認ください。
      </p>
    </div>

    <!-- カートが空の場合（注文処理中は表示しない） -->
    <v-row v-if="cartStore.items.length === 0 && !isProcessingOrder" justify="center">
      <v-col cols="12" md="8" class="text-center empty-cart">
        <v-icon size="80" color="grey-lighten-1">mdi-cart-outline</v-icon>
        <h2 class="mt-4 text-grey">カートが空です</h2>
        <p class="text-grey-darken-1 mt-2">注文する商品がありません</p>
        <v-btn color="primary" size="large" class="mt-6" to="/">
          商品一覧へ戻る
        </v-btn>
      </v-col>
    </v-row>

    <!-- 注文内容がある場合 -->
    <v-row v-else>
      <!-- 注文商品一覧（左側） -->
      <v-col cols="12" md="8">
        <div class="order-items-section">
          <v-card
            v-for="item in cartItems"
            :key="item.product.id"
            class="order-item mb-4"
            elevation="2"
          >
            <div class="order-item-content">
              <!-- 商品画像 -->
              <div class="item-image">
                <v-img
                  :src="item.product.image"
                  :alt="item.product.name"
                  width="100"
                  height="100"
                  cover
                />
              </div>

              <!-- 商品情報 -->
              <div class="item-info">
                <div class="product-brand">{{ item.product.brand }}</div>
                <h3 class="product-name">{{ item.product.name }}</h3>
                <div class="item-quantity mt-2">
                  数量: {{ item.quantity }}点
                </div>
              </div>

              <!-- 金額 -->
              <div class="item-price">
                <div class="unit-price">
                  ¥{{ item.product.price.toLocaleString() }} ×
                  {{ item.quantity }}
                </div>
                <div class="subtotal-price mt-1">
                  ¥{{ (item.product.price * item.quantity).toLocaleString() }}
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>

      <!-- 請求額の内訳（右側） -->
      <v-col cols="12" md="4">
        <v-card class="billing-summary" elevation="3">
          <v-card-title class="summary-title">請求額の内訳</v-card-title>
          <v-card-text>
            <div class="summary-row">
              <span>小計（商品合計）</span>
              <span>¥{{ subtotal.toLocaleString() }}</span>
            </div>
            <div class="summary-row">
              <span>配送料</span>
              <span>¥{{ shippingFee.toLocaleString() }}</span>
            </div>
            <div class="summary-row">
              <span>消費税（10%）</span>
              <span>¥{{ tax.toLocaleString() }}</span>
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
              class="confirm-btn"
              @click="confirmOrder"
            >
              <v-icon left>mdi-check-circle</v-icon>
              注文を確定する
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- カートに戻るボタン -->
        <v-btn
          variant="text"
          color="primary"
          block
          class="mt-3 back-to-cart-btn"
          to="/cart"
        >
          <v-icon left size="small">mdi-arrow-left</v-icon>
          カートに戻る
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Product } from '~/data/products'
import { useCartStore } from '~/stores/cartStore'
import { useProductStore } from '~/stores/productStore'

const cartStore = useCartStore()
const productStore = useProductStore()
const router = useRouter()

const isProcessingOrder = ref(false)

// カート内の商品情報を取得
const cartItems = computed(() => {
  return cartStore.items
    .map(item => {
      const product = productStore.getProductById(item.productId)
      return {
        product: product as Product,
        quantity: item.quantity,
      }
    })
    .filter(item => item.product) // 商品が見つからない場合は除外
})

// 小計の計算
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)
})

// 配送料（固定）
const shippingFee = computed(() => {
  return 500
})

// 消費税の計算（10%）
const tax = computed(() => {
  return Math.round((subtotal.value + shippingFee.value) * 0.1)
})

// 合計金額の計算
const total = computed(() => {
  return subtotal.value + shippingFee.value + tax.value
})

// 注文を確定
const confirmOrder = () => {
  // 実際の決済処理はここに実装
  // 現在はモック処理

  // 注文処理中フラグを立てる
  isProcessingOrder.value = true

  // カートをクリア
  cartStore.clearCart()

  // 注文完了を示すクエリパラメータ付きでトップページに遷移
  router.push('/?orderCompleted=true')
}

// ページ読み込み時に商品データを取得
onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }
})

// SEOメタ情報
useSeoMeta({
  title: '注文内容の確認 - ShopName',
  description: 'ご注文内容を最終確認して、注文を確定してください',
})
</script>

<style scoped lang="scss">
.checkout-page {
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

// セクションタイトル
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

// 注文商品一覧
.order-items-section {
  .order-item {
    border-radius: 12px;
    overflow: hidden;

    .order-item-content {
      display: flex;
      gap: 20px;
      padding: 20px;
      align-items: center;

      @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
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

    .item-quantity {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .item-price {
      text-align: right;
      min-width: 150px;

      @media (max-width: 600px) {
        width: 100%;
        text-align: left;
        margin-top: 16px;
      }

      .unit-price {
        font-size: 14px;
        color: #666;
      }

      .subtotal-price {
        font-size: 20px;
        font-weight: 700;
        color: #1976d2;
      }
    }
  }
}

// 請求額の内訳
.billing-summary {
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
        font-size: 28px;
        font-weight: 700;
        color: #1976d2;
      }
    }
  }

  .confirm-btn {
    text-transform: none;
    font-size: 16px;
    font-weight: 600;
    height: 50px;
  }
}

.back-to-cart-btn {
  font-weight: 700;
}
</style>
