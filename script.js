/* -----------------------------------------------------------
   VOLUNTARIST PHILOSOPHY TEST ENGINE (FULL WORKING VERSION)
----------------------------------------------------------- */

/* Save answers from each section */
function saveSection(sectionNumber) {
    let answers = {};

    // Collect q1–q10 for this page
    for (let i = 1; i <= 10; i++) {
        let id = `q${(sectionNumber - 1) * 10 + i}`;
        let value = document.getElementById(id).value;
        answers[id] = value;
    }

    // Store in browser
    localStorage.setItem(`section${sectionNumber}`, JSON.stringify(answers));

    // Move to next page
    if (sectionNumber < 6) {
        window.location.href = `questions${sectionNumber + 1}.html`;
    } else {
        window.location.href = "results.html";
    }
}

/* Load all answers and compute final scores */
function calculateResults() {
    let allAnswers = {};

    // Merge sections (1–6)
    for (let s = 1; s <= 6; s++) {
        let stored = localStorage.getItem(`section${s}`);
        if (stored) {
            Object.assign(allAnswers, JSON.parse(stored));
        }
    }

    // Convert 1–7 to -3 to +3
    let converted = {};
    for (let key in allAnswers) {
        converted[key] = parseInt(allAnswers[key]) - 4;
    }

    // Helper function
    function sum(arr) {
        return arr.reduce((t, q) => t + converted["q" + q], 0);
    }

    /* -------------------------------
       HORIZONTAL AXIS (Rule ↔ Harm)
    ------------------------------- */

    let left = sum([
        11,12,13,14,15,16,17,18,19,20,
        31,32,33,34,35,36,37,38,39,40,
        41,42,43,44,45,46,47,48,49,50,
        51,52,53,54,55,56,57,58,59,60
    ]);

    let right = sum([21,22,23,24,25,26,27,28,29,30]);

    let horizontal = right - left; // positive = Harm-Based


    /* -------------------------------
       VERTICAL AXIS (Auth ↔ Voluntarist)
    ------------------------------- */

    let up = sum([
        1,2,3,4,5,6,7,8,9,10,
        41,42,43,44,45,46,47,48,49,50,
        51,52,53,54,55,56,57,58,59,60
    ]);

    let down = sum([21,22,23,24,25,26,27,28,29,30]);

    let vertical = up - down; // negative = Voluntarist


    // Draw compass
    drawCompass(horizontal, vertical);

    // Text explanation
    generateReport(horizontal, vertical);
}

/* -----------------------------------------------------------
   DRAW GRAPH
----------------------------------------------------------- */
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

    ctx.fillStyle = quadColors.tl; ctx.fillRect(0,0,half,half);
    ctx.fillStyle = quadColors.tr; ctx.fillRect(half,0,half,half);
    ctx.fillStyle = quadColors.bl; ctx.fillRect(0,half,half,half);
    ctx.fillStyle = quadColors.br; ctx.fillRect(half,half,half,half);

    ctx.strokeStyle = "#000"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(half,0); ctx.lineTo(half,size);
    ctx.moveTo(0,half); ctx.lineTo(size,half);
    ctx.stroke();

    const scale = 20;
    let dotX = half + x * scale;
    let dotY = half - y * scale;

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fill();
}

/* -----------------------------------------------------------
   RESULT TEXT
----------------------------------------------------------- */
function generateReport(x, y) {
    let t = "";

    // Horizontal
    if (x > 10) t += "<strong>You strongly align with Harm-Based Morality.</strong><br>";
    else if (x > 0) t += "<strong>You lean toward Harm-Based Morality.</strong><br>";
    else if (x < -10) t += "<strong>You strongly align with Rule-Based Morality.</strong><br>";
    else t += "<strong>You lean toward Rule-Based Morality.</strong><br>";

    // Vertical
    if (y > 10) t += "You strongly lean Authoritarian.<br>";
    else if (y > 0) t += "You lean Authoritarian.<br>";
    else if (y < -10) t += "You strongly lean Voluntarist.<br>";
    else t += "You lean Voluntarist.<br>";

    document.getElementById("resultText").innerHTML = t;
}

/* -----------------------------------------------------------
   SLIDER LABEL UPDATES  (works on all pages)
----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll('.slider').forEach(slider => {
        const valueLabel = slider.nextElementSibling;

        const labels = {
            1: "Strongly Disagree",
            2: "Disagree",
            3: "Slightly Disagree",
            4: "Neutral",
            5: "Slightly Agree",
            6: "Agree",
            7: "Strongly Agree"
        };

        // Set initial value
        valueLabel.textContent = labels[slider.value];

        // Update on slide
        slider.addEventListener('input', () => {
            valueLabel.textContent = labels[slider.value];
        });
    });

});
