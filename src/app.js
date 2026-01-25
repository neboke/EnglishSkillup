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
import TypingRenderer from './renderers/typingRenderer.js';
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
      reorder: ReorderRenderer,
      typing: TypingRenderer
    };
  }

  /**
   * アプリ初期化
   */
  async init() {
    try {
      // UIを初期化
      this.renderUI();
      
      // 保存された設定を取得
      const settings = this.storage.getSettings();
      const examMode = settings.examMode || 'finals';
      
      // 出題モードを復元
      const modeInput = document.querySelector(`input[name="exam-mode"][value="${examMode}"]`);
      if (modeInput) {
        modeInput.checked = true;
        this.updateExamModeUI(examMode);
      }
      
      // モード別に問題を読み込み
      if (examMode === 'term') {
        const savedTerm = settings.termId || 'term1';
        const termInput = document.querySelector(`input[name="term"][value="${savedTerm}"]`);
        if (termInput) {
          termInput.checked = true;
        }
        await this.loadQuestions(null, savedTerm);
      } else {
        const savedFileType = settings.fileType || 'verbs';
        const fileTypeInput = document.querySelector(`input[name="question-file"][value="${savedFileType}"]`);
        if (fileTypeInput) {
          fileTypeInput.checked = true;
        }
        await this.loadQuestions(savedFileType);
      }
      
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
   * @param {string} fileType - 'verbs', 'sentences', または null（デフォルト）
   * @param {string} termId - 'term1', 'term2', ... または null
   */
  async loadQuestions(fileType = null, termId = null) {
    if (termId) {
      this.allQuestions = await this.questionManager.loadQuestionsByTerm(termId);
    } else if (fileType) {
      this.allQuestions = await this.questionManager.loadQuestionsByType(fileType);
    } else {
      this.allQuestions = await this.questionManager.loadQuestions();
    }
    console.log(`${this.allQuestions.length}問の問題を読み込みました`);
  }

  /**
   * 出題モード切り替え時にUIを更新
   * @param {string} mode - 'finals' または 'term'
   */
  updateExamModeUI(mode) {
    const finalsModeDiv = document.getElementById('finals-mode');
    const termModeDiv = document.getElementById('term-mode');
    
    if (mode === 'term') {
      finalsModeDiv.style.display = 'none';
      termModeDiv.style.display = 'block';
    } else {
      finalsModeDiv.style.display = 'block';
      termModeDiv.style.display = 'none';
    }
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    // 出題モード変更
    Sidebar.onExamModeChange(async (mode) => {
      // UIを更新
      this.updateExamModeUI(mode);
      
      // 設定を保存
      this.storage.saveSettings({
        filterType: Sidebar.getSelectedFilter(),
        accuracyThreshold: Sidebar.getThreshold(),
        examMode: mode,
        fileType: mode === 'finals' ? Sidebar.getSelectedFileType() : undefined,
        termId: mode === 'term' ? Sidebar.getSelectedTerm() : undefined
      });
      
      // 問題を再読み込み
      if (mode === 'term') {
        const termId = Sidebar.getSelectedTerm();
        await this.loadQuestions(null, termId);
      } else {
        const fileType = Sidebar.getSelectedFileType();
        await this.loadQuestions(fileType);
      }
      
      // フィルターを初期化
      const allFilterInput = document.querySelector('input[name="filter"][value="all"]');
      if (allFilterInput) {
        allFilterInput.checked = true;
      }
      
      // フィルターを適用して表示
      this.applyFilter();
      this.showCurrentQuestion();
      this.updateStatsPanel();
    });

    // Term選択変更
    Sidebar.onTermChange(async (termId) => {
      // 選択したTermをストレージに保存
      this.storage.saveSettings({
        filterType: Sidebar.getSelectedFilter(),
        accuracyThreshold: Sidebar.getThreshold(),
        examMode: 'term',
        termId: termId
      });
      
      // 新しいTermを読み込む
      await this.loadQuestions(null, termId);
      
      // フィルターを初期化
      const allFilterInput = document.querySelector('input[name="filter"][value="all"]');
      if (allFilterInput) {
        allFilterInput.checked = true;
      }
      
      // フィルターを適用して表示
      this.applyFilter();
      this.showCurrentQuestion();
      this.updateStatsPanel();
    });

    // ファイル選択変更
    Sidebar.onFileChange(async (fileType) => {
      // 選択したファイルタイプをストレージに保存
      this.storage.saveSettings({
        filterType: Sidebar.getSelectedFilter(),
        accuracyThreshold: Sidebar.getThreshold(),
        fileType: fileType
      });
      
      // 新しいファイルを読み込む
      await this.loadQuestions(fileType);
      
      // フィルターを初期化（デフォルトのallを選択）
      const allFilterInput = document.querySelector('input[name="filter"][value="all"]');
      if (allFilterInput) {
        allFilterInput.checked = true;
      }
      
      // フィルターを適用して問題を表示
      this.applyFilter();
      this.showCurrentQuestion();
      this.updateStatsPanel();
    });
    
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
        const activeElement = document.activeElement;
        const pastInput = document.getElementById('past-input');
        const pastParticipleInput = document.getElementById('past-participle-input');
        
        if (
          this.currentQuestion?.type === 'verb' &&
          activeElement === pastInput &&
          pastParticipleInput
        ) {
          e.preventDefault();
          pastParticipleInput.focus();
          return;
        }

        if (this.currentQuestion?.type === 'reorder' && activeElement?.classList?.contains('inline-input')) {
          const inputs = Array.from(document.querySelectorAll('.inline-input'));
          const currentIndex = inputs.indexOf(activeElement);
          if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
            e.preventDefault();
            inputs[currentIndex + 1].focus();
            return;
          }
        }

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
      const grouped = new Map();

      inputs.forEach((input) => {
        const blankIndex = Number(input.dataset.blankIndex);
        const wordIndex = Number(input.dataset.wordIndex || 0);
        if (!grouped.has(blankIndex)) {
          grouped.set(blankIndex, []);
        }
        grouped.get(blankIndex).push({ wordIndex, value: input.value });
      });

      const blanksCount = this.currentQuestion?.blanks?.length || 0;
      if (blanksCount === 0) {
        return Array.from(inputs).map(input => input.value);
      }

      const answers = [];
      for (let i = 0; i < blanksCount; i++) {
        const words = (grouped.get(i) || [])
          .sort((a, b) => a.wordIndex - b.wordIndex)
          .map(entry => entry.value);
        answers.push(words.join(' '));
      }
      return answers;
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

    if (!result.isCorrect && this.currentQuestion.type === 'verb') {
      this.playVerbPronunciation(this.currentQuestion);
    } else if (!result.isCorrect && this.currentQuestion.type === 'reorder') {
      this.playReorderPronunciation(this.currentQuestion);
    }
  }

  /**
   * 不規則動詞の発音を順に再生
   * @param {Object} question - {base, past, pastParticiple}
   */
  playVerbPronunciation(question) {
    if (!('speechSynthesis' in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    const normalize = (text) =>
      String(text || '').replace(/\//g, ' or ').replace(/[\[\]]/g, '');
    const phrases = [question.base, question.past, question.pastParticiple]
      .map(normalize)
      .filter(Boolean);

    if (phrases.length === 0) {
      return;
    }

    synth.cancel();

    let index = 0;
    const speakNext = () => {
      if (index >= phrases.length) {
        return;
      }

      const utterance = new SpeechSynthesisUtterance(phrases[index]);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      const voice = this.getEnglishVoice();
      if (voice) {
        utterance.voice = voice;
      }
      index += 1;
      utterance.onend = speakNext;
      utterance.onerror = speakNext;
      synth.speak(utterance);
    };

    speakNext();
  }

  /**
   * 並び替え問題の正解文を発音
   * @param {Object} question - {template, blanks}
   */
  playReorderPronunciation(question) {
    if (!('speechSynthesis' in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    let sentence = String(question.template || '');

    (question.blanks || []).forEach((blank, index) => {
      const placeholder = `__${index}__`;
      sentence = sentence.replace(placeholder, blank);
    });

    sentence = sentence
      .replace(/\[[^\]]*\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!sentence) {
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    const voice = this.getEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    }
    synth.speak(utterance);
  }

  /**
   * 英語の女性音声を優先して取得
   * @returns {SpeechSynthesisVoice|null}
   */
  getEnglishVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      return null;
    }

    const isEnglish = (voice) => /^en(-|_)?/i.test(voice.lang || '');
    const femaleHint = /female|woman|samantha|victoria|zira|karen|susan/i;
    const englishVoices = voices.filter(isEnglish);

    const preferred = englishVoices.find((voice) => femaleHint.test(voice.name));
    if (preferred) {
      return preferred;
    }

    return englishVoices[0] || null;
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
