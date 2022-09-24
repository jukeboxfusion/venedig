// import modules

// get all elements

const playButton = document.getElementById("playButton");
const obama = document.getElementById("obama");
const overlay = document.getElementById("overlay");

const container = document.getElementById("particleContainer");
const canvas = document.createElement("canvas");

let ROWS = 200;
let COLS = 400;

let NUM_PARTICLES = ROWS * COLS,
    THICKNESS = Math.pow(80, 2),
    SPACING = 3,
    MARGIN = 10,
    COLOR = 220,
    DRAG = 0.99,
    EASE = 0.25,
    particle,
    bounds,
    mouse,
    stats,
    list,
    ctx,
    tog,
    dx,
    dy,
    mx,
    my,
    d,
    t,
    f,
    a,
    b,
    i,
    n,
    w,
    h,
    p,
    s,
    r,
    c;

particle = {
    vx: 0,
    vy: 0,
    x: 0,
    y: 0,
};

const particleInit = () => {
    ctx = canvas.getContext("2d");
    tog = true;

    list = [];

    w = canvas.width = COLS * SPACING + MARGIN * 2;
    h = canvas.height = ROWS * SPACING + MARGIN * 2;

    container.style.marginLeft = Math.round(w * -0.5) + "px";
    container.style.marginTop = Math.round(h * -0.5) + "px";

    for (i = 0; i < NUM_PARTICLES; i++) {
        p = Object.create(particle);
        p.x = p.ox = MARGIN + SPACING * (i % COLS);
        p.y = p.oy = MARGIN + SPACING * Math.floor(i / COLS);

        list[i] = p;
    }

    container.addEventListener("mousemove", function (e) {
        bounds = container.getBoundingClientRect();
        mx = e.clientX - bounds.left;
        my = e.clientY - bounds.top;
    });

    container.appendChild(canvas);
};

const particleStep = () => {
    if ((tog = !tog)) {
        for (i = 0; i < NUM_PARTICLES; i++) {
            p = list[i];

            d = (dx = mx - p.x) * dx + (dy = my - p.y) * dy;
            f = -THICKNESS / d;

            if (d < THICKNESS) {
                t = Math.atan2(dy, dx);
                p.vx += f * Math.cos(t);
                p.vy += f * Math.sin(t);
            }

            p.x += (p.vx *= DRAG) + (p.ox - p.x) * EASE;
            p.y += (p.vy *= DRAG) + (p.oy - p.y) * EASE;
        }
    } else {
        b = (a = ctx.createImageData(w, h)).data;

        for (i = 0; i < NUM_PARTICLES; i++) {
            p = list[i];
            (b[(n = (~~p.x + ~~p.y * w) * 4)] = b[n + 1] = b[n + 2] = COLOR),
                (b[n + 3] = 255);
        }

        ctx.putImageData(a, 0, 0);
    }

    requestAnimationFrame(particleStep);
};

// variables

let audioCtx;
const samples = [];

// functions

const loadSamples = () => {
    let sampleFiles = fs.readdirSync("/samples");
    console.log(sampleFiles);
};

const init = () => {
    if (!audioCtx) {
        try {
            audioCtx = new AudioContext();
            overlay.style.display = "none";

            particleInit();
            particleStep();

            console.log("created audiocontext");
        } catch (e) {
            alert("Web Audio API is not supported in this browser");
        }
    }
};

function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer; // tell the source which sound to play
    source.connect(audioCtx.destination); // connect the source to the context's destination (the speakers)
    source.noteOn(0); // play the source now
}

const playRandom = () => {};

// event listener

playButton.addEventListener("click", init);
