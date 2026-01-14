/**
 * 問題管理クラス
 * JSONファイルの読み込み、フィルタリング、シャッフル
 */
class QuestionManager {
  constructor() {
    this.questions = [];
    this.defaultFiles = [
      'data/questions1.json',
      'data/questions2.json',
      'data/questions3.json',
      'data/questions4.json',
      'data/questions5.json',
      'data/questions6.json',
      'data/questions7.json',
      'data/questions8.json',
      'data/questions9.json'
    ];
  }

  /**
   * 複数のJSONファイルから問題を読み込む
   * @param {Array<string>} files - JSONファイルパスの配列（省略時はデフォルト）
   * @returns {Promise<Array>} 問題配列
   */
  async loadQuestions(files = null) {
    const filesToLoad = files || this.defaultFiles;
    
    try {
      const promises = filesToLoad.map(file => 
        fetch(file).then(res => {
          if (!res.ok) {
            throw new Error(`Failed to load ${file}`);
          }
          return res.json();
        })
      );
      
      const results = await Promise.all(promises);
      this.questions = results.flat(); // 配列を平坦化
      return this.questions;
    } catch (error) {
      console.error('Error loading questions:', error);
      throw error;
    }
  }

  /**
   * 問題タイプでフィルタリング
   * @param {Array} questions - 問題配列
   * @param {string} type - 'all', 'verb', 'choice', 'reorder'
   * @returns {Array} フィルタリングされた問題配列
   */
  filterByType(questions, type) {
    if (type === 'all') {
      return questions;
    }
    return questions.filter(q => q.type === type);
  }

  /**
   * カテゴリでフィルタリング
   * @param {Array} questions - 問題配列
   * @param {string} category - カテゴリ名
   * @returns {Array} フィルタリングされた問題配列
   */
  filterByCategory(questions, category) {
    if (!category || category === 'all') {
      return questions;
    }
    return questions.filter(q => q.category === category);
  }

  /**
   * Fisher-Yatesアルゴリズムで配列をシャッフル
   * @param {Array} array - シャッフルする配列
   * @returns {Array} シャッフルされた新しい配列
   */
  shuffle(array) {
    const shuffled = [...array]; // 元の配列を変更しない
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 全問題を取得
   * @returns {Array} 問題配列
   */
  getAllQuestions() {
    return this.questions;
  }

  /**
   * 問題IDで検索
   * @param {string} id - 問題ID
   * @returns {Object|null} 問題オブジェクトまたはnull
   */
  getQuestionById(id) {
    return this.questions.find(q => q.id === id) || null;
  }

  /**
   * タイプ別に問題数を取得
   * @returns {Object} {verb: number, choice: number, reorder: number}
   */
  getCountByType() {
    const counts = {
      verb: 0,
      choice: 0,
      reorder: 0
    };
    
    this.questions.forEach(q => {
      if (counts.hasOwnProperty(q.type)) {
        counts[q.type]++;
      }
    });
    
    return counts;
  }
}

// ブラウザとNode.js（Jest）の両方で動作するようにエクスポート
export default QuestionManager;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionManager;
}
