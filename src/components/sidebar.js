/**
 * サイドバーコンポーネント
 * フィルター選択、閾値設定、全削除ボタン
 */
class Sidebar {
  /**
   * サイドバーのHTMLを生成
   * @returns {string} HTML文字列
   */
  static render() {
    return `
      <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <h3>設定</h3>
          <button class="sidebar-toggle" id="sidebar-toggle">
            <span class="toggle-icon">☰</span>
          </button>
        </div>

        <div class="sidebar-content">
          <!-- フィルター選択 -->
          <div class="filter-section">
            <h4>問題範囲</h4>
            <div class="filter-options">
              <label class="filter-option">
                <input type="radio" name="filter" value="all" checked>
                <span>すべての問題</span>
              </label>
              <label class="filter-option">
                <input type="radio" name="filter" value="verb">
                <span>不規則動詞</span>
              </label>
              <label class="filter-option">
                <input type="radio" name="filter" value="choice">
                <span>選択問題</span>
              </label>
              <label class="filter-option">
                <input type="radio" name="filter" value="reorder">
                <span>並び替え問題</span>
              </label>
              <label class="filter-option">
                <input type="radio" name="filter" value="incorrect">
                <span>間違えた問題のみ</span>
              </label>
            </div>
          </div>

          <!-- 正答率閾値設定 -->
          <div class="threshold-section">
            <h4>間違えた問題の基準</h4>
            <label for="accuracy-threshold">正答率が次の値未満:</label>
            <select id="accuracy-threshold" class="threshold-select">
              <option value="100">100%</option>
              <option value="80" selected>80%</option>
              <option value="60">60%</option>
              <option value="40">40%</option>
              <option value="20">20%</option>
            </select>
          </div>

          <!-- 統計表示エリア -->
          <div class="stats-section" id="stats-panel">
            <!-- StatsPanel.render()で動的に生成 -->
          </div>

          <!-- 全削除ボタン -->
          <div class="actions-section">
            <button class="btn-danger" id="clear-all-btn">
              すべてのデータを削除
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * フィルター変更イベントリスナーを設定
   * @param {Function} callback - (filterType) => void
   */
  static onFilterChange(callback) {
    const filterInputs = document.querySelectorAll('input[name="filter"]');
    filterInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        callback(e.target.value);
      });
    });
  }

  /**
   * 閾値変更イベントリスナーを設定
   * @param {Function} callback - (threshold) => void
   */
  static onThresholdChange(callback) {
    const select = document.getElementById('accuracy-threshold');
    if (select) {
      select.addEventListener('change', (e) => {
        callback(parseInt(e.target.value));
      });
    }
  }

  /**
   * 全削除ボタンのイベントリスナーを設定
   * @param {Function} callback - () => void
   */
  static onClearAll(callback) {
    const btn = document.getElementById('clear-all-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (confirm('本当にすべてのデータを削除しますか？この操作は取り消せません。')) {
          callback();
        }
      });
    }
  }

  /**
   * サイドバートグルのイベントリスナーを設定
   */
  static setupToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }
  }

  /**
   * 現在選択されているフィルタータイプを取得
   * @returns {string} フィルタータイプ
   */
  static getSelectedFilter() {
    const selected = document.querySelector('input[name="filter"]:checked');
    return selected ? selected.value : 'all';
  }

  /**
   * 現在の閾値を取得
   * @returns {number} 閾値
   */
  static getThreshold() {
    const select = document.getElementById('accuracy-threshold');
    return select ? parseInt(select.value) : 80;
  }
}

// ブラウザとNode.js（Jest）の両方で動作するようにエクスポート
export default Sidebar;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sidebar;
}
