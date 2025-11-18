/* --------------------------
   SLIDER LABELS
-------------------------- */

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.slider').forEach(slider => {
        const label = slider.nextElementSibling;

        const words = {
            1: "Strongly Disagree",
            2: "Disagree",
            3: "Slightly Disagree",
            4: "Neutral",
            5: "Slightly Agree",
            6: "Agree",
            7: "Strongly Agree"
        };

        label.textContent = words[slider.value];

        slider.addEventListener("input", () => {
            label.textContent = words[slider.value];
        });
    });
});

/* --------------------------
   SAVE SECTION
-------------------------- */

function saveSection(section) {
    let answers = {};

    for (let i = 1; i <= 10; i++) {
        let id = `q${(section - 1) * 10 + i}`;
        answers[id] = document.getElementById(id).value;
    }

    localStorage.setItem(`section${section}`, JSON.stringify(answers));

    if (section < 6) {
        location.href = `questions${section + 1}.html`;
    } else {
        location.href = "results.html";
    }
}

/* --------------------------
   CALCULATE RESULTS
-------------------------- */

function calculateResults() {
    let all = {};

    for (let s = 1; s <= 6; s++) {
        Object.assign(all, JSON.parse(localStorage.getItem(`section${s}`)));
    }

    let conv = {};
    for (let key in all) conv[key] = parseInt(all[key]) - 4;

    function sum(arr) {
        return arr.reduce((t, q) => t + conv["q" + q], 0);
    }

    let horizontal = sum([21,22,23,24,25,26,27,28,29,30]) -
                     sum([11,12,13,14,15,16,17,18,19,20,
                          31,32,33,34,35,36,37,38,39,40,
                          41,42,43,44,45,46,47,48,49,50,
                          51,52,53,54,55,56,57,58,59,60]);

    let vertical = sum([1,2,3,4,5,6,7,8,9,10,
                        41,42,43,44,45,46,47,48,49,50,
                        51,52,53,54,55,56,57,58,59,60]) -
                   sum([21,22,23,24,25,26,27,28,29,30]);

    drawCompass(horizontal, vertical);
    showText(horizontal, vertical);
}

/* --------------------------
   GRAPH
-------------------------- */

function drawCompass(x, y) {
    let c = document.getElementById("compassCanvas");
    let ctx = c.getContext("2d");
    let size = 400, half = size/2;

    ctx.fillStyle = "#f6aaaa"; ctx.fillRect(0,0,half,half);
    ctx.fillStyle = "#aaccff"; ctx.fillRect(half,0,half,half);
    ctx.fillStyle = "#aaffaa"; ctx.fillRect(0,half,half,half);
    ctx.fillStyle = "#fff5aa"; ctx.fillRect(half,half,half,half);

    ctx.strokeStyle = "#000"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(half,0); ctx.lineTo(half,size);
    ctx.moveTo(0,half); ctx.lineTo(size,half);
    ctx.stroke();

    let px = half + x*20;
    let py = half - y*20;

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI*2);
    ctx.fill();
}

/* --------------------------
   RESULT TEXT
-------------------------- */

function showText(x, y) {
    let t = "";

    t += x > 0 ? "You lean toward Harm-Based Morality.<br>" :
         x < 0 ? "You lean toward Rule-Based Morality.<br>" :
                 "You are balanced on moral orientation.<br>";

    t += y > 0 ? "You lean Authoritarian.<br>" :
         y < 0 ? "You lean Voluntarist.<br>" :
                 "You are centered on authority orientation.<br>";

    document.getElementById("resultText").innerHTML = t;
}
