// 获取DOM元素
const salaryInput = document.getElementById('salaryInput');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const monthlySalary = document.getElementById('monthlySalary');
const dailySalary = document.getElementById('dailySalary');
const hourlySalary = document.getElementById('hourlySalary');
const minuteSalary = document.getElementById('minuteSalary');
const secondSalary = document.getElementById('secondSalary');
const accumulatedIncome = document.getElementById('accumulatedIncome');
const coinContainer = document.querySelector('.coin-container');
const coinSound = document.getElementById('coinSound');
const coinAnimation = document.querySelector('.coin-animation');
const counterDisplay = document.getElementById('counterDisplay');
const progressBar = document.getElementById('progressBar');

// 全局变量
let calculationInterval = null;
let currentAccumulatedIncome = 0;
let secondRate = 0;
let startTime = 0;
let isCalculating = false;
let counter = 0;

// 计算按钮点击事件
calculateBtn.addEventListener('click', function() {
    if (!isCalculating) {
        startCalculation();
    } else {
        stopCalculation();
    }
});

// 重置按钮点击事件
resetBtn?.addEventListener('click', resetCalculation);

// 回车键事件监听
salaryInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (!isCalculating) {
            startCalculation();
        }
    }
});

// 开始计算的函数
function startCalculation() {
    // 获取输入的月薪
    const salary = parseFloat(salaryInput.value);
    
    // 验证输入
    if (isNaN(salary) || salary < 0) {
        alert('请输入有效的月薪金额！');
        salaryInput.value = '';
        return;
    }
    
    // 计算各项收入
    // 假设一个月工作22天，每天工作8小时
    const daysPerMonth = 22;
    const hoursPerDay = 8;
    
    const daily = salary / daysPerMonth;
    const hourly = daily / hoursPerDay;
    const minute = hourly / 60;
    secondRate = minute / 60;
    
    // 更新显示结果
    updateResultElement(monthlySalary, salary);
    updateResultElement(dailySalary, daily);
    updateResultElement(hourlySalary, hourly);
    updateResultElement(minuteSalary, minute);
    updateResultElement(secondSalary, secondRate);
    
    // 重置累计收入
    currentAccumulatedIncome = 0;
    updateResultElement(accumulatedIncome, currentAccumulatedIncome);
    
    // 禁用输入和更改按钮文本
    salaryInput.disabled = true;
    calculateBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
    
    // 记录开始时间
    startTime = Date.now();
    isCalculating = true;
    counter = 0;
    counterDisplay.textContent = '0';
    
    // 启动实时更新
    if (calculationInterval) {
        clearInterval(calculationInterval);
    }
    calculationInterval = setInterval(updateAccumulatedIncome, 50); // 每50ms更新一次，提升流畅度
    
    // 添加初始数字动画效果
    addNumberAnimation();
}

// 停止计算的函数
function stopCalculation() {
    if (calculationInterval) {
        clearInterval(calculationInterval);
        calculationInterval = null;
    }
    
    isCalculating = false;
    calculateBtn.innerHTML = '<i class="fas fa-play"></i> 继续';
}

// 重置计算的函数
function resetCalculation() {
    // 停止计算
    stopCalculation();
    
    // 重置所有显示
    updateResultElement(monthlySalary, 0);
    updateResultElement(dailySalary, 0);
    updateResultElement(hourlySalary, 0);
    updateResultElement(minuteSalary, 0);
    updateResultElement(secondSalary, 0);
    updateResultElement(accumulatedIncome, 0);
    
    // 清空输入和启用输入框
    salaryInput.value = '';
    salaryInput.disabled = false;
    
    // 重置按钮文本
    calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> 开始计算';
    
    // 清空金币容器
    coinContainer.innerHTML = '';
    
    // 重置计数器
    counterDisplay.textContent = '0';
    counter = 0;
    
    // 重置进度条
    progressBar.style.width = '0%';
}

// 更新累计收入的函数
function updateAccumulatedIncome() {
    // 计算经过的时间和应增加的收入
    const elapsedTime = (Date.now() - startTime) / 1000; // 转换为秒
    currentAccumulatedIncome = secondRate * elapsedTime;
    
    // 更新累计收入显示
    updateResultElement(accumulatedIncome, currentAccumulatedIncome);
    
    // 更新计数器
    counter++;
    counterDisplay.textContent = Math.floor(counter / 20).toString(); // 约每秒计数一次
    
    // 更新进度条（模拟达到1元的进度）
    const progress = Math.min((currentAccumulatedIncome % 1) * 100, 100);
    progressBar.style.width = `${progress}%`;
    
    // 添加实时视觉反馈
    addRealTimeVisualFeedback();
    
    // 定期触发金币动画（每秒一次）
    if (counter % 20 === 0) {
        triggerPeriodicCoinAnimation();
    }
}

// 更新结果元素的函数
function updateResultElement(element, value) {
    // 格式化金额为人民币格式
    const formattedValue = '¥' + value.toFixed(2);
    element.textContent = formattedValue;
}

// 触发金币动画的函数
function triggerCoinAnimation(coinCount) {
    // 创建金币元素
    for (let i = 0; i < coinCount; i++) {
        setTimeout(() => {
            createCoin(i);
            playCoinSound();
        }, i * 200); // 每个金币间隔200毫秒出现
    }
    
    // 为每秒收入添加弹跳动画
    coinAnimation.style.animation = 'bounce 1s ease-in-out';
    setTimeout(() => {
        coinAnimation.style.animation = '';
    }, 1000);
}

// 定期触发金币动画的函数
function triggerPeriodicCoinAnimation() {
    // 根据每秒收入决定是否触发金币动画
    if (secondRate > 0) {
        // 计算应该生成的金币数量（基于每秒收入）
        const coinCount = Math.max(1, Math.floor(secondRate * 5)); // 放大5倍，确保至少有1个金币
        
        // 创建金币元素
        const randomDelay = Math.random() * 0.5; // 随机延迟，增加动画变化
        setTimeout(() => {
            createCoin(Math.random());
            if (Math.random() > 0.3) { // 70%概率播放声音
                playCoinSound();
            }
        }, randomDelay * 1000);
    }
}

// 添加实时视觉反馈的函数
function addRealTimeVisualFeedback() {
    // 轻微的数字闪烁效果
    accumulatedIncome.style.opacity = '0.95';
    setTimeout(() => {
        accumulatedIncome.style.opacity = '1';
    }, 20);
    
    // 当累计收入达到整数时的特殊效果
    if (Math.floor(currentAccumulatedIncome) !== Math.floor(currentAccumulatedIncome - secondRate * 0.05)) {
        // 整数里程碑效果
        accumulatedIncome.classList.add('milestone-flash');
        setTimeout(() => {
            accumulatedIncome.classList.remove('milestone-flash');
        }, 300);
        
        // 触发金币动画
        triggerCoinAnimation(1);
    }
}

// 创建金币元素的函数
function createCoin(index) {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.textContent = '¥';
    
    // 设置金币的初始位置和动画延迟
    const randomX = Math.random() * 80 - 40; // -40% 到 40%
    coin.style.left = `calc(50% + ${randomX}%)`;
    coin.style.animationDelay = `${index * 0.1}s`;
    
    // 添加旋转动画
    coin.style.animation = 'coinFall 3s ease-in-out forwards';
    
    // 添加到容器
    coinContainer.appendChild(coin);
    
    // 3秒后移除金币元素
    setTimeout(() => {
        if (coinContainer.contains(coin)) {
            coinContainer.removeChild(coin);
        }
    }, 3000);
}

// 播放金币声音的函数
function playCoinSound() {
    // 重置声音播放位置
    coinSound.currentTime = 0;
    
    // 播放声音
    try {
        coinSound.play().catch(e => {
            console.log('自动播放被阻止，需要用户交互:', e);
            // 如果自动播放被阻止，可以不做任何处理
        });
    } catch (error) {
        console.log('播放声音时出错:', error);
    }
}

// 添加数字动画效果的函数
function addNumberAnimation() {
    const resultValues = document.querySelectorAll('.result-value');
    
    resultValues.forEach(value => {
        // 添加闪烁效果
        value.style.opacity = '0.5';
        setTimeout(() => {
            value.style.opacity = '1';
        }, 200);
    });
}

// 为输入框添加数字格式化功能
salaryInput.addEventListener('input', function(e) {
    // 移除非数字字符
    let value = e.target.value.replace(/[^\d.]/g, '');
    
    // 确保只有一个小数点
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    e.target.value = value;
});

// 添加页面加载动画
window.addEventListener('DOMContentLoaded', function() {
    // 为计算器卡片添加淡入效果
    const calculatorCard = document.querySelector('.calculator-card');
    calculatorCard.style.opacity = '0';
    calculatorCard.style.transform = 'translateY(20px)';
    calculatorCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
        calculatorCard.style.opacity = '1';
        calculatorCard.style.transform = 'translateY(0)';
    }, 200);
    
    // 为信息面板添加淡入效果
    const infoPanel = document.querySelector('.info-panel');
    infoPanel.style.opacity = '0';
    infoPanel.style.transform = 'translateY(20px)';
    infoPanel.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
        infoPanel.style.opacity = '1';
        infoPanel.style.transform = 'translateY(0)';
    }, 500);
});

// 添加键盘快捷键提示
const keyboardShortcutInfo = () => {
    // 这里可以添加键盘快捷键的提示功能
    // 例如，显示一个临时提示，说明可以按Enter键计算
};

// 初始化声音（修复某些浏览器的自动播放限制）
function initSound() {
    // 添加一个用户交互事件来初始化声音
    document.addEventListener('click', function init() {
        // 尝试播放一个非常短的无声片段来初始化音频上下文
        const tempSound = new Audio();
        tempSound.volume = 0;
        tempSound.play().catch(e => {
            console.log('音频上下文初始化:', e);
        });
        
        // 只初始化一次
        document.removeEventListener('click', init);
    }, { once: true });
}

// 初始化应用
initSound();