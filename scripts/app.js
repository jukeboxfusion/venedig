// import modules

// get all elements

const startContext = document.getElementById("startContext");

const container = document.getElementById("particleContainer");
const canvas = document.createElement("canvas");

// every 10ms
const TIME_TIL_MAX_VOL = 3000;

const playPause = document.getElementById("playPause");

let musicPlaying = false;

const samples = [];
const NUMBER_OF_SAMPLES = 59;

let imgWidth = 250;
let imgHeight = 146;

let ROWS = imgHeight;
let COLS = imgWidth;

const audioFiles = {};

let img = new Image();

let NUM_PARTICLES = ROWS * COLS,
    THICKNESS = Math.pow(80, 2),
    SPACING = 4,
    MARGIN = 500,
    COLOR = 220,
    DRAG = 0.995,
    EASE = 0.05,
    particle,
    bounds,
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
    n,
    w,
    h,
    p;

particle = {
    vx: 0,
    vy: 0,
    x: 0,
    y: 0,
};

let channelMerger, reverb;
let audioCtx;
let bufferLoader;

let gain, source1, panner, listener;
let sammpleSource;

let bufferArray;

list = [];
let particleMap = [];

const loadImage = () => {
    particleInit();

    img.onload = function () {
        let cvs = document.createElement("canvas");
        let cvsCtx = cvs.getContext("2d");

        cvs.width = imgWidth;
        cvs.height = imgHeight;

        cvsCtx.drawImage(img, 0, 0);
        for (let i = 0; i < COLS; i++) {
            particleMap[i] = [];
            for (let j = 0; j < ROWS; j++) {
                let tempImg = cvsCtx.getImageData(i, j, 1, 1);

                if (tempImg.data[3] > 0) {
                    p = Object.create(particle);
                    p.x = p.ox = MARGIN + SPACING * i;
                    p.y = p.oy = MARGIN + SPACING * j;

                    particleMap[i][j] = p;
                } else {
                    particleMap[i][j] = 0;
                }
            }
        }

        list = [].concat(...particleMap);

        //cvs.remove();

        particleStep();
        //loadSamples();
    };
    img.src = "/images/venice_small.png";
};

const setupAudio = () => {
    if (!audioCtx) {
        try {
            audioCtx = new AudioContext();

            bufferLoader = new BufferLoader(
                audioCtx,
                [
                    "../audio/atmo.mp3",
                    "../audio/IMreverbs/Large_Long_Echo_Hall.wav",
                    "../audio/pianokey.mp3",
                ],
                finishedLoading
            );

            let parentNode = startContext.parentElement;
            parentNode.remove();

            playPause.style.display = "block";

            // route merger to output

            console.log("created audiocontext");

            bufferLoader.load();
        } catch (e) {
            alert(e);
        }
    }
};

function finishedLoading(bufferList) {
    bufferArray = bufferList;
    // Create two sources and play them both together.
    source1 = audioCtx.createBufferSource();
    gain = audioCtx.createGain();

    source1.buffer = bufferList[0];

    reverb = audioCtx.createConvolver();
    panner = audioCtx.createStereoPanner();

    reverb.buffer = bufferList[1];

    source1.connect(gain).connect(audioCtx.destination);

    source1.loop = true;
    source1.start(0, Math.floor(Math.random() * 511));
}

const particleInit = () => {
    ctx = canvas.getContext("2d");
    tog = true;

    w = canvas.width = COLS * SPACING + MARGIN * 2;
    h = canvas.height = ROWS * SPACING + MARGIN * 2;

    container.style.marginLeft = Math.round(w * -0.5) + "px";
    container.style.marginTop = Math.round(h * -0.5) + "px";

    // for (i = 0; i < NUM_PARTICLES; i++) {
    //     p = Object.create(particle);
    //     p.x = p.ox = MARGIN + SPACING * (i % COLS);
    //     p.y = p.oy = MARGIN + SPACING * Math.floor(i / COLS);

    //     list[i] = p;
    // }

    container.addEventListener("mousemove", function (e) {
        bounds = container.getBoundingClientRect();
        mx = e.clientX - bounds.left;
        my = e.clientY - bounds.top;
        if (panner) panner.pan.value = ((e.clientX - w) / w) * -1;
    });

    canvas.addEventListener("click", playSound);

    container.appendChild(canvas);
};

const particleStep = () => {
    if ((tog = !tog)) {
        for (let i = 0; i < NUM_PARTICLES; i++) {
            if (!list[i]) continue;
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

        for (let i = 0; i < NUM_PARTICLES; i++) {
            if (!list[i]) continue;
            p = list[i];
            (b[(n = (~~p.x + ~~p.y * w) * 4)] = b[n + 1] = b[n + 2] = COLOR),
                (b[n + 3] = 255);
        }

        ctx.putImageData(a, 0, 0);
    }

    requestAnimationFrame(particleStep);
};

// variables

// functions

const init = () => {
    setupAudio();

    loadImage();
};

const playSound = () => {
    sammpleSource = audioCtx.createBufferSource();
    sammpleSource.buffer = bufferArray[2];
    sammpleSource.connect(reverb).connect(panner).connect(audioCtx.destination);
    console.log(panner.pan);
    sammpleSource.start();
};

// wait till everything is loaded

window.addEventListener("load", () => {
    startContext.addEventListener("click", init);
    canvas.addEventListener("click", playSound);

    playPause.addEventListener("click", () => {
        musicPlaying = !musicPlaying;

        if (audioCtx.state === "running") {
            audioCtx.suspend();
        } else if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    });
});
