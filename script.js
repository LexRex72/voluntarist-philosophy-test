/*  ————————————————————————————————
    VOLUNTARIST PHILOSOPHY TEST ENGINE
    ———————————————————————————————— */

/* Save answers from each section */
function saveSection(sectionNumber) {
    let answers = {};

    // Collect slider values in q1, q2, q3... format
    for (let i = 1; i <= 10; i++) {
        let id = `q${(sectionNumber - 1) * 10 + i}`;
        let value = document.getElementById(id).value;
        answers[id] = value;
    }

    // Save to localStorage (keeps everything between pages)
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

    // Merge all stored sections
    for (let s = 1; s <= 6; s++) {
        let sectionData = JSON.parse(localStorage.getItem(`section${s}`));
        Object.assign(allAnswers, sectionData);
    }

    // Convert slider values (1–7) into -3 to +3
    let converted = {};
    for (let key in allAnswers) {
        let val = parseInt(allAnswers[key]);
        converted[key] = val - 4; // 1→-3, 7→+3
    }

    // ————————————————————————————————
    // AXIS CALCULATIONS
    // ————————————————————————————————

    // Horizontal Axis: Rule-Based ↔ Harm-Based
    // LEFT side (Rule-Based Morality)
    let left = sum([
        11,12,13,14,15,16,17,18,19,20,
        31,32,33,34,35,36,37,38,39,40,
        41,42,43,44,45,46,47,48,49,50,
        51,52,53,54,55,56,57,58,59,60
    ]);

    // RIGHT side (Harm-Based Morality)
    let right = sum([21,22,23,24,25,26,27,28,29,30]);

    // Final horizontal score
    let horizontal = right - left; // positive = harm-based

    // Vertical Axis: Authoritarian ↔ Voluntarist
    // UP (Authoritarian)
    let up = sum([
        1,2,3,4,5,6,7,8,9,10,
        41,42,43,44,45,46,47,48,49,50,
        51,52,53,54,55,56,57,58,59,60
    ]);

    // DOWN (Voluntarist)
    let down = sum([21,22,23,24,25,26,27,28,29,30]);

    let vertical = up - down; // negative = voluntarist

    // Draw the graph
    drawCompass(horizontal, vertical);

    // Add text breakdown
    generateReport(horizontal, vertical);



    // ————————————————————————————————
    // HELPER FUNCTION
    // ————————————————————————————————
    function sum(arr) {
        return arr.reduce((total, q) => {
            let key = "q" + q;
            return total + converted[key];
        }, 0);
    }
}


/*  ————————————————————————————————
    DRAW THE COMPASS GRID + DOT
    ———————————————————————————————— */

function drawCompass(x, y) {

    let canvas = document.getElementById("compassCanvas");
    let ctx = canvas.getContext("2d");

    // Grid size
    const size = 400;
    const half = size / 2;

    // Colors (matching your chosen style)
    const quadColors = {
        tl: "#f6aaaa",
        tr: "#aaccff",
        bl: "#aaffaa",
        br: "#fff5aa"
    };

    // Fill quadrants
    ctx.fillStyle = quadColors.tl;
    ctx.fillRect(0,0,half,half);

    ctx.fillStyle = quadColors.tr;
    ctx.fillRect(half,0,half,half);

    ctx.fillStyle = quadColors.bl;
    ctx.fillRect(0,half,half,half);

    ctx.fillStyle = quadColors.br;
    ctx.fillRect(half,half,half,half);

    // Center lines
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(half,0);
    ctx.lineTo(half,size);
    ctx.moveTo(0,half);
    ctx.lineTo(size,half);
    ctx.stroke();

    // Normalize x/y to the grid (max 10 in any direction)
    const scale = 20; // 20px per score unit (fits well)
    let dotX = half + x * scale;
    let dotY = half - y * scale;

    // Draw the dot
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fill();
}


/*  ————————————————————————————————
    TEXT EXPLANATION BASED ON SCORES
    ———————————————————————————————— */

function generateReport(x, y) {
    let text = "";

    // Horizontal interpretation
    if (x > 10) text += "<strong>You strongly align with Harm-Based Morality.</strong><br>";
    else if (x > 0) text += "<strong>You lean toward Harm-Based Morality.</strong><br>";
    else if (x < -10) text += "<strong>You strongly align with Rule-Based Morality.</strong><br>";
    else text += "<strong>You lean toward Rule-Based Morality.</strong><br>";

    // Vertical interpretation
    if (y > 10) text += "You strongly lean Authoritarian.<br>";
    else if (y > 0) text += "You lean Authoritarian.<br>";
    else if (y < -10) text += "You strongly lean Voluntarist.<br>";
    else text += "You lean Voluntarist.<br>";

    // Combine
    document.getElementById("resultText").innerHTML = text;
}
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

    valueLabel.textContent = labels[slider.value];

    slider.addEventListener('input', () => {
        valueLabel.textContent = labels[slider.value];
    });
});
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

        valueLabel.textContent = labels[slider.value];

        slider.addEventListener('input', () => {
            valueLabel.textContent = labels[slider.value];
        });
    });

});


