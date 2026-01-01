import { defineStore } from 'pinia'
import type { Product } from '~/data/products'
import { mockProducts } from '~/data/products'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getProductsByBrand: state => (brand: string) => {
      return state.products.filter(product => product.brand === brand)
    },

    getProductById: state => (id: number) => {
      return state.products.find(product => product.id === id)
    },

    totalProducts: state => state.products.length,
  },

  actions: {
    // 商品一覧を取得（現在はモックデータ、将来的にはAPI呼び出し）
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        // TODO: 将来的にはAPIから取得
        // const response = await $fetch('/api/products')
        // this.products = response

        // 現在はモックデータを使用
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 300))
        this.products = mockProducts
      } catch (error) {
        this.error = '商品の取得に失敗しました'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    // 商品を追加（将来的な拡張用）
    async addProduct(product: Product) {
      // TODO: APIに商品を追加
      this.products.push(product)
    },

    // 商品を更新（将来的な拡張用）
    async updateProduct(id: number, updates: Partial<Product>) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...updates }
      }
    },

    // 商品を削除（将来的な拡張用）
    async deleteProduct(id: number) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        this.products.splice(index, 1)
      }
    },
  },
})
