import { defineStore } from 'pinia'
import { useProductStore } from './productStore'

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
    addToCart(productId: number, quantity: number = 1): { success: boolean; message?: string } {
      try {
        this.error = null

        // 商品情報を取得
        const productStore = useProductStore()
        const product = productStore.getProductById(productId)

        // 商品が存在しない場合
        if (!product) {
          this.error = '商品が見つかりません'
          return { success: false, message: '商品が見つかりません' }
        }

        // 在庫チェック
        if (product.stock === 0) {
          this.error = 'この商品は売り切れです'
          return { success: false, message: 'この商品は売り切れです' }
        }

        const existingItem = this.items.find(item => item.productId === productId)
        const currentQuantity = existingItem ? existingItem.quantity : 0
        const newQuantity = currentQuantity + quantity

        // 在庫数を超えていないかチェック
        if (newQuantity > product.stock) {
          this.error = `在庫が不足しています（在庫数: ${product.stock}）`
          return {
            success: false,
            message: `在庫が不足しています（在庫数: ${product.stock}）`
          }
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
        const errorMessage = 'カートへの追加に失敗しました'
        this.error = errorMessage
        console.error('Error adding to cart:', error)
        return { success: false, message: errorMessage }
      }
    },

    removeFromCart(productId: number) {
      const index = this.items.findIndex(item => item.productId === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.saveToStorage()
      }
    },

    updateQuantity(productId: number, quantity: number): { success: boolean; message?: string } {
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
          this.error = '商品が見つかりません'
          return { success: false, message: '商品が見つかりません' }
        }

        // 在庫チェック
        if (quantity > product.stock) {
          this.error = `在庫が不足しています（在庫数: ${product.stock}）`
          return {
            success: false,
            message: `在庫が不足しています（在庫数: ${product.stock}）`
          }
        }

        const item = this.items.find(item => item.productId === productId)
        if (item) {
          item.quantity = quantity
          this.saveToStorage()
          return { success: true }
        }

        return { success: false, message: 'カート内に商品が見つかりません' }
      } catch (error) {
        const errorMessage = '数量の更新に失敗しました'
        this.error = errorMessage
        console.error('Error updating quantity:', error)
        return { success: false, message: errorMessage }
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
