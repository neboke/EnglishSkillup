/**
 * StorageManager のユニットテスト
 */
const StorageManager = require('../../src/storage');

describe('StorageManager', () => {
  let storage;
  
  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear();
    storage = new StorageManager();
  });

  describe('統計の保存と取得', () => {
    test('should save and retrieve question stats', () => {
      storage.recordAnswer('verb_001', true);
      const stats = storage.getQuestionStats('verb_001');
      expect(stats.attempts).toBe(1);
      expect(stats.correct).toBe(1);
    });

    test('should accumulate multiple attempts', () => {
      storage.recordAnswer('verb_001', true);
      storage.recordAnswer('verb_001', false);
      storage.recordAnswer('verb_001', true);
      const stats = storage.getQuestionStats('verb_001');
      expect(stats.attempts).toBe(3);
      expect(stats.correct).toBe(2);
    });
  });

  describe('正答率計算', () => {
    test('should calculate 100% accuracy when all correct', () => {
      storage.recordAnswer('verb_001', true);
      storage.recordAnswer('verb_001', true);
      const accuracy = storage.getAccuracy('verb_001');
      expect(accuracy).toBe(100);
    });

    test('should calculate 0% accuracy when all incorrect', () => {
      storage.recordAnswer('verb_001', false);
      storage.recordAnswer('verb_001', false);
      const accuracy = storage.getAccuracy('verb_001');
      expect(accuracy).toBe(0);
    });

    test('should return null for questions with no attempts', () => {
      const accuracy = storage.getAccuracy('verb_999');
      expect(accuracy).toBeNull();
    });
  });

  describe('閾値フィルタリング', () => {
    test('should filter questions below threshold', () => {
      storage.recordAnswer('verb_001', true);
      storage.recordAnswer('verb_002', false);
      storage.recordAnswer('verb_003', true);
      storage.recordAnswer('verb_003', true);
      
      const allQuestions = [{id: 'verb_001'}, {id: 'verb_002'}, {id: 'verb_003'}];
      const filtered = storage.filterByAccuracyThreshold(allQuestions, 80);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('verb_002');
    });
  });

  describe('タイプ別統計', () => {
    test('should calculate stats by question type', () => {
      const questions = [
        {id: 'verb_001', type: 'verb'},
        {id: 'verb_002', type: 'verb'},
        {id: 'choice_001', type: 'choice'}
      ];
      storage.recordAnswer('verb_001', true);
      storage.recordAnswer('verb_002', false);
      storage.recordAnswer('choice_001', true);
      
      const stats = storage.getStatsByType(questions);
      expect(stats.verb.total).toBe(2);
      expect(stats.verb.correct).toBe(1);
      expect(stats.verb.accuracy).toBe(50);
      expect(stats.choice.total).toBe(1);
      expect(stats.choice.correct).toBe(1);
      expect(stats.choice.accuracy).toBe(100);
    });
  });

  describe('全データ削除', () => {
    test('should clear all stats', () => {
      storage.recordAnswer('verb_001', true);
      storage.recordAnswer('verb_002', false);
      storage.clearAll();
      
      const stats1 = storage.getQuestionStats('verb_001');
      const stats2 = storage.getQuestionStats('verb_002');
      expect(stats1).toBeNull();
      expect(stats2).toBeNull();
    });
  });
});
