 let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];

// 添加全局變量
let showingHomePage = true; // 預設顯示首頁
let showingQuiz = false;

// 測驗相關變量
let questions = [ // 預設題目清單 (為了讓測驗功能可以運作)
    {
        question: "下列哪一個是p5.js的繪圖函式?",
        options: ["setup()", "draw()", "preload()", "mousePressed()"],
        correctAnswerIndex: 1
    },
    {
        question: "在p5.js中，要畫一個圓形應使用哪個函式?",
        options: ["rect()", "square()", "circle()", "ellipse()"],
        correctAnswerIndex: 2
    },
    {
        question: "變數 `width` 代表什麼?",
        options: ["視窗寬度", "畫布高度", "畫布寬度", "螢幕寬度"],
        correctAnswerIndex: 2
    },
    {
        question: "哪一個顏色代碼是紅色?",
        options: ["#f7d002", "#1A53C0", "#f71735", "#232323"],
        correctAnswerIndex: 2
    }
];
let currentQuestions = [];  // 當前測驗的題目
let currentQuestion = 0;    // 當前題目索引
let userAnswers = [];      // 用戶答案
let score = 0;             // 分數
let quizComplete = false;  // 測驗是否完成
let table;                 // CSV數據 (如果需要載入外部資料)

// 按鈕位置
let buttons = [];
let buttonWidth = 400;
let buttonHeight = 50;


function preload() {
    // 如果您需要從 CSV 載入題目，請在這裡取消註解並設定路徑
    // 範例: table = loadTable('questions.csv', 'csv', 'header'); 
}

function setup() {
    let canvas = createCanvas(800, 600);
    // 計算畫布的位置，使其置中
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.parent('sketch-holder');
    canvas.style('margin', 'auto');
    canvas.style('display', 'block');
    rectMode(CENTER);

    // 添加滑鼠事件監聽
    canvas.mouseOver(() => {
        checkMousePosition();
    });
    canvas.mouseOut(() => {
        hideMenu();
    });

    // 初始物件
    objs.push(new DynamicShape());
    
    // 初始化時顯示首頁 (確保顯示正確的初始畫面)
    showHomePage();
}

function draw() {
    background(0);
    
    // 檢查滑鼠位置 (控制側邊選單顯示)
    checkMousePosition();
    
    // 更新和顯示所有物件 (動態背景)
    for (let i of objs) {
        i.run();
    }
    
    // 隨機添加新物件
    if (frameCount % int(random([15, 30])) == 0) {
        let addNum = int(random(1, 30));
        for (let i = 0; i < addNum; i++) {
            objs.push(new DynamicShape());
        }
    }
    
    // 移除死亡物件
    for (let i = objs.length - 1; i >= 0; i--) {
        if (objs[i].isDead) {
            objs.splice(i, 1);
        }
    }
    
    // 如果是首頁，在動態背景上方顯示文字
    if (showingHomePage) {
        push();
        fill(0, 180);
        noStroke();
        rectMode(CENTER);
        rect(width/2, height/2, width, 200);
        textAlign(CENTER, CENTER);
        textSize(48);
        fill(255);
        text("淡江教育科技系", width/2, height/2 - 60);
        textSize(36); // 調整字體大小以適應
        text("414730761", width/2, height/2);
        text("鄭若芹", width/2, height/2 + 60);
        pop();
    }
    
    // 如果正在進行測驗，繪製測驗畫面
    if (showingQuiz) {
        drawQuiz();
    }
}

// 函式: 開始測驗
function startQuiz() {
    showingQuiz = true;
    showingHomePage = false; // 離開首頁
    quizComplete = false;
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    
    // 隨機選擇4題
    currentQuestions = [];
    let tempQuestions = [...questions];
    
    // 限制最多只選 questions.length 題
    let numToSelect = Math.min(4, questions.length); 

    for (let i = 0; i < numToSelect; i++) {
        let index = floor(random(tempQuestions.length));
        currentQuestions.push(tempQuestions[index]);
        tempQuestions.splice(index, 1);
    }
}

// 函式: 繪製測驗畫面
function drawQuiz() {
    // 覆蓋動態背景，使用半透明黑色背景讓文字更清晰
    fill(0, 200);
    noStroke();
    rect(0, 0, width, height);

    if (!quizComplete) {
        // 顯示題目編號
        textAlign(LEFT, TOP);
        textSize(24);
        fill(255);
        text(`題目 ${currentQuestion + 1} / ${currentQuestions.length}`, 50, 50);

        let q = currentQuestions[currentQuestion];
        if (q) {
            // 顯示題目內容
            textAlign(CENTER, TOP);
            textSize(32);
            text(q.question, width / 2, 100, width - 100, 100);
            
            // 顯示選項按鈕
            buttons = []; // 清空按鈕列表
            let optionYStart = height / 2 - q.options.length * (buttonHeight + 15) / 2;

            for (let i = 0; i < q.options.length; i++) {
                let y = optionYStart + i * (buttonHeight + 15);
                let x = width / 2;

                // 繪製按鈕
                let isHovering = mouseX > x - buttonWidth / 2 && mouseX < x + buttonWidth / 2 &&
                                 mouseY > y - buttonHeight / 2 && mouseY < y + buttonHeight / 2;

                // 顏色和樣式
                fill(isHovering ? '#333333' : '#1A1A1A');
                stroke(255);
                strokeWeight(2);
                rectMode(CENTER);
                rect(x, y, buttonWidth, buttonHeight, 10); // 圓角矩形

                // 繪製選項文字
                fill(255);
                textSize(20);
                textAlign(CENTER, CENTER);
                text(q.options[i], x, y);

                // 儲存按鈕位置，供 mousePressed 使用
                buttons.push({ x: x, y: y, width: buttonWidth, height: buttonHeight, action: i });
            }
        }
    } else {
        // 測驗完成畫面
        drawQuizResult();
    }
}

// 函式: 繪製測驗結果畫面
function drawQuizResult() {
    textAlign(CENTER, CENTER);
    fill(255);
    
    textSize(48);
    text("測驗完成！", width / 2, height / 2 - 100);
    
    textSize(60);
    let resultText = `得分: ${score} / ${currentQuestions.length}`;
    text(resultText, width / 2, height / 2);
    
    // 繪製返回首頁按鈕
    let btnX = width / 2;
    let btnY = height / 2 + 100;
    
    let isHovering = mouseX > btnX - buttonWidth / 2 && mouseX < btnX + buttonWidth / 2 &&
                     mouseY > btnY - buttonHeight / 2 && mouseY < btnY + buttonHeight / 2;
                     
    fill(isHovering ? '#f71735' : '#CC0000');
    stroke(255);
    strokeWeight(2);
    rect(btnX, btnY, buttonWidth, buttonHeight, 10);
    
    fill(255);
    textSize(24);
    text("返回首頁", btnX, btnY);

    buttons = [{ x: btnX, y: btnY, width: buttonWidth, height: buttonHeight, action: 'home' }]; // 設置按鈕
}

// 函式: 檢查答案並進入下一題/完成測驗
function checkAnswer(selectedOptionIndex) {
    let q = currentQuestions[currentQuestion];
    userAnswers[currentQuestion] = selectedOptionIndex; // 儲存用戶答案
    
    // 檢查答案是否正確
    if (selectedOptionIndex === q.correctAnswerIndex) {
        score++;
    }
    
    currentQuestion++; // 進入下一題
    
    // 檢查測驗是否完成
    if (currentQuestion >= currentQuestions.length) {
        quizComplete = true;
    }
}

function mousePressed() {
    // 處理測驗中的點擊
    if (showingQuiz) {
        for (let btn of buttons) {
            let halfW = btn.width / 2;
            let halfH = btn.height / 2;
            if (mouseX > btn.x - halfW && mouseX < btn.x + halfW &&
                mouseY > btn.y - halfH && mouseY < btn.y + halfH) {
                
                if (!quizComplete) {
                    // 點擊選項
                    checkAnswer(btn.action);
                    break;
                } else if (btn.action === 'home') {
                    // 點擊返回首頁
                    showingQuiz = false;
                    showHomePage();
                    break;
                }
            }
        }
    }
}

// 輔助函式: 緩和曲線
function easeInOutExpo(x) {
    return x === 0 ? 0 :
        x === 1 ?
        1 :
        x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
        (2 - Math.pow(2, -20 * x + 10)) / 2;
}

// 檢查滑鼠位置並控制選單
function checkMousePosition() {
    if (mouseX <= 100) {
        document.getElementById('side-menu').classList.add('show');
    } else {
        hideMenu();
    }
}

function hideMenu() {
    const menu = document.getElementById('side-menu');
    if (menu) {
        menu.classList.remove('show');
    }
}

// 顯示 iframe
function showIframe(url) {
    const iframe = document.getElementById('content-iframe');
    const container = document.getElementById('iframe-container');
    if (iframe && container) {
        iframe.src = url;
        container.classList.add('show');
    }
}

// 關閉 iframe
function closeIframe() {
    const container = document.getElementById('iframe-container');
    const iframe = document.getElementById('content-iframe');
    if (container && iframe) {
        container.classList.remove('show');
        iframe.src = '';
    }
}

// 顯示首頁
function showHomePage() {
    showingHomePage = true;
    showingQuiz = false; // 確保關閉測驗
    closeIframe(); // 確保關閉 iframe
    hideMenu();
}

// 函式: 處理第三個選項點擊 (連接到指定網頁)
function openOptionThree() {
    // 1. 關閉所有其他主要顯示模式
    showingHomePage = false;
    showingQuiz = false;
    
    // 2. 設定要載入的網址
    const url = "https://ruoqincheng.github.io/20251109-1/";
    
    // 3. 呼叫您現有的函式來顯示 iframe
    showIframe(url);
    
    // 4. 隱藏側邊選單
    hideMenu();
}

// 函式: 處理選單中的「開始測驗」按鈕 (取代 showQuestionMenu)
function showQuestionMenu() {
    // 確保所有其他模式關閉
    showingHomePage = false;
    closeIframe();
    // 開始測驗
    startQuiz();
}

// 動態形狀類別
class DynamicShape {
    constructor() {
        this.x = random(0.3, 0.7) * width;
        this.y = random(0.3, 0.7) * height;
        this.reductionRatio = 1;
        this.shapeType = int(random(4));
        this.animationType = 0;
        this.maxActionPoints = int(random(2, 5));
        this.actionPoints = this.maxActionPoints;
        this.elapsedT = 0;
        this.size = 0;
        this.sizeMax = width * random(0.01, 0.05);
        this.fromSize = 0;
        this.init();
        this.isDead = false;
        this.clr = random(colors);
        this.changeShape = true;
        this.ang = int(random(2)) * PI * 0.25;
        this.lineSW = 0;
    }

    show() {
        push();
        translate(this.x, this.y);
        if (this.animationType == 1) scale(1, this.reductionRatio);
        if (this.animationType == 2) scale(this.reductionRatio, 1);
        fill(this.clr);
        stroke(this.clr);
        strokeWeight(this.size * 0.05);
        if (this.shapeType == 0) {
            noStroke();
            circle(0, 0, this.size);
        } else if (this.shapeType == 1) {
            noFill();
            circle(0, 0, this.size);
        } else if (this.shapeType == 2) {
            noStroke();
            rect(0, 0, this.size, this.size);
        } else if (this.shapeType == 3) {
            noFill();
            rect(0, 0, this.size * 0.9, this.size * 0.9);
        } else if (this.shapeType == 4) {
            line(0, -this.size * 0.45, 0, this.size * 0.45);
            line(-this.size * 0.45, 0, this.size * 0.45, 0);
        }
        pop();
        strokeWeight(this.lineSW);
        stroke(this.clr);
        line(this.x, this.y, this.fromX, this.fromY);
    }

    move() {
        let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
        if (0 < this.elapsedT && this.elapsedT < this.duration) {
            if (this.actionPoints == this.maxActionPoints) {
                this.size = lerp(0, this.sizeMax, n);
            } else if (this.actionPoints > 0) {
                if (this.animationType == 0) {
                    this.size = lerp(this.fromSize, this.toSize, n);
                } else if (this.animationType == 1) {
                    this.x = lerp(this.fromX, this.toX, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 2) {
                    this.y = lerp(this.fromY, this.toY, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 3) {
                    if (this.changeShape == true) {
                        this.shapeType = int(random(5));
                        this.changeShape = false;
                    }
                }
                this.reductionRatio = lerp(1, 0.3, sin(n * PI));
            } else {
                this.size = lerp(this.fromSize, 0, n);
            }
        }

        this.elapsedT++;
        if (this.elapsedT > this.duration) {
            this.actionPoints--;
            this.init();
        }
        if (this.actionPoints < 0) {
            this.isDead = true;
        }
    }

    run() {
        this.show();
        this.move();
    }

    init() {
        this.elapsedT = 0;
        this.fromSize = this.size;
        this.toSize = this.sizeMax * random(0.5, 1.5);
        this.fromX = this.x;
        this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
        this.fromY = this.y;
        this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
        this.animationType = int(random(3));
        this.duration = random(20, 50);
        this.changeShape = true; // 允許在下次動畫改變形狀
    }
}
}
