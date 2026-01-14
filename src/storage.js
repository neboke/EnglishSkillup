/**
 * LocalStorage管理クラス
 * 問題ごとの統計データを保存・取得・集計
 */
class StorageManager {
  constructor() {
    this.STATS_KEY = 'questionStats';
    this.SETTINGS_KEY = 'settings';
  }

  /**
   * 問題の回答結果を記録
   * @param {string} questionId - 問題ID
   * @param {boolean} isCorrect - 正解かどうか
   */
  recordAnswer(questionId, isCorrect) {
    const allStats = this.getAllStats();
    
    if (!allStats[questionId]) {
      allStats[questionId] = {
        attempts: 0,
        correct: 0
      };
    }
    
    allStats[questionId].attempts += 1;
    if (isCorrect) {
      allStats[questionId].correct += 1;
    }
    
    this.saveAllStats(allStats);
  }

  /**
   * 特定の問題の統計を取得
   * @param {string} questionId - 問題ID
   * @returns {Object|null} {attempts, correct} または null
   */
  getQuestionStats(questionId) {
    const allStats = this.getAllStats();
    return allStats[questionId] || null;
  }

  /**
   * 問題の正答率を計算
   * @param {string} questionId - 問題ID
   * @returns {number|null} 0-100の正答率、試行なしの場合はnull
   */
  getAccuracy(questionId) {
    const stats = this.getQuestionStats(questionId);
    if (!stats || stats.attempts === 0) {
      return null;
    }
    return Math.round((stats.correct / stats.attempts) * 100);
  }

  /**
   * 正答率が閾値未満の問題をフィルタリング
   * @param {Array} questions - 問題配列
   * @param {number} threshold - 閾値（0-100）
   * @returns {Array} フィルタリングされた問題配列
   */
  filterByAccuracyThreshold(questions, threshold) {
    return questions.filter(q => {
      const accuracy = this.getAccuracy(q.id);
      // 試行なしの問題は含めない
      if (accuracy === null) return false;
      // 閾値未満の問題のみ
      return accuracy < threshold;
    });
  }

  /**
   * 問題タイプ別の統計を計算
   * @param {Array} questions - 問題配列
   * @returns {Object} タイプごとの統計 {type: {total, correct, attempted, accuracy}}
   */
  getStatsByType(questions) {
    const stats = {};
    
    questions.forEach(q => {
      if (!stats[q.type]) {
        stats[q.type] = {
          total: 0,
          attempted: 0,
          correct: 0
        };
      }
      
      stats[q.type].total += 1;
      
      const qStats = this.getQuestionStats(q.id);
      if (qStats && qStats.attempts > 0) {
        stats[q.type].attempted += 1;
        // 問題単位で100%の場合のみカウント
        if (qStats.correct === qStats.attempts) {
          stats[q.type].correct += 1;
        }
      }
    });
    
    // 正答率を計算
    Object.keys(stats).forEach(type => {
      const s = stats[type];
      s.accuracy = s.attempted > 0 
        ? Math.round((s.correct / s.attempted) * 100)
        : 0;
    });
    
    return stats;
  }

  /**
   * 全体の統計を取得（タイプに関わらず）
   * @param {Array} questions - 全問題配列
   * @returns {Object} {total, attempted, correct, accuracy}
   */
  getOverallStats(questions) {
    let total = questions.length;
    let attempted = 0;
    let correct = 0;
    
    questions.forEach(q => {
      const qStats = this.getQuestionStats(q.id);
      if (qStats && qStats.attempts > 0) {
        attempted += 1;
        // 問題単位で100%の場合のみカウント
        if (qStats.correct === qStats.attempts) {
          correct += 1;
        }
      }
    });
    
    const accuracy = attempted > 0 
      ? Math.round((correct / attempted) * 100)
      : 0;
    
    return { total, attempted, correct, accuracy };
  }

  /**
   * 全統計データを削除
   */
  clearAll() {
    localStorage.removeItem(this.STATS_KEY);
  }

  /**
   * 設定を保存
   * @param {Object} settings - {filterType, accuracyThreshold}
   */
  saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  /**
   * 設定を取得
   * @returns {Object} {filterType, accuracyThreshold}
   */
  getSettings() {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    if (!data) {
      return {
        filterType: 'all',
        accuracyThreshold: 80
      };
    }
    return JSON.parse(data);
  }

  // プライベートメソッド

  getAllStats() {
    const data = localStorage.getItem(this.STATS_KEY);
    return data ? JSON.parse(data) : {};
  }

  saveAllStats(stats) {
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }
}

// ブラウザとNode.js（Jest）の両方で動作するようにエクスポート
export default StorageManager;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
