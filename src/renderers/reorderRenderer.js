/**
 * 並び替え問題のレンダラー
 */
class ReorderRenderer {
  /**
   * 並び替え問題のHTMLを生成
   * template内の__N__を入力フィールドに置換
   * @param {Object} question - 問題オブジェクト
   * @returns {string} HTML文字列
   */
  static render(question) {
    // template内の__N__を入力フィールドに置換
    let processedTemplate = question.template;
    
    question.blanks.forEach((blank, index) => {
      const placeholder = `__${index}__`;
      const inputHtml = `<input 
        type="text" 
        class="inline-input" 
        data-blank-index="${index}"
        autocomplete="off"
        placeholder="?"
        size="${Math.max(blank.length + 2, 5)}"
      >`;
      processedTemplate = processedTemplate.replace(placeholder, inputHtml);
    });

    return `
      <div class="question-content reorder-question">
        <div class="question-header">
          <h2>日本語を英訳してください</h2>
          <div class="prompt">${question.prompt}</div>
        </div>
        
        <div class="reorder-container">
          <div class="sentence-template">
            ${processedTemplate}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * ユーザーの回答を検証
   * @param {Object} question - 問題オブジェクト
   * @param {Array<string>} userAnswers - 入力された単語の配列
   * @returns {Object} {isCorrect: boolean, correctAnswers: Array, userCorrect: Array}
   */
  static validate(question, userAnswers) {
    const results = userAnswers.map((answer, index) => {
      const trimmed = answer.trim();
      const correct = question.blanks[index];
      // 大文字小文字を区別
      return trimmed === correct;
    });
    
    const isCorrect = results.every(r => r === true);
    
    return {
      isCorrect,
      correctAnswers: question.blanks,
      userCorrect: results
    };
  }
}

// ブラウザとNode.js（Jest）の両方で動作するようにエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReorderRenderer;
}
