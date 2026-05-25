// مراجع لعناصر واجهة المستخدم (DOM)
const basket = document.getElementById('basket');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const targetEl = document.getElementById('target');
const livesEl = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const rewardIcon = document.getElementById('rewardIcon');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

// متغيرات حالة اللعبة الحالية
let score = 0;
let level = 1;
let lives = 3;
let targetScore = 30; // النقاط المطلوبة للفوز بالليفل الأول
let gemSpeed = 4;     // سرعة سقوط الجواهر الافتراضية
let gameInterval;
let gemInterval;
let isGameOver = false;

// قائمة الهدايا والمكافآت لكل مستوى
const levelRewards = {
    1: { name: "الوشاح الفضي 🥈", icon: "🧣" },
    2: { name: "الدرع الحديدي 🛡️", icon: "🛡️" },
    3: { name: "التاج الذهبي للابطال 👑", icon: "👑" }
};

// تحريك السلة بأسهم الكيبورد
let basketLeft = 160;
const containerWidth = 400;
const basketWidth = 80;

document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (basketLeft > 0) basketLeft -= 25;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        if (basketLeft < (containerWidth - basketWidth)) basketLeft += 25;
    }
    basket.style.left = basketLeft + 'px';
});

// بدء اللعبة وتوليد الجواهر
function startGame() {
    isGameOver = false;
    gemInterval = setInterval(createGem, 1200 / level); // توليد أسرع كلما زاد الليفل
}

function createGem() {
    if (isGameOver) return;

    const gem = document.createElement('div');
    gem.classList.add('gem');
    
    // وضع الجوهرة في مكان عشوائي أفقياً
    let randomLeft = Math.floor(Math.random() * (containerWidth - 25));
    gem.style.left = randomLeft + 'px';
    gem.style.top = '0px';
    
    gameArea.appendChild(gem);

    // إنيميشن سقوط الجوهرة
    let gemTop = 0;
    let gemMove = setInterval(() => {
        if (isGameOver) {
            clearInterval(gemMove);
            gem.remove();
            return;
        }

        gemTop += gemSpeed;
        gem.style.top = gemTop + 'px';

        // 1. التحقق من التقاط السلة للجوهرة (Collision Detection)
        if (gemTop >= 515 && gemTop <= 535) { // محاذاة ارتفاع السلة
            let gemLeft = parseInt(gem.style.left);
            if (gemLeft >= basketLeft - 15 && gemLeft <= basketLeft + basketWidth) {
                score += 10;
                scoreEl.innerText = score;
                clearInterval(gemMove);
                gem.remove();
                checkLevelUp(); // تحقق هل فاز بالليفل؟
            }
        }

        // 2. التحقق من تخطي الجوهرة للأسفل (ضياع الجوهرة)
        if (gemTop > 550) {
            clearInterval(gemMove);
            gem.remove();
            lives--;
            livesEl.innerText = lives;
            if (lives <= 0) {
                gameOver();
            }
        }
    }, 20);
}

// التحقق من الانتقال للمستوى الأعلى وهدية الليفل
function checkLevelUp() {
    if (score >= targetScore) {
        clearInterval(gemInterval);
        isGameOver = true;

        // إحضار الهدية الخاصة بالمستوى الحالي
        const currentReward = levelRewards[level] || { name: "حقيبة جواهر إضافية 💰", icon: "💰" };

        // إظهار شاشة الفوز والمكافأة
        modalTitle.innerText = `🎉 مبروك! تخطيت المستوى ${level}`;
        modalMessage.innerText = `حصلت على مكافأة: ${currentReward.name}`;
        rewardIcon.innerText = currentReward.icon;
        
        nextBtn.style.display = "inline-block";
        restartBtn.style.display = "none";
        overlay.classList.add('show');
    }
}

// الانتقال للمستوى التالي وتجهيز الصعوبة
function nextLevel() {
    level++;
    score = 0;
    targetScore += 20; // زيادة النقاط المطلوبة لليفل القادم
    gemSpeed += 1.5;   // زيادة سرعة سقوط الجواهر لجعلها أصعب

    // تحديث الواجهة
    levelEl.innerText = level;
    scoreEl.innerText = score;
    targetEl.innerText = targetScore;
    
    overlay.classList.remove('show');
    startGame();
}

// حالة انتهاء اللعبة (Game Over)
function gameOver() {
    clearInterval(gemInterval);
    isGameOver = true;

    modalTitle.innerText = "💥 اللعبة انتهت (Game Over)";
    modalMessage.innerText = `لقد خسرت جميع محاولاتك في المستوى ${level}.`;
    rewardIcon.innerText = "💀";
    
    nextBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    overlay.classList.add('show');
}

// إعادة اللعبة بالكامل من الصفر
function resetGame() {
    level = 1;
    score = 0;
    lives = 3;
    targetScore = 30;
    gemSpeed = 4;

    levelEl.innerText = level;
    scoreEl.innerText = score;
    targetEl.innerText = targetScore;
    livesEl.innerText = lives;

    overlay.classList.remove('show');
    startGame();
}

// تشغيل اللعبة لأول مرة
startGame();
