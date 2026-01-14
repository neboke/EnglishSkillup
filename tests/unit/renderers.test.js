/**
 * Renderers のユニットテスト
 */

// DOM環境のセットアップ
document.body.innerHTML = '<div id="quiz-container"></div>';

describe('VerbRenderer', () => {
  let VerbRenderer;
  
  beforeAll(() => {
    // ブラウザ環境をシミュレート
    if (typeof window === 'undefined') {
      global.window = {};
    }
  });

  test('should render verb question with two input fields', () => {
    const question = {
      id: 'verb_001',
      type: 'verb',
      base: 'stand',
      meaning: '立っている'
    };
    
    // TODO: レンダラー実装後にテスト有効化
    // const html = VerbRenderer.render(question);
    // expect(html).toContain('stand');
    // expect(html).toContain('立っている');
    // expect(html).toContain('input');
  });
});

describe('ChoiceRenderer', () => {
  test('should render choice question with radio buttons', () => {
    const question = {
      id: 'choice_001',
      type: 'choice',
      prompt: '彼は毎日学校に行きます',
      choices: ['He go...', 'He goes...', 'He going...'],
      answer: 'He goes...'
    };
    
    // TODO: レンダラー実装後にテスト有効化
    // const html = ChoiceRenderer.render(question);
    // expect(html).toContain('彼は毎日学校に行きます');
    // expect(html).toContain('radio');
  });
});

describe('ReorderRenderer', () => {
  test('should render reorder question with inline input fields', () => {
    const question = {
      id: 'reorder_001',
      type: 'reorder',
      prompt: 'あなたは学生ですね',
      template: 'You are __0__ __1__, aren\'t you?',
      blanks: ['a', 'student']
    };
    
    // TODO: レンダラー実装後にテスト有効化
    // const html = ReorderRenderer.render(question);
    // expect(html).toContain('You are');
    // expect(html).toContain('input');
    // expect(html).toContain('aren\'t you?');
  });

  test('should replace __N__ with input fields', () => {
    const question = {
      id: 'reorder_002',
      type: 'reorder',
      prompt: 'テスト',
      template: 'Hello __0__ world __1__!',
      blanks: ['my', 'friend']
    };
    
    // TODO: レンダラー実装後にテスト有効化
    // const html = ReorderRenderer.render(question);
    // 2つの入力フィールドが含まれるべき
    // const inputCount = (html.match(/<input/g) || []).length;
    // expect(inputCount).toBe(2);
  });
});
