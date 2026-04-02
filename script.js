const quotes = {
    hi: [
        "妳跑哪去了？是不是背著我偷吃炸雞了？",
        "看著我的眼睛——妳今天有沒有偷喝奶茶？",
        "報上體重，我沒耐心等妳！妳是以為裝死就會瘦嗎？",
        "喔，妳還知道要回來啊？我以為妳跟甜甜圈結婚了！"
    ],
    ok: [
        "紀錄好了。明天要是變胖，妳就死定了！",
        "很好，現在去給我喝水！離那台咖啡機遠一點！",
        "算妳識相。現在離冰箱遠點，聽到了嗎？",
        "不錯，晚餐給我吃草去，不准加醬！"
    ],
    no: [
        "今天量過了！去做深蹲別煩我！",
        "數字不會因為多量幾次就變小！腦袋清醒點！",
        "妳很閒嗎？去跑步！去喝水！不准再量體重計！"
    ],
    water: [
        "喝滿3000cc了？算妳乖，腦袋總算清醒點了。",
        "至少妳體內現在不是沙漠。繼續保持！",
        "水喝夠了？那妳現在應該沒空想零食了吧？"
    ]
};

let db = JSON.parse(localStorage.getItem('m_v11')) || { streak: 0, last: null, water: 0 };

function init() {
    document.getElementById('streakCount').innerText = db.streak;
    const g = document.getElementById('waterGrid');
    g.innerHTML = '';
    for(let i=0; i<8; i++) {
        let s = document.createElement('span');
        s.className = 'drop' + (i < db.water ? ' active' : '');
        s.innerText = '💧';
        s.onclick = () => { db.water = i + 1; save(); init(); if(db.water===8) talk(quotes.water); };
        g.appendChild(s);
    }
    document.getElementById('wLabel').innerText = `${db.water * 375} / 3000 cc`;
    
    const today = new Date().toDateString();
    if(db.last !== today) talk(quotes.hi);
    else talk(["「今天已經紀錄過了，妳還想聽我碎碎念嗎？」"]);
    
    checkF();
}

function talk(a) {
    const msg = Array.isArray(a) ? a[Math.floor(Math.random()*a.length)] : a;
    document.getElementById('speech').innerText = "「" + msg + "」";
}

function saveLog() {
    const w = document.getElementById('weightVal').value;
    const t = new Date().toDateString();
    if(!w) return alert("輸入數字！妳是以為逃避有用嗎？");
    if(db.last === t) return talk(quotes.no);
    db.streak++; db.last = t; db.water = 0; save(); init(); talk(quotes.ok);
}

function checkF() {
    const n = new Date(); const d = n.getDay(); const h = n.getHours();
    let m = (d===1 && h>=18) ? "🚫 週一：36H 斷食啟動！" : (d===2 ? "⏳ 週二：斷食中，別裝死！" : "✅ 進食窗口開放。別吃得像要世界末日！");
    document.getElementById('fastStatus').innerText = m;
}

function save() { localStorage.setItem('m_v11', JSON.stringify(db)); }
init();
