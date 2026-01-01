import { defineStore } from 'pinia'
import { useProductStore } from './productStore'
import type { ActionResult } from '~/types/common'
import { ERROR_MESSAGES } from '~/constants/messages'

export interface CartItem {
  productId: number
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    error: null as string | null,
  }),

  getters: {
    totalItems: state => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    getItemQuantity: state => (productId: number) => {
      const item = state.items.find(item => item.productId === productId)
      return item ? item.quantity : 0
    },
  },

  actions: {
    addToCart(productId: number, quantity: number = 1): ActionResult {
      try {
        this.error = null

        // 商品情報を取得
        const productStore = useProductStore()
        const product = productStore.getProductById(productId)

        // 商品が存在しない場合
        if (!product) {
          this.error = ERROR_MESSAGES.PRODUCT_NOT_FOUND
          return { success: false, message: ERROR_MESSAGES.PRODUCT_NOT_FOUND }
        }

        // 在庫チェック
        if (product.stock === 0) {
          this.error = ERROR_MESSAGES.OUT_OF_STOCK
          return { success: false, message: ERROR_MESSAGES.OUT_OF_STOCK }
        }

        const existingItem = this.items.find(item => item.productId === productId)
        const currentQuantity = existingItem ? existingItem.quantity : 0
        const newQuantity = currentQuantity + quantity

        // 在庫数を超えていないかチェック
        if (newQuantity > product.stock) {
          const errorMessage = ERROR_MESSAGES.INSUFFICIENT_STOCK(product.stock)
          this.error = errorMessage
          return { success: false, message: errorMessage }
        }

        // カートに追加
        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          this.items.push({ productId, quantity })
        }

        this.saveToStorage()
        return { success: true }
      } catch (error) {
        this.error = ERROR_MESSAGES.ADD_TO_CART_FAILED
        console.error('Error adding to cart:', error)
        return { success: false, message: ERROR_MESSAGES.ADD_TO_CART_FAILED }
      }
    },

    removeFromCart(productId: number) {
      const index = this.items.findIndex(item => item.productId === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.saveToStorage()
      }
    },

    updateQuantity(productId: number, quantity: number): ActionResult {
      try {
        this.error = null

        if (quantity <= 0) {
          this.removeFromCart(productId)
          return { success: true }
        }

        // 商品情報を取得
        const productStore = useProductStore()
        const product = productStore.getProductById(productId)

        // 商品が存在しない場合
        if (!product) {
          this.error = ERROR_MESSAGES.PRODUCT_NOT_FOUND
          return { success: false, message: ERROR_MESSAGES.PRODUCT_NOT_FOUND }
        }

        // 在庫チェック
        if (quantity > product.stock) {
          const errorMessage = ERROR_MESSAGES.INSUFFICIENT_STOCK(product.stock)
          this.error = errorMessage
          return { success: false, message: errorMessage }
        }

        const item = this.items.find(item => item.productId === productId)
        if (item) {
          item.quantity = quantity
          this.saveToStorage()
          return { success: true }
        }

        return { success: false, message: ERROR_MESSAGES.CART_ITEM_NOT_FOUND }
      } catch (error) {
        this.error = ERROR_MESSAGES.UPDATE_QUANTITY_FAILED
        console.error('Error updating quantity:', error)
        return { success: false, message: ERROR_MESSAGES.UPDATE_QUANTITY_FAILED }
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          try {
            this.items = JSON.parse(savedCart)
          } catch (error) {
            console.error('Failed to load cart from localStorage:', error)
            this.items = []
          }
        }
      }
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('cart', JSON.stringify(this.items))
        } catch (error) {
          console.error('Failed to save cart to localStorage:', error)
        }
      }
    },

    clearCart() {
      this.items = []
      this.saveToStorage()
    },
  },
})
