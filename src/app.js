/**
 * メインアプリケーションクラス
 * 状態管理、イベントハンドリング、画面制御
 */

// モジュールのインポート（ブラウザ環境）
import StorageManager from './storage.js';
import QuestionManager from './questionManager.js';
import VerbRenderer from './renderers/verbRenderer.js';
import ChoiceRenderer from './renderers/choiceRenderer.js';
import ReorderRenderer from './renderers/reorderRenderer.js';
import Sidebar from './components/sidebar.js';
import StatsPanel from './components/statsPanel.js';
import QuizCard from './components/quizCard.js';

class QuizApp {
  constructor() {
    this.storage = new StorageManager();
    this.questionManager = new QuestionManager();
    
    this.allQuestions = [];
    this.currentQuestions = [];
    this.currentIndex = 0;
    this.currentQuestion = null;
    
    this.sessionCorrect = 0;
    this.sessionIncorrect = 0;
    this.sessionIncorrectQuestions = [];
    
    this.renderers = {
      verb: VerbRenderer,
      choice: ChoiceRenderer,
      reorder: ReorderRenderer
    };
  }

  /**
   * アプリ初期化
   */
  async init() {
    try {
      // UIを初期化
      this.renderUI();
      
      // 問題データを読み込み
      await this.loadQuestions();
      
      // イベントリスナーを設定
      this.setupEventListeners();
      
      // 初期フィルターを適用
      this.applyFilter();
      
      // 最初の問題を表示
      this.showCurrentQuestion();
      
    } catch (error) {
      console.error('初期化エラー:', error);
      alert('問題データの読み込みに失敗しました。');
    }
  }

  /**
   * UIをレンダリング
   */
  renderUI() {
    // サイドバー
    document.getElementById('sidebar-container').innerHTML = Sidebar.render();
    Sidebar.setupToggle();
    
    // クイズカード
    document.getElementById('quiz-card-container').innerHTML = QuizCard.render();
    
    // 統計パネルを更新
    this.updateStatsPanel();
  }

  /**
   * 問題データを読み込み
   */
  async loadQuestions() {
    this.allQuestions = await this.questionManager.loadQuestions();
    console.log(`${this.allQuestions.length}問の問題を読み込みました`);
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    // フィルター変更
    Sidebar.onFilterChange((filterType) => {
      this.applyFilter();
    });
    
    // 閾値変更
    Sidebar.onThresholdChange((threshold) => {
      this.storage.saveSettings({
        filterType: Sidebar.getSelectedFilter(),
        accuracyThreshold: threshold
      });
      this.updateStatsPanel();
    });
    
    // 全削除
    Sidebar.onClearAll(() => {
      this.storage.clearAll();
      this.updateStatsPanel();
      alert('すべてのデータを削除しました。');
    });
    
    // 確認ボタン
    document.getElementById('check-btn')?.addEventListener('click', () => {
      this.checkAnswer();
    });
    
    // 次へボタン
    document.getElementById('next-btn')?.addEventListener('click', () => {
      this.nextQuestion();
    });
    
    // Enterキーで確認/次へ
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const checkBtn = document.getElementById('check-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (checkBtn && checkBtn.style.display !== 'none') {
          this.checkAnswer();
        } else if (nextBtn && nextBtn.style.display !== 'none') {
          this.nextQuestion();
        }
      }
    });
  }

  /**
   * フィルターを適用
   */
  applyFilter() {
    const filterType = Sidebar.getSelectedFilter();
    const threshold = Sidebar.getThreshold();
    
    // タイプでフィルタリング
    if (filterType === 'incorrect') {
      // 間違えた問題（正答率が閾値未満）
      this.currentQuestions = this.storage.filterByAccuracyThreshold(
        this.allQuestions,
        threshold
      );
    } else {
      // タイプでフィルタリング
      this.currentQuestions = this.questionManager.filterByType(
        this.allQuestions,
        filterType
      );
    }
    
    // シャッフル
    this.currentQuestions = this.questionManager.shuffle(this.currentQuestions);
    
    // インデックスをリセット
    this.currentIndex = 0;
    this.sessionCorrect = 0;
    this.sessionIncorrect = 0;
    this.sessionIncorrectQuestions = [];
    
    console.log(`フィルター適用: ${filterType}, 問題数: ${this.currentQuestions.length}`);
    
    // 問題がない場合
    if (this.currentQuestions.length === 0) {
      this.showNoQuestionsMessage(filterType);
      return;
    }
    
    // 最初の問題を表示
    this.showCurrentQuestion();
  }

  /**
   * 問題がない場合のメッセージを表示
   */
  showNoQuestionsMessage(filterType) {
    const content = document.getElementById('quiz-content');
    if (content) {
      let message = '該当する問題がありません。';
      if (filterType === 'incorrect') {
        message = '間違えた問題がまだありません。\n他のフィルターを選択してください。';
      }
      content.innerHTML = `
        <div class="no-questions-message">
          <h2>📝 ${message}</h2>
        </div>
      `;
    }
    QuizCard.toggleButtons(false, false);
  }

  /**
   * 現在の問題を表示
   */
  showCurrentQuestion() {
    if (this.currentIndex >= this.currentQuestions.length) {
      this.showCompletion();
      return;
    }
    
    this.currentQuestion = this.currentQuestions[this.currentIndex];
    
    // レンダラーを取得
    const renderer = this.renderers[this.currentQuestion.type];
    if (!renderer) {
      console.error('Unknown question type:', this.currentQuestion.type);
      return;
    }
    
    // 問題をレンダリング
    const html = renderer.render(this.currentQuestion);
    QuizCard.updateContent(html);
    
    // 進行状況を更新
    QuizCard.updateProgress(
      this.currentIndex + 1,
      this.currentQuestions.length
    );
    
    // スコアを更新
    QuizCard.updateScore(this.sessionCorrect, this.sessionIncorrect);
    
    // ボタンを設定
    QuizCard.toggleButtons(true, false);
    QuizCard.hideResult();
    
    // 最初の入力フィールドにフォーカス
    setTimeout(() => {
      const firstInput = document.querySelector('.answer-input, .inline-input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  /**
   * 回答をチェック
   */
  checkAnswer() {
    const renderer = this.renderers[this.currentQuestion.type];
    const userAnswer = this.getUserAnswer();
    
    // バリデーション
    const result = renderer.validate(this.currentQuestion, userAnswer);
    
    // 統計を記録
    this.storage.recordAnswer(this.currentQuestion.id, result.isCorrect);
    
    // セッション統計を更新
    if (result.isCorrect) {
      this.sessionCorrect++;
    } else {
      this.sessionIncorrect++;
      this.sessionIncorrectQuestions.push(this.currentQuestion);
    }
    
    // 結果を表示
    this.showAnswerResult(result);
    
    // ボタンを切り替え
    QuizCard.toggleButtons(false, true);
    
    // 統計パネルを更新
    this.updateStatsPanel();
  }

  /**
   * ユーザーの回答を取得
   */
  getUserAnswer() {
    const type = this.currentQuestion.type;
    
    if (type === 'verb') {
      return {
        past: document.getElementById('past-input')?.value || '',
        pastParticiple: document.getElementById('past-participle-input')?.value || ''
      };
    } else if (type === 'choice') {
      const selected = document.querySelector('input[name="choice-answer"]:checked');
      return selected ? selected.value : '';
    } else if (type === 'reorder') {
      const inputs = document.querySelectorAll('.inline-input');
      return Array.from(inputs).map(input => input.value);
    }
    
    return null;
  }

  /**
   * 回答結果を表示
   */
  showAnswerResult(result) {
    let message = '';
    
    if (result.isCorrect) {
      message = '✓ 正解です！';
    } else {
      message = '✗ 不正解<br>';
      
      if (this.currentQuestion.type === 'verb') {
        message += `<div class="answer-detail">正解: 過去形 = ${result.correctAnswers.past}, 過去分詞 = ${result.correctAnswers.pastParticiple}</div>`;
      } else if (this.currentQuestion.type === 'choice') {
        message += `<div class="answer-detail">正解: ${result.correctAnswer}</div>`;
      } else if (this.currentQuestion.type === 'reorder') {
        message += `<div class="answer-detail">正解: ${result.correctAnswers.join(', ')}</div>`;
      }
    }
    
    QuizCard.showResult(result.isCorrect, message);
  }

  /**
   * 次の問題へ
   */
  nextQuestion() {
    this.currentIndex++;
    this.showCurrentQuestion();
  }

  /**
   * 統計パネルを更新
   */
  updateStatsPanel() {
    const overallStats = this.storage.getOverallStats(this.allQuestions);
    const typeStats = this.storage.getStatsByType(this.allQuestions);
    
    StatsPanel.update(overallStats, typeStats);
  }

  /**
   * 完了画面を表示
   */
  showCompletion() {
    QuizCard.showCompletion(
      this.sessionCorrect,
      this.currentQuestions.length,
      this.sessionIncorrectQuestions
    );
    
    // 再スタートボタンのイベントリスナー
    setTimeout(() => {
      document.getElementById('restart-btn')?.addEventListener('click', () => {
        this.applyFilter();
      });
    }, 100);
  }
}

// アプリを起動
const app = new QuizApp();
app.init();

// デバッグ用にグローバルに公開
window.quizApp = app;
