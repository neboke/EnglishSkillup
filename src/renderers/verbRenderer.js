/**
 * 不規則動詞問題のレンダラー
 */
class VerbRenderer {
  /**
   * 不規則動詞問題のHTMLを生成
   * @param {Object} question - 問題オブジェクト
   * @returns {string} HTML文字列
   */
  static render(question) {
    return `
      <div class="question-content verb-question">
        <div class="question-header">
          <h2>原形</h2>
          <div class="base-form">${question.base}</div>
          <div class="meaning">${question.meaning}</div>
        </div>
        
        <div class="input-group">
          <label for="past-input">過去形:</label>
          <input 
            type="text" 
            id="past-input" 
            class="answer-input" 
            data-answer-key="past"
            autocomplete="off"
            placeholder="過去形を入力"
          >
        </div>
        
        <div class="input-group">
          <label for="past-participle-input">過去分詞:</label>
          <input 
            type="text" 
            id="past-participle-input" 
            class="answer-input" 
            data-answer-key="pastParticiple"
            autocomplete="off"
            placeholder="過去分詞を入力"
          >
        </div>
      </div>
    `;
  }

  /**
   * ユーザーの回答を検証
   * @param {Object} question - 問題オブジェクト
   * @param {Object} userAnswers - {past: string, pastParticiple: string}
   * @returns {Object} {isCorrect: boolean, correctAnswers: Object}
   */
  static validate(question, userAnswers) {
    const trimmedPast = userAnswers.past.trim();
    const trimmedPastPart = userAnswers.pastParticiple.trim();
    
    // 複数形式対応（例: "was/were"）
    const correctPastOptions = question.past.split('/').map(s => s.trim());
    const correctPartOptions = question.pastParticiple.split('/').map(s => s.trim());
    
    const isPastCorrect = correctPastOptions.includes(trimmedPast);
    const isPartCorrect = correctPartOptions.includes(trimmedPastPart);
    
    return {
      isCorrect: isPastCorrect && isPartCorrect,
      correctAnswers: {
        past: question.past,
        pastParticiple: question.pastParticiple
      },
      userCorrect: {
        past: isPastCorrect,
        pastParticiple: isPartCorrect
      }
    };
  }
}

// ブラウザとNode.js（Jest）の両方で動作するようにエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VerbRenderer;
}
