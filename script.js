const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;

let engine, render, runner;
const affirmations = [
    "Kamu melakukan yang terbaik ✨",
    "Satu langkah kecil tetaplah progres 🌿",
    "Pikiranmu berhak istirahat ☁️",
    "Pelan-pelan saja, tidak perlu buru-buru 🌸"
];

function initGame() {
    engine = Engine.create();
    render = Render.create({
        element: document.getElementById('game-canvas-area'),
        canvas: document.getElementById('gameCanvas'),
        options: {
            width: 350,
            height: 500,
            wireframes: false,
            background: 'transparent'
        }
    });

    // Membuat dinding transparan agar fokus pada buah
    const ground = Bodies.rectangle(175, 510, 350, 20, { isStatic: true, render: { fillStyle: '#d1f2eb' } });
    const leftWall = Bodies.rectangle(-10, 250, 20, 500, { isStatic: true });
    const rightWall = Bodies.rectangle(360, 250, 20, 500, { isStatic: true });

    Composite.add(engine.world, [ground, leftWall, rightWall]);
    
    Render.run(render);
    runner = Runner.create();
    Runner.run(runner, engine);

    setupInteractions();
}

function setupInteractions() {
    const canvas = document.getElementById('gameCanvas');
    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        // Buat buah (lingkaran) dengan warna pastel random
        const colors = ['#FFCFDF', '#FEFDED', '#D1F2EB', '#EADFB4'];
        const fruit = Bodies.circle(x, 30, 15 + Math.random() * 10, {
            restitution: 0.5, // Pantulan lembut
            render: { fillStyle: colors[Math.floor(Math.random() * colors.length)] }
        });
        
        Composite.add(engine.world, fruit);
        
        // Reward Emosional: Update afirmasi setiap beberapa klik
        if (Math.random() > 0.7) {
            document.getElementById('affirmation').innerText = affirmations[Math.floor(Math.random() * affirmations.length)];
        }
    });
}

// Logika Mindfulness Modal
setTimeout(() => {
    const btn = document.getElementById('start-btn');
    btn.disabled = false;
    btn.innerText = "Mulai Bermain Pelan-pelan";
    btn.onclick = () => {
        document.getElementById('mindfulness-modal').style.display = 'none';
        initGame();
        startFocusTimer();
    };
}, 5000); // 5 detik meditasi wajib

function startFocusTimer() {
    let timeLeft = 120; // 2 menit micro-session
    const timerDisplay = document.getElementById('focus-timer');
    
    const timer = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        timerDisplay.innerText = `Sesi Fokus: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Sesi selesai. Kamu hebat sudah fokus hari ini! 🌟");
        }
        timeLeft--;
    }, 1000);
}

function resetGame() {
    Composite.clear(engine.world, false);
    initGame();
}