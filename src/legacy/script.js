const verbs = [
    { base: 'stand', past: 'stood', pastParticiple: 'stood', meaning: '立っている' },
    { base: 'strike', past: 'struck', pastParticiple: 'struck', meaning: '打つ' },
    { base: 'swing', past: 'swung', pastParticiple: 'swung', meaning: '振る' },
    { base: 'teach', past: 'taught', pastParticiple: 'taught', meaning: '教える' },
    { base: 'tell', past: 'told', pastParticiple: 'told', meaning: '話す、教える' },
    { base: 'think', past: 'thought', pastParticiple: 'thought', meaning: '思う、考える' },
    { base: 'understand', past: 'understood', pastParticiple: 'understood', meaning: '理解する' },
    { base: 'win', past: 'won', pastParticiple: 'won', meaning: '勝つ、勝っている' },
    { base: 'be', past: 'was/were', pastParticiple: 'been', meaning: '始める' },
    { base: 'begin', past: 'began', pastParticiple: 'begun', meaning: '吹く' },
    { base: 'blow', past: 'blew', pastParticiple: 'blown', meaning: '吹く' },
    { base: 'break', past: 'broke', pastParticiple: 'broken', meaning: '折る' },
    { base: 'choose', past: 'chose', pastParticiple: 'chosen', meaning: '選ぶ' },
    { base: 'do', past: 'did', pastParticiple: 'done', meaning: 'する' },
    { base: 'draw', past: 'drew', pastParticiple: 'drawn', meaning: '描く' },
    { base: 'drink', past: 'drank', pastParticiple: 'drunk', meaning: '飲む' },
    { base: 'drive', past: 'drove', pastParticiple: 'driven', meaning: '運転する' },
    { base: 'eat', past: 'ate', pastParticiple: 'eaten', meaning: '食べる' },
    { base: 'fall', past: 'fell', pastParticiple: 'fallen', meaning: '落ちる' },
    { base: 'fly', past: 'flew', pastParticiple: 'flown', meaning: '飛ぶ' },
    { base: 'give', past: 'gave', pastParticiple: 'given', meaning: '与える' },
    { base: 'go', past: 'went', pastParticiple: 'gone', meaning: '行く' },
    { base: 'grow', past: 'grew', pastParticiple: 'grown', meaning: '成長する' },
    { base: 'hide', past: 'hid', pastParticiple: 'hidden', meaning: 'かくす' },
    { base: 'know', past: 'knew', pastParticiple: 'known', meaning: '知っている' },
    { base: 'mistake', past: 'mistook', pastParticiple: 'mistaken', meaning: '間違える' },
    { base: 'ride', past: 'rode', pastParticiple: 'ridden', meaning: '乗る' },
    { base: 'ring', past: 'rang', pastParticiple: 'rung', meaning: '鳴る' },
    { base: 'rise', past: 'rose', pastParticiple: 'risen', meaning: 'のぼる' },
    { base: 'see', past: 'saw', pastParticiple: 'seen', meaning: '見る、会う' },
    { base: 'shake', past: 'shook', pastParticiple: 'shaken', meaning: 'ふる' },
    { base: 'show', past: 'showed', pastParticiple: 'shown', meaning: '見せる' },
    { base: 'sing', past: 'sang', pastParticiple: 'sung', meaning: '歌う' },
    { base: 'speak', past: 'spoke', pastParticiple: 'spoken', meaning: '話す' },
    { base: 'steal', past: 'stole', pastParticiple: 'stolen', meaning: '盗む' },
    { base: 'swim', past: 'swam', pastParticiple: 'swum', meaning: '泳ぐ' },
    { base: 'take', past: 'took', pastParticiple: 'taken', meaning: '持っていく' },
    { base: 'throw', past: 'threw', pastParticiple: 'thrown', meaning: '投げる' },
    { base: 'wake', past: 'woke', pastParticiple: 'woken', meaning: '目が覚める' },
    { base: 'wear', past: 'wore', pastParticiple: 'worn', meaning: '着る' },
    { base: 'write', past: 'wrote', pastParticiple: 'written', meaning: '書く' }
];

let currentIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let shuffledVerbs = [];
let incorrectVerbs = [];

// 要素の取得
const baseFormEl = document.getElementById('baseForm');
const meaningEl = document.getElementById('meaning');
const pastFormInput = document.getElementById('pastForm');
const pastParticipleInput = document.getElementById('pastParticiple');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const resultEl = document.getElementById('result');
const progressEl = document.getElementById('progress');
const correctEl = document.getElementById('correct');
const incorrectEl = document.getElementById('incorrect');

// 初期化
function init() {
    shuffledVerbs = [...verbs].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    incorrectVerbs = [];
    updateStats();
    loadQuestion();
}

// 問題を読み込む
function loadQuestion() {
    if (currentIndex >= shuffledVerbs.length) {
        showFinalResult();
        return;
    }

    const verb = shuffledVerbs[currentIndex];
    baseFormEl.textContent = verb.base;
    meaningEl.textContent = `(${verb.meaning})`;
    
    pastFormInput.value = '';
    pastParticipleInput.value = '';
    pastFormInput.className = '';
    pastParticipleInput.className = '';
    
    resultEl.className = 'result';
    resultEl.innerHTML = '';
    
    checkBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    
    pastFormInput.focus();
}

// 答えをチェック
function checkAnswer() {
    const verb = shuffledVerbs[currentIndex];
    const userPast = pastFormInput.value.trim().toLowerCase();
    const userPastParticiple = pastParticipleInput.value.trim().toLowerCase();
    
    const correctPastOptions = verb.past.toLowerCase().split('/').map(s => s.trim());
    const correctPastParticipleOptions = verb.pastParticiple.toLowerCase().split('/').map(s => s.trim());
    
    const isPastCorrect = correctPastOptions.includes(userPast);
    const isPastParticipleCorrect = correctPastParticipleOptions.includes(userPastParticiple);
    
    pastFormInput.className = isPastCorrect ? 'correct' : 'incorrect';
    pastParticipleInput.className = isPastParticipleCorrect ? 'correct' : 'incorrect';
    
    if (isPastCorrect && isPastParticipleCorrect) {
        correctCount++;
        resultEl.className = 'result show success';
        resultEl.innerHTML = '✓ 正解です！';
    } else {
        incorrectCount++;
        incorrectVerbs.push(verb);
        resultEl.className = 'result show error';
        resultEl.innerHTML = `✗ 不正解<br><div class="answer-display">正解: 過去形 = ${verb.past}, 過去分詞 = ${verb.pastParticiple}</div>`;
    }
    
    updateStats();
    checkBtn.style.display = 'none';
    nextBtn.style.display = 'block';
}

// 次の問題へ
function nextQuestion() {
    currentIndex++;
    loadQuestion();
}

// 統計情報を更新
function updateStats() {
    progressEl.textContent = `${currentIndex}/${shuffledVerbs.length}`;
    correctEl.textContent = correctCount;
    incorrectEl.textContent = incorrectCount;
}

// 最終結果を表示
function showFinalResult() {
    const accuracy = Math.round((correctCount / shuffledVerbs.length) * 100);
    baseFormEl.textContent = '完了！';
    meaningEl.textContent = '';
    
    let resultHTML = `
        全問題終了しました！<br>
        正解率: ${accuracy}%<br>
        正解: ${correctCount}問 / 不正解: ${incorrectCount}問
    `;
    
    // 間違えた単語のリストを追加
    if (incorrectVerbs.length > 0) {
        resultHTML += '<div class="incorrect-list"><h3>間違えた単語:</h3>';
        resultHTML += '<table class="verb-table">';
        resultHTML += '<tr><th>原形</th><th>過去形</th><th>過去分詞</th></tr>';
        incorrectVerbs.forEach(verb => {
            resultHTML += `<tr><td>${verb.base}</td><td>${verb.past}</td><td>${verb.pastParticiple}</td></tr>`;
        });
        resultHTML += '</table></div>';
    }
    
    resultEl.className = 'result show success';
    resultEl.innerHTML = resultHTML;
    
    pastFormInput.style.display = 'none';
    pastParticipleInput.style.display = 'none';
    document.querySelectorAll('.input-group label').forEach(el => el.style.display = 'none');
    checkBtn.style.display = 'none';
    nextBtn.style.display = 'none';
}

// イベントリスナー
checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextQuestion);
resetBtn.addEventListener('click', () => {
    pastFormInput.style.display = 'block';
    pastParticipleInput.style.display = 'block';
    document.querySelectorAll('.input-group label').forEach(el => el.style.display = 'block');
    init();
});

// Enterキーで送信
pastFormInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        pastParticipleInput.focus();
    }
});

pastParticipleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (checkBtn.style.display !== 'none') {
            checkAnswer();
        } else {
            nextQuestion();
        }
    }
});

// 初期化実行
init();
