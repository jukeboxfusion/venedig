// import modules

// get all elements

const startContext = document.getElementById("startContext");
const obama = document.getElementById("obama");
const overlay = document.getElementById("overlay");

const container = document.getElementById("particleContainer");
const canvas = document.createElement("canvas");

const playPause = document.getElementById("playPause");

let musicPlaying = false;

const samples = [];
const NUMBER_OF_SAMPLES = 59;

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

    canvas.addEventListener("click", playSound);

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

const loadSamples = () => {
    for (let i = 1; i <= NUMBER_OF_SAMPLES; i++) {
        samples.push(
            new Wad({
                source: "../audio/samples/sample_" + i + ".wav",
                delay: {},
                panning: 0,
                panningModel: "HRTF",
                rolloffFactor: 1,
            })
        );
    }
};

// variables

let audioCtx;

// functions

const init = () => {
    if (!audioCtx) {
        try {
            audioCtx = new AudioContext();

            let parentNode = startContext.parentElement;
            parentNode.remove();

            playPause.style.display = "block";

            particleInit();
            particleStep();

            loadSamples();

            loopify("../audio/ambient.wav", ready);

            console.log("created audiocontext");
        } catch (e) {
            alert("Web Audio API is not supported in this browser");
        }
    }
};

const getRandomNumber = (max) => {
    return Math.floor(Math.random() * max);
};

const getRandomMinMax = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const ready = (err, loop) => {
    if (err) {
        console.warn(err);
    }

    loop.play();

    playPause.addEventListener("click", () => {
        musicPlaying = !musicPlaying;

        if (musicPlaying) loop.stop();
        else loop.play();
    });
};

const playSound = (e) => {
    console.log(e.pageX, e.pageY);
    let rnd = getRandomNumber(NUMBER_OF_SAMPLES);
    let rndDelayTime = Math.random() * 2;
    let rndFeedback = Math.random() * 1;
    let rndPan = Math.random() * 2;

    const parameters = {
        delay: {
            feedback: rndFeedback,
            wet: 1,
            delayTime: rndDelayTime,
        },
    };
    //   panning: [
    //     getRandomMinMax(-50, 50),
    //     getRandomMinMax(-50, 50),
    //     getRandomMinMax(-50, 50),
    // ],

    samples[rnd].play(parameters);
};

const playRandom = () => {};

// wait till everything is loaded

window.addEventListener("load", () => {
    startContext.addEventListener("click", init);
});
