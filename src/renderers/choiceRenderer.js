/**
 * 選択問題のレンダラー
 */
class ChoiceRenderer {
  /**
   * 選択問題のHTMLを生成
   * @param {Object} question - 問題オブジェクト
   * @returns {string} HTML文字列
   */
  static render(question) {
    const choicesHtml = question.choices.map((choice, index) => `
      <div class="choice-option">
        <input 
          type="radio" 
          id="choice-${index}" 
          name="choice-answer" 
          value="${this.escapeHtml(choice)}"
          class="choice-radio"
        >
        <label for="choice-${index}">${this.escapeHtml(choice)}</label>
      </div>
    `).join('');

    return `
      <div class="question-content choice-question">
        <div class="question-header">
          <h2>日本語を英訳してください</h2>
          <div class="prompt">${question.prompt}</div>
        </div>
        
        <div class="choices-container">
          ${choicesHtml}
        </div>
      </div>
    `;
  }

  /**
   * ユーザーの回答を検証
   * @param {Object} question - 問題オブジェクト
   * @param {string} userAnswer - 選択された回答
   * @returns {Object} {isCorrect: boolean, correctAnswer: string}
   */
  static validate(question, userAnswer) {
    const trimmedAnswer = userAnswer.trim();
    const isCorrect = trimmedAnswer === question.answer;
    
    return {
      isCorrect,
      correctAnswer: question.answer
    };
  }

  /**
   * HTMLエスケープ
   * @param {string} text - エスケープするテキスト
   * @returns {string} エスケープされたテキスト
   */
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ブラウザとNode.js（Jest）の両方で動作するようにエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChoiceRenderer;
}
