/**
 * QuestionManager のユニットテスト
 */
const QuestionManager = require('../../src/questionManager');

// fetchのモック
global.fetch = jest.fn();

describe('QuestionManager', () => {
  let manager;
  
  beforeEach(() => {
    manager = new QuestionManager();
    fetch.mockClear();
  });

  describe('JSON読み込み', () => {
    test('should load all question files', async () => {
      // モックデータ
      const mockData1 = [{id: 'verb_001', type: 'verb'}];
      const mockData2 = [{id: 'choice_001', type: 'choice'}];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2
      });
      
      // 2ファイルのみロード（テスト用）
      const questions = await manager.loadQuestions(['data/questions1.json', 'data/questions5.json']);
      
      expect(questions).toHaveLength(2);
      expect(questions[0].id).toBe('verb_001');
      expect(questions[1].id).toBe('choice_001');
    });

    test('should handle fetch errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(manager.loadQuestions(['data/invalid.json']))
        .rejects.toThrow();
    });
  });

  describe('タイプ別フィルタリング', () => {
    test('should filter by question type', () => {
      const questions = [
        {id: 'verb_001', type: 'verb'},
        {id: 'verb_002', type: 'verb'},
        {id: 'choice_001', type: 'choice'},
        {id: 'reorder_001', type: 'reorder'}
      ];
      
      const verbOnly = manager.filterByType(questions, 'verb');
      expect(verbOnly).toHaveLength(2);
      expect(verbOnly.every(q => q.type === 'verb')).toBe(true);
      
      const choiceOnly = manager.filterByType(questions, 'choice');
      expect(choiceOnly).toHaveLength(1);
    });

    test('should return all questions when type is "all"', () => {
      const questions = [
        {id: 'verb_001', type: 'verb'},
        {id: 'choice_001', type: 'choice'}
      ];
      
      const all = manager.filterByType(questions, 'all');
      expect(all).toHaveLength(2);
    });
  });

  describe('ランダムシャッフル', () => {
    test('should shuffle questions randomly', () => {
      const questions = [
        {id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}
      ];
      
      const shuffled = manager.shuffle([...questions]);
      
      expect(shuffled).toHaveLength(questions.length);
      // 全ての要素が含まれているか確認
      questions.forEach(q => {
        expect(shuffled.find(s => s.id === q.id)).toBeDefined();
      });
    });

    test('should not modify original array', () => {
      const questions = [{id: '1'}, {id: '2'}, {id: '3'}];
      const original = [...questions];
      
      manager.shuffle(questions);
      
      expect(questions).toEqual(original);
    });
  });

  describe('統合フィルタリング', () => {
    test('should apply multiple filters', () => {
      const questions = [
        {id: 'verb_001', type: 'verb', category: 'irregular_verbs'},
        {id: 'verb_002', type: 'verb', category: 'irregular_verbs'},
        {id: 'choice_001', type: 'choice', category: 'grammar'}
      ];
      
      // タイプでフィルタリング
      const filtered = manager.filterByType(questions, 'verb');
      expect(filtered).toHaveLength(2);
    });
  });
});
