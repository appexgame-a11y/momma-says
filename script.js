const quotes = {
    // 剛打開 App 或一段時間沒紀錄時
    hi: [
        "妳跑哪去了？是不是背著我偷吃炸雞了？",
        "報上體重，我沒耐心等妳！",
        "看看妳那肚子，還不趕快紀錄！妳是以為裝死就會瘦嗎？",
        "妳今天最好給我帶點好消息，不然別怪我嘴狠。",
        "喔，妳還知道要回來啊？我以為妳已經被甜甜圈綁架了。",
        "別在那發呆！鍵盤敲再快也不會消耗熱量，給我量體重！"
    ],
    // 成功紀錄體重後
    ok: [
        "紀錄好了。明天要是數字變大，妳就死定了，知道嗎？",
        "很好，現在去給我喝水！離那台咖啡機遠一點！",
        "算妳識相。現在去旁邊待著，不准靠近廚房！",
        "不錯，繼續保持這股氣勢。但別以為這樣就能吃宵夜！",
        "寫下來了。這種自律才是我女兒，聽到了嗎？",
        "數字還行，但別高興太早，晚餐給我吃草去！"
    ],
    // 同一天想重複紀錄時
    no: [
        "今天量過了！去做深蹲別煩我！",
        "數字不會因為多量幾次就變小！妳是腦袋進水了嗎？",
        "妳很閒嗎？去喝水！去運動！就是不准再量體重！",
        "量一次是紀錄，量兩次是焦慮。給我放下體重計！"
    ],
    // 達成 3000cc 飲水目標時
    water: [
        "喝滿 3000cc 了？算妳乖，腦袋總算清醒點了。",
        "很好，至少妳現在體內不是乾的了。繼續保持！",
        "水喝夠了？那妳現在應該沒空去想那些含糖飲料了吧？",
        "不錯！把妳體內的垃圾都給我排掉！"
    ],
    // 隨機鼓勵（或挑釁）
    random: [
        "妳今天喝水了嗎？沒喝的話就閉嘴！",
        "斷食時間還沒到？那也不代表妳可以亂吃！",
        "看著我的眼睛——妳今天有沒有偷喝奶茶？"
    ]
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
    
    const today = new Date().toDateString();
    if(db.last !== today) {
        talk(quotes.hi); // 沒紀錄就噴 welcome 語
    } else {
        // 已紀錄時，隨機選「重複紀錄」或「隨機挑釁」
        const pool = Math.random() > 0.5 ? quotes.no : quotes.random;
        talk(pool);
    }
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
