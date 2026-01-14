/**
 * 問題カードコンポーネント
 * 問題の表示エリア
 */
class QuizCard {
  /**
   * 問題カードのHTMLを生成
   * @returns {string} HTML文字列
   */
  static render() {
    return `
      <div class="quiz-card">
        <div class="quiz-header">
          <div class="progress-info" id="progress-info">問題 1 / 124</div>
          <div class="score-info" id="score-info">
            <span class="correct-count">正解: 0</span>
            <span class="incorrect-count">不正解: 0</span>
          </div>
        </div>

        <div class="quiz-content" id="quiz-content">
          <!-- レンダラーで生成されたコンテンツ -->
        </div>

        <div class="quiz-actions">
          <button class="btn btn-primary" id="check-btn">確認</button>
          <button class="btn btn-success" id="next-btn" style="display: none;">次へ</button>
        </div>

        <div class="result-message" id="result-message"></div>
      </div>
    `;
  }

  /**
   * 問題コンテンツを更新
   * @param {string} html - レンダラーが生成したHTML
   */
  static updateContent(html) {
    const content = document.getElementById('quiz-content');
    if (content) {
      content.innerHTML = html;
    }
  }

  /**
   * 進行状況を更新
   * @param {number} current - 現在の問題番号（1-indexed）
   * @param {number} total - 総問題数
   */
  static updateProgress(current, total) {
    const progressInfo = document.getElementById('progress-info');
    if (progressInfo) {
      progressInfo.textContent = `問題 ${current} / ${total}`;
    }
  }

  /**
   * スコアを更新
   * @param {number} correct - 正解数
   * @param {number} incorrect - 不正解数
   */
  static updateScore(correct, incorrect) {
    const scoreInfo = document.getElementById('score-info');
    if (scoreInfo) {
      scoreInfo.innerHTML = `
        <span class="correct-count">正解: ${correct}</span>
        <span class="incorrect-count">不正解: ${incorrect}</span>
      `;
    }
  }

  /**
   * 結果メッセージを表示
   * @param {boolean} isCorrect - 正解かどうか
   * @param {string} message - メッセージ
   */
  static showResult(isCorrect, message) {
    const resultDiv = document.getElementById('result-message');
    if (resultDiv) {
      resultDiv.className = `result-message ${isCorrect ? 'correct' : 'incorrect'} show`;
      resultDiv.innerHTML = message;
    }
  }

  /**
   * 結果メッセージを非表示
   */
  static hideResult() {
    const resultDiv = document.getElementById('result-message');
    if (resultDiv) {
      resultDiv.className = 'result-message';
      resultDiv.innerHTML = '';
    }
  }

  /**
   * ボタンの表示を切り替え
   * @param {boolean} showCheck - 確認ボタンを表示
   * @param {boolean} showNext - 次へボタンを表示
   */
  static toggleButtons(showCheck, showNext) {
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (checkBtn) {
      checkBtn.style.display = showCheck ? 'block' : 'none';
    }
    if (nextBtn) {
      nextBtn.style.display = showNext ? 'block' : 'none';
    }
  }

  /**
   * 完了画面を表示
   * @param {number} correct - 正解数
   * @param {number} total - 総問題数
   * @param {Array} incorrectQuestions - 間違えた問題のリスト
   */
  static showCompletion(correct, total, incorrectQuestions) {
    const accuracy = Math.round((correct / total) * 100);
    const content = document.getElementById('quiz-content');
    
    let incorrectListHtml = '';
    if (incorrectQuestions.length > 0) {
      incorrectListHtml = `
        <div class="incorrect-list">
          <h3>間違えた問題:</h3>
          <table class="incorrect-table">
            <thead>
              <tr>
                <th>問題ID</th>
                <th>タイプ</th>
                <th>内容</th>
              </tr>
            </thead>
            <tbody>
              ${incorrectQuestions.map(q => `
                <tr>
                  <td>${q.id}</td>
                  <td>${this.getTypeLabel(q.type)}</td>
                  <td>${this.getQuestionSummary(q)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
    
    if (content) {
      content.innerHTML = `
        <div class="completion-screen">
          <h2>🎉 完了しました！</h2>
          <div class="completion-stats">
            <p class="accuracy">正解率: ${accuracy}%</p>
            <p class="score">正解: ${correct}問 / 不正解: ${total - correct}問</p>
          </div>
          ${incorrectListHtml}
          <button class="btn btn-primary" id="restart-btn">最初から</button>
        </div>
      `;
    }
    
    this.toggleButtons(false, false);
  }

  /**
   * タイプラベルを取得
   */
  static getTypeLabel(type) {
    const labels = {
      verb: '不規則動詞',
      choice: '選択',
      reorder: '並び替え'
    };
    return labels[type] || type;
  }

  /**
   * 問題の要約を取得
   */
  static getQuestionSummary(question) {
    switch (question.type) {
      case 'verb':
        return question.base;
      case 'choice':
      case 'reorder':
        return question.prompt;
      default:
        return question.id;
    }
  }
}

// ブラウザとNode.js（Jest）の両方で動作するようにエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuizCard;
}
