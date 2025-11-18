/*  ————————————————————————————————
    VOLUNTARIST PHILOSOPHY TEST ENGINE
    ———————————————————————————————— */

/* Save answers from each section */
function saveSection(sectionNumber) {
    let answers = {};

    for (let i = 1; i <= 10; i++) {
        let id = `q${(sectionNumber - 1) * 10 + i}`;
        let value = document.getElementById(id).value;
        answers[id] = value;
    }

    localStorage.setItem(`section${sectionNumber}`, JSON.stringify(answers));

    if (sectionNumber < 6) {
        window.location.href = `questions${sectionNumber + 1}.html`;
    } else {
        window.location.href = "results.html";
    }
}

/* Load all answers and compute final scores */
function calculateResults() {
    let allAnswers = {};

    for (let s = 1; s <= 6; s++) {
        let sectionData = JSON.parse(localStorage.getItem(`section${s}`));
        Object.assign(allAnswers, sectionData);
    }

    let converted = {};
    for (let key in allAnswers) {
        let val = parseInt(allAnswers[key]);
        converted[key] = val - 4;
    }

    function sum(arr) {
        return arr.reduce((total, q) => {
            let key = "q" + q;
            return total + converted[key];
        }, 0);
    }

    let left = sum([
        11,12,13,14,15,16,17,18,19,20,
        31,32,33,34,35,36,37,38,39,40,
        41,42,43,44,45,46,47,48,49,50,
        51,52,53,54,55,56,57,58,59,60
    ]);

    let right = sum([21,22,23,24,25,26,27,28,29,30]);

    let horizontal = right - left;

    let up = sum([
        1,2,3,4,5,6,7,8,9,10,
        41,42,43,44,45,46,47,48,49,50,
        51,52,53,54,55,56,57,58,59,60
    ]);

    let down = sum([21,22,23,24,25,26,27,28,29,30]);

    let vertical = up - down;

    drawCompass(horizontal, vertical);
    generateReport(horizontal, vertical);
}

/* Draw Compass */
function drawCompass(x, y) {

    let canvas = document.getElementById("compassCanvas");
    let ctx = canvas.getContext("2d");

    const size = 400;
    const half = size / 2;

    const quadColors = {
        tl: "#f6aaaa",
        tr: "#aaccff",
        bl: "#aaffaa",
        br: "#fff5aa"
    };

    ctx.fillStyle = quadColors.tl;
    ctx.fillRect(0,0,half,half);

    ctx.fillStyle = quadColors.tr;
    ctx.fillRect(half,0,half,half);

    ctx.fillStyle = quadColors.bl;
    ctx.fillRect(0,half,half,half);

    ctx.fillStyle = quadColors.br;
    ctx.fillRect(half,half,half,half);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(half,0);
    ctx.lineTo(half,size);
    ctx.moveTo(0,half);
    ctx.lineTo(size,half);
    ctx.stroke();

    const scale = 20;
    let dotX = half + x * scale;
    let dotY = half - y * scale;

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fill();
}

/* Generate Text Report */
function generateReport(x, y) {
    let text = "";

    if (x > 10) text += "<strong>You strongly align with Harm-Based Morality.</strong><br>"
