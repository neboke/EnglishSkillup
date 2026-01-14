/**
 * 統計パネルコンポーネント
 * 全体統計とタイプ別統計を表示
 */
class StatsPanel {
  /**
   * 統計パネルのHTMLを生成
   * @param {Object} overallStats - {total, attempted, correct, accuracy}
   * @param {Object} typeStats - {verb: {...}, choice: {...}, reorder: {...}}
   * @returns {string} HTML文字列
   */
  static render(overallStats, typeStats) {
    const overallHtml = this.renderOverallStats(overallStats);
    const typeStatsHtml = this.renderTypeStats(typeStats);

    return `
      <div class="stats-panel">
        <h4>学習統計</h4>
        ${overallHtml}
        ${typeStatsHtml}
      </div>
    `;
  }

  /**
   * 全体統計のHTMLを生成
   * @param {Object} stats - {total, attempted, correct, accuracy}
   * @returns {string} HTML文字列
   */
  static renderOverallStats(stats) {
    return `
      <div class="stat-item overall-stat">
        <div class="stat-label">全体</div>
        <div class="stat-value">${stats.correct}/${stats.attempted} (${stats.accuracy}%)</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${stats.accuracy}%"></div>
        </div>
      </div>
    `;
  }

  /**
   * タイプ別統計のHTMLを生成
   * @param {Object} typeStats - {verb: {...}, choice: {...}, reorder: {...}}
   * @returns {string} HTML文字列
   */
  static renderTypeStats(typeStats) {
    const typeLabels = {
      verb: '不規則動詞',
      choice: '選択問題',
      reorder: '並び替え'
    };

    let html = '';
    Object.keys(typeStats).forEach(type => {
      const stats = typeStats[type];
      const label = typeLabels[type] || type;
      
      html += `
        <div class="stat-item type-stat">
          <div class="stat-label">${label}</div>
          <div class="stat-value">${stats.correct}/${stats.attempted} (${stats.accuracy}%)</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${stats.accuracy}%"></div>
          </div>
          <div class="stat-detail">全${stats.total}問</div>
        </div>
      `;
    });

    return html;
  }

  /**
   * 統計パネルを更新
   * @param {Object} overallStats - 全体統計
   * @param {Object} typeStats - タイプ別統計
   */
  static update(overallStats, typeStats) {
    const panel = document.getElementById('stats-panel');
    if (panel) {
      panel.innerHTML = this.render(overallStats, typeStats);
    }
  }
}

// ブラウザとNode.js（Jest）の両方で動作するようにエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StatsPanel;
}
