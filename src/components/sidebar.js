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
        </div>

        <div class="sidebar-content">
          <!-- 出題モード選択 -->
          <div class="mode-section">
            <h4>出題モード</h4>
            <div class="mode-options">
              <label class="mode-option">
                <input type="radio" name="exam-mode" value="finals" checked>
                <span>最終対策</span>
              </label>
              <label class="mode-option">
                <input type="radio" name="exam-mode" value="term">
                <span>200語習得</span>
              </label>
            </div>
          </div>

          <!-- 最終対策モード -->
          <div id="finals-mode" class="exam-mode-content">
            <!-- 問題ファイル選択 -->
            <div class="file-section">
              <h4>出題内容</h4>
              <div class="file-toggle">
                <label class="toggle-option">
                  <input type="radio" name="question-file" value="verbs" checked>
                  <span>不規則動詞</span>
                </label>
                <label class="toggle-option">
                  <input type="radio" name="question-file" value="sentences">
                  <span>英文法（文型）</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 200語習得モード -->
          <div id="term-mode" class="exam-mode-content" style="display: none;">
            <!-- Term選択 -->
            <div class="term-section">
              <h4>学習章を選択</h4>
              <div class="term-options">
                <label class="term-option">
                  <input type="radio" name="term" value="term1" checked>
                  <span>Term1 基礎200語</span>
                </label>
                <label class="term-option">
                  <input type="radio" name="term" value="term2">
                  <span>Term2 基礎200語</span>
                </label>
                <label class="term-option">
                  <input type="radio" name="term" value="term3">
                  <span>Term3 基礎200語</span>
                </label>
              </div>
            </div>
          </div>

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
   * 出題モード変更イベントリスナーを設定
   * @param {Function} callback - (mode) => void
   */
  static onExamModeChange(callback) {
    const modeInputs = document.querySelectorAll('input[name="exam-mode"]');
    modeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        callback(e.target.value);
      });
    });
  }

  /**
   * Term選択変更イベントリスナーを設定
   * @param {Function} callback - (termId) => void
   */
  static onTermChange(callback) {
    const termInputs = document.querySelectorAll('input[name="term"]');
    termInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        callback(e.target.value);
      });
    });
  }

  /**
   * ファイル選択変更イベントリスナーを設定
   * @param {Function} callback - (fileType) => void
   */
  static onFileChange(callback) {
    const fileInputs = document.querySelectorAll('input[name="question-file"]');
    fileInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        callback(e.target.value);
      });
    });
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
   * サイドバートグル機能を設定
   */
  static setupToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('mobile-menu-toggle');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
      });
    }

    // 背景クリックで閉じる
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !toggleBtn?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
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
   * 現在選択されている出題モードを取得
   * @returns {string} 出題モード ('finals' or 'term')
   */
  static getSelectedExamMode() {
    const selected = document.querySelector('input[name="exam-mode"]:checked');
    return selected ? selected.value : 'finals';
  }

  /**
   * 現在選択されているTermを取得
   * @returns {string} Term ID ('term1', 'term2', ...)
   */
  static getSelectedTerm() {
    const selected = document.querySelector('input[name="term"]:checked');
    return selected ? selected.value : 'term1';
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
