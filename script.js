const quotes = {
    hi: ["妳跑哪去了？是不是偷吃炸雞了？", "報上體重，我沒耐心等妳！", "看看妳那肚子，還不趕快紀錄！", "妳今天最好給我帶點好消息。"],
    ok: ["紀錄好了，明天要是變胖妳就死定了！", "很好，現在去給我喝水！", "算妳識相，現在離冰箱遠點！", "不錯，繼續保持這股氣勢。"],
    no: ["今天量過了！去做深蹲別煩我！", "數字不會因為多量幾次就變小！", "妳很閒嗎？去喝水！"],
    water: ["喝滿3000cc了？算妳乖！", "至少妳現在體內不是乾的了。", "水喝夠了？那就別想著零食！"]
};

let db = JSON.parse(localStorage.getItem('m_v9')) || { streak: 0, last: null, water: 0 };

function init() {
    document.getElementById('streakCount').innerText = db.streak;
    const g = document.getElementById('waterGrid');
    g.innerHTML = '';
    for(let i=0; i<8; i++) {
        let s = document.createElement('span');
        s.className = 'drop' + (i < db.water ? ' active' : '');
        s.innerText = '💧';
        s.onclick = () => drink(i);
        g.appendChild(s);
    }
    if(db.last !== new Date().toDateString()) talk(quotes.hi);
    else talk(["今天已經紀錄過了，去做點有意義的事！"]);
    checkF();
}

function talk(a) {
    const msg = Array.isArray(a) ? a[Math.floor(Math.random()*a.length)] : a;
    document.getElementById('speech').innerText = "「" + msg + "」";
}

function saveLog() {
    const w = document.getElementById('weightVal').value;
    const t = new Date().toDateString();
    if(!w) return alert("輸入數字！");
    if(db.last === t) return talk(quotes.no);
    db.streak++; db.last = t; db.water = 0; 
    save(); init(); talk(quotes.ok);
}

function drink(i) {
    db.water = i + 1; 
    save(); 
    const ds = document.querySelectorAll('.drop');
    ds.forEach((d, idx) => d.className = 'drop' + (idx < db.water ? ' active' : ''));
    if(db.water === 8) talk(quotes.water);
}

function checkF() {
    const n = new Date(); const d = n.getDay(); const h = n.getHours();
    let m = (d===1 && h>=18) ? "🚫 36H 斷食開始！" : (d===2 ? "⏳ 斷食中，撐住！" : "✅ 進食窗口開放。");
    document.getElementById('fastStatus').innerText = m;
}

function save() { localStorage.setItem('m_v9', JSON.stringify(db)); }

// 啟動程式
init();
