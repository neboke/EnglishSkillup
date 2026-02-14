/**
 * タイピング問題レンダラー
 * 日本語を表示して英語をタイピングさせる
 */
class TypingRenderer {
  /**
   * タイピング問題を描画
   * @param {Object} question - 問題オブジェクト
   * @param {string} question.id - 問題ID
   * @param {string} question.japanese - 日本語（出題文）
   * @param {string} question.english - 英語（回答）
   * @param {string} question.category - カテゴリ
   * @param {string} question.categoryName - カテゴリ名
   * @returns {string} HTML文字列
   */
  static render(question) {
    const promptLabel = question.promptLabel || '日本語:';
    const answerLabel = question.answerLabel || '英語をタイプしてください:';
    const promptText = question.promptText ?? question.japanese ?? '';

    return `
      <div class="typing-question">
        <div class="question-category">
          ${question.categoryName ? `${question.categoryName} (${question.category})` : question.category || ''}
        </div>
        
        <div class="question-prompt">
          <div class="label">${this.escapeHtml(promptLabel)}</div>
          <div class="japanese-text">${this.escapeHtml(promptText)}</div>
        </div>

        <div class="answer-input-section">
          <div class="label">${this.escapeHtml(answerLabel)}</div>
          <input 
            type="text" 
            id="typing-input" 
            class="typing-input" 
            placeholder="英単語を入力..."
            autocomplete="off"
          >
        </div>

        <div class="hint-section" id="hint-section" style="display: none;">
          <div class="label">ヒント:</div>
          <div class="hint-text" id="hint-text"></div>
        </div>
      </div>
    `;
  }

  /**
   * 回答をチェック
   * @param {Object} question - 問題オブジェクト
   * @returns {Object} {isCorrect: boolean, userAnswer: string}
   */
  static getAnswer(question) {
    const input = document.getElementById('typing-input');
    const userAnswer = input ? input.value.trim().toLowerCase() : '';
    const correctAnswer = question.english.toLowerCase();
    
    return {
      isCorrect: userAnswer === correctAnswer,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer
    };
  }

  /**
   * バリデーション（QuizApp から呼ばれる）
   * @param {Object} question - 問題オブジェクト
   * @param {string} userAnswer - 入力値
   * @returns {Object} {isCorrect, userAnswer, correctAnswer}
   */
  static validate(question, userAnswer) {
    const normalize = (value, lang = 'en') => {
      const text = String(value || '').trim().replace(/\s+/g, ' ');
      return lang === 'ja' ? text : text.toLowerCase();
    };

    const answerLang = question.answerLang || 'en';
    const candidates = Array.isArray(question.acceptableAnswers)
      ? question.acceptableAnswers
      : [question.answerText ?? question.english ?? ''];

    const normalizedAnswer = normalize(userAnswer, answerLang);
    const normalizedCandidates = candidates.map(candidate => normalize(candidate, answerLang));
    const isCorrect = normalizedCandidates.includes(normalizedAnswer);

    return {
      isCorrect,
      userAnswer: normalizedAnswer,
      correctAnswer: candidates[0] || ''
    };
  }

  /**
   * 結果を表示
   * @param {Object} result - {isCorrect, userAnswer, correctAnswer}
   * @param {Object} question - 問題オブジェクト
   */
  static showResult(result, question) {
    const input = document.getElementById('typing-input');
    const hintSection = document.getElementById('hint-section');
    const hintText = document.getElementById('hint-text');
    
    if (input) {
      input.disabled = true;
      if (result.isCorrect) {
        input.classList.add('correct');
      } else {
        input.classList.add('incorrect');
      }
    }

    // 不正解の場合、ヒントを表示
    if (!result.isCorrect && hintSection && hintText) {
      hintSection.style.display = 'block';
      hintText.textContent = `正解: ${result.correctAnswer}`;
    }
  }

  /**
   * 入力をリセット
   */
  static reset() {
    const input = document.getElementById('typing-input');
    if (input) {
      input.value = '';
      input.disabled = false;
      input.classList.remove('correct', 'incorrect');
    }

    const hintSection = document.getElementById('hint-section');
    if (hintSection) {
      hintSection.style.display = 'none';
    }
  }

  /**
   * HTMLエスケープ
   * @param {string} text - エスケープする文字列
   * @returns {string} エスケープされた文字列
   */
  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// ブラウザとNode.js（Jest）の両方で動作するようにエクスポート
export default TypingRenderer;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TypingRenderer;
}
