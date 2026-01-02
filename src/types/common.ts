/**
 * 共通の型定義
 */

/**
 * アクション実行結果
 * ストアのアクションが返す標準的な結果型
 */
export interface ActionResult {
  /** 実行が成功したかどうか */
  success: boolean
  /** エラーメッセージ（失敗時のみ） */
  message?: string
}
