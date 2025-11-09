let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];

// 添加全局變量
let showingHomePage = false;
let showingQuiz = false;
// ...existing code...

// 測驗相關變量
let questions = [];         // 所有題目
let currentQuestions = [];  // 當前測驗的題目
let currentQuestion = 0;    // 當前題目索引
let userAnswers = [];      // 用戶答案
let score = 0;             // 分數
let quizComplete = false;  // 測驗是否完成
let table;                 // CSV數據

// 按鈕位置
let buttons = [];
let buttonWidth = 400;
let buttonHeight = 50;

function setup() {
	let canvas = createCanvas(800, 600);
	// 計算畫布的位置，使其置中
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	canvas.parent('sketch-holder');
	canvas.style('margin', 'auto');
	canvas.style('display', 'block');
	rectMode(CENTER);
	// 添加滑鼠移動事件監聽
	canvas.mouseOver(() => {
		checkMousePosition();
	});
	canvas.mouseOut(() => {
		hideMenu();
	});
	objs.push(new DynamicShape());
}

function draw() {
	background(0);
	// 檢查滑鼠位置
	checkMousePosition();
	// ...existing code...
	// 更新和顯示所有物件
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
		text("414730761", width/2, height/2);
		text("鄭若芹", width/2, height/2 + 60);
		pop();
	}
}

function showQuestionMenu() {
	startQuiz();
}

function drawQuestionMenu() {
	// 題目選單功能已移除
}

function mousePressed() {
	// ...existing code...
	// ...existing code...

function startQuiz() {
	showingQuiz = true;
	showingQuestionMenu = false;
	quizComplete = false;
	currentQuestion = 0;
	score = 0;
	userAnswers = [];
	// 隨機選擇4題
	currentQuestions = [];
	let tempQuestions = [...questions];
	for (let i = 0; i < 4; i++) {
		let index = floor(random(tempQuestions.length));
		currentQuestions.push(tempQuestions[index]);
		tempQuestions.splice(index, 1);
	}
}
}

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
    document.getElementById('side-menu').classList.remove('show');
}

// 顯示 iframe
function showIframe(url) {
    const iframe = document.getElementById('content-iframe');
    const container = document.getElementById('iframe-container');
    iframe.src = url;
    container.classList.add('show');
}

// 關閉 iframe
function closeIframe() {
    const container = document.getElementById('iframe-container');
    const iframe = document.getElementById('content-iframe');
    container.classList.remove('show');
    iframe.src = '';
}

// 顯示首頁
function showHomePage() {
    showingHomePage = true;
    // 隱藏選單
    hideMenu();
}

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
	}
}