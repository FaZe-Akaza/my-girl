// Create floating hearts
function createHearts() {
    const heartsContainer = document.getElementById('hearts');
    // Clear existing hearts
    heartsContainer.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animation = `float ${Math.random() * 6 + 5}s linear infinite`;
        heart.style.animationDelay = Math.random() * 5 + 's';
        heartsContainer.appendChild(heart);
    }
}

// Modal functionality
function openGift(giftNumber) {
    document.getElementById(`gift${giftNumber}`).style.display = 'flex';
    createHearts();
    
    // Reset cake candles when opening gift 3
    if (giftNumber === 3) {
        resetCandles();
    }
}

function openGame(gameType) {
    document.getElementById(`${gameType}Game`).style.display = 'flex';
    
    if (gameType === 'memory') {
        initMemoryGame();
    } else if (gameType === 'quiz') {
        initQuiz();
    }
    
    createHearts();
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Gift interactive functions
function playAudio() {
    // Create audio context for the birthday song
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play "Happy Birthday" melody
    const notes = [
        {freq: 392, duration: 0.5}, // G
        {freq: 392, duration: 0.5}, // G
        {freq: 440, duration: 1},   // A
        {freq: 392, duration: 1},   // G
        {freq: 523, duration: 1},   // C
        {freq: 494, duration: 2},   // B
        
        {freq: 392, duration: 0.5}, // G
        {freq: 392, duration: 0.5}, // G
        {freq: 440, duration: 1},   // A
        {freq: 392, duration: 1},   // G
        {freq: 587, duration: 1},   // D
        {freq: 523, duration: 2},   // C
        
        {freq: 392, duration: 0.5}, // G
        {freq: 392, duration: 0.5}, // G
        {freq: 784, duration: 1},   // G (high)
        {freq: 659, duration: 1},   // E
        {freq: 523, duration: 1},   // C
        {freq: 494, duration: 1},   // B
        {freq: 440, duration: 2},   // A
        
        {freq: 698, duration: 0.5}, // F
        {freq: 698, duration: 0.5}, // F
        {freq: 659, duration: 1},   // E
        {freq: 523, duration: 1},   // C
        {freq: 587, duration: 1},   // D
        {freq: 523, duration: 2}    // C
    ];
    
    let time = audioContext.currentTime;
    
    oscillator.type = 'sine';
    oscillator.start(time);
    
    notes.forEach(note => {
        oscillator.frequency.setValueAtTime(note.freq, time);
        time += note.duration * 0.8; // 80% of duration for note
        oscillator.frequency.setValueAtTime(0, time); // Brief pause
        time += note.duration * 0.2; // 20% of duration for pause
    });
    
    oscillator.stop(time);
    
    document.getElementById('audioStatus').textContent = "Playing Happy Birthday for Wambui! 🎵";
}

function pauseAudio() {
    document.getElementById('audioStatus').textContent = "Music paused";
}

function stopAudio() {
    document.getElementById('audioStatus').textContent = "Music stopped";
}

// Cake functionality
function resetCandles() {
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => {
        flame.classList.remove('extinguished');
    });
    document.getElementById('cakeMessage').textContent = "Make a wish and blow out the candles!";
}

function blowCandles() {
    const flames = document.querySelectorAll('.flame');
    let extinguishedCount = 0;
    
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.add('extinguished');
            extinguishedCount++;
            
            if (extinguishedCount === flames.length) {
                document.getElementById('cakeMessage').innerHTML = "🎉 Your wish will come true! Happy Birthday Wambui! 🎂";
            }
        }, index * 300); // Stagger the extinguishing
    });
}

function redeemCoupon() {
    alert('Coupon redeemed! 💖 I owe you a special treat!');
}

// Memory Game
function initMemoryGame() {
    const memoryBoard = document.getElementById('memoryBoard');
    memoryBoard.innerHTML = '';
    
    const symbols = ['🎂', '🎁', '🎈', '🎉', '❤️', '⭐'];
    const cards = [...symbols, ...symbols];
    
    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.symbol = symbol;
        
        const front = document.createElement('div');
        front.classList.add('front');
        front.textContent = '?';
        
        const back = document.createElement('div');
        back.classList.add('back');
        back.textContent = symbol;
        
        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', flipCard);
        
        memoryBoard.appendChild(card);
    });
    
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;
    
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second click
        secondCard = this;
        checkForMatch();
    }
    
    function checkForMatch() {
        let isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            
            if (matchedPairs === symbols.length) {
                setTimeout(() => {
                    alert('Congratulations! You matched all pairs! 🎉');
                }, 500);
            }
        } else {
            unflipCards();
        }
    }
    
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
}

// Love Meter
function measureLove() {
    const loveFill = document.getElementById('loveFill');
    const loveText = document.getElementById('loveText');
    
    // Reset the meter
    loveFill.style.width = '0%';
    loveText.textContent = "Measuring the love...";
    
    // Animate the love meter
    let width = 0;
    const interval = setInterval(() => {
        width += 2;
        loveFill.style.width = width + '%';
        
        if (width >= 100) {
            clearInterval(interval);
            loveText.innerHTML = "Wambui is loved <strong>INFINITELY</strong>! ❤️❤️❤️";
        } else if (width > 80) {
            loveText.textContent = "Wambui is loved A WHOLE LOT! 💖";
        } else if (width > 60) {
            loveText.textContent = "Wambui is loved VERY MUCH! 💕";
        } else if (width > 40) {
            loveText.textContent = "Wambui is loved SO MUCH! 😊";
        } else if (width > 20) {
            loveText.textContent = "Wambui is loved A LOT! 👍";
        }
    }, 30);
}

// Birthday Quiz
function initQuiz() {
    const quizData = [
        {
            question: "How awesome is Wambui?",
            options: ["Pretty awesome", "Very awesome", "Extremely awesome", "The most awesome person ever!"],
            correct: 3
        },
        {
            question: "What makes Wambui special?",
            options: ["Her smile", "Her kindness", "Her intelligence", "All of the above and more!"],
            correct: 3
        },
        {
            question: "How many birthday wishes does Wambui deserve?",
            options: ["A few", "Many", "Countless", "Infinite wishes!"],
            correct: 3
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    function displayQuestion() {
        const quizQuestion = document.getElementById('quizQuestion');
        const quizOptions = document.getElementById('quizOptions');
        const quizResult = document.getElementById('quizResult');
        
        quizResult.textContent = '';
        
        if (currentQuestion >= quizData.length) {
            // Quiz completed
            quizQuestion.textContent = "Quiz Complete!";
            quizOptions.innerHTML = '';
            quizResult.innerHTML = `You got ${score} out of ${quizData.length} correct!<br>Wambui is definitely the best! 🎉`;
            return;
        }
        
        const question = quizData[currentQuestion];
        quizQuestion.textContent = question.question;
        
        quizOptions.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('quiz-option');
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => checkAnswer(index));
            quizOptions.appendChild(optionElement);
        });
    }
    
    function checkAnswer(selectedIndex) {
        const question = quizData[currentQuestion];
        const quizResult = document.getElementById('quizResult');
        
        if (selectedIndex === question.correct) {
            quizResult.textContent = "Correct! 🎉";
            quizResult.style.color = "#4CAF50";
            score++;
        } else {
            quizResult.textContent = "Nice try! But Wambui deserves even more! 😊";
            quizResult.style.color = "#FF9800";
        }
        
        currentQuestion++;
        setTimeout(displayQuestion, 1500);
    }
    
    currentQuestion = 0;
    score = 0;
    displayQuestion();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    createHearts();
    
    // Add event listeners to gift boxes
    document.querySelectorAll('.gift-box').forEach(box => {
        box.addEventListener('click', function() {
            openGift(this.dataset.gift);
        });
    });
    
    // Add event listeners to game cards
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            openGame(this.dataset.game);
        });
    });
    
    // Add event listeners to close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Add event listeners to action buttons
    document.getElementById('playBtn').addEventListener('click', playAudio);
    document.getElementById('pauseBtn').addEventListener('click', pauseAudio);
    document.getElementById('stopBtn').addEventListener('click', stopAudio);
    document.getElementById('blowCandlesBtn').addEventListener('click', blowCandles);
    document.getElementById('redeemCouponBtn').addEventListener('click', redeemCoupon);
    document.getElementById('restartMemoryBtn').addEventListener('click', initMemoryGame);
    document.getElementById('measureLoveBtn').addEventListener('click', measureLove);
    document.getElementById('restartQuizBtn').addEventListener('click', initQuiz);
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});