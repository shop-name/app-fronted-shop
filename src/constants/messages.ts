/**
 * アプリケーション全体で使用するメッセージ定数
 */

/**
 * エラーメッセージ
 */
export const ERROR_MESSAGES = {
  // 商品関連
  PRODUCT_NOT_FOUND: '商品が見つかりません',
  PRODUCT_FETCH_FAILED: '商品の取得に失敗しました',

  // カート関連
  OUT_OF_STOCK: 'この商品は売り切れです',
  INSUFFICIENT_STOCK: (stock: number) => `在庫が不足しています（在庫数: ${stock}）`,
  CART_ITEM_NOT_FOUND: 'カート内に商品が見つかりません',
  ADD_TO_CART_FAILED: 'カートへの追加に失敗しました',
  UPDATE_QUANTITY_FAILED: '数量の更新に失敗しました',
  SAVE_TO_STORAGE_FAILED: 'カート情報の保存に失敗しました',
  LOAD_FROM_STORAGE_FAILED: 'カート情報の読み込みに失敗しました',
} as const

/**
 * 成功メッセージ
 */
export const SUCCESS_MESSAGES = {
  // カート関連
  ADDED_TO_CART: 'カートに追加しました',
  REMOVED_FROM_CART: 'カートから削除しました',
  QUANTITY_UPDATED: '数量を更新しました',
} as const
