/** @jsxImportSource theme-ui */

/* Jukebox Fusion - Alexander Galperin and Marcel Joschko */
/* Credits to Justin Windle (https://github.com/soulwire) for particle init and drawing function */

// eslint-disable-next-line
import { jsx } from "theme-ui";
import { particleConfig } from "./particle-config";
import { useEffect, useRef } from "react";
import Particle from "./Particle";
import Tuna from "tunajs";

export default function Particles(props) {
    const publicUrl = props.publicUrl;
    const audioCtx = props.audioCtx;
    const sampleBuffer = props.sampleBuffer;

    const containerRef = useRef();

    let img = new Image();

    let imgWidth = 250;
    let imgHeight = 146;

    let ROWS = imgHeight;
    let COLS = imgWidth;
    let NUM_PARTICLES = ROWS * COLS;
    let particleMap = [];
    let particles = [];
    let mx,
        my,
        bounds,
        w,
        h,
        ctx,
        tog,
        b,
        a,
        n,
        p,
        container,
        canvas,
        tuna,
        gain,
        reverb,
        panner,
        delay;

    useEffect(() => {
        if (!container) {
            init();
        }
    }, []);

    const init = () => {
        canvas = document.createElement("canvas");
        container = containerRef.current;

        if (audioCtx) {
            tuna = new Tuna(audioCtx);
            initAudioEffects();
        }

        initParticles();
        drawParticles();
    };

    const initAudioEffects = () => {
        reverb = new tuna.Convolver({
            highCut: 22050,
            lowCut: 20,
            dryLevel: 1,
            wetLevel: 1,
            level: 1,
            impulse: publicUrl + "sounds/IMreverbs/Large_Long_Echo_Hall.wav",
            bypass: 0,
        });
        gain = new tuna.Gain({
            gain: 1,
        });
        panner = new tuna.Panner({
            pan: 0,
        });
        delay = new tuna.PingPongDelay({
            wetLevel: 0.5,
            feedback: 0.3,
            delayTimeLeft: 200,
            delayTimeRight: 400,
        });
    };

    const playSound = () => {
        let rnd = Math.floor(Math.random() * props.numberSamples);
        let playSample = audioCtx.createBufferSource();
        playSample.buffer = sampleBuffer[rnd];
        playSample.connect(gain);
        gain.connect(delay);
        delay.connect(reverb);
        reverb.connect(panner);
        panner.connect(audioCtx.destination);
        playSample.start();
    };

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
                    let px = particleConfig.MARGIN + particleConfig.SPACING * i;
                    let py = particleConfig.MARGIN + particleConfig.SPACING * j;

                    particleMap[i][j] = new Particle(px, py, px, py);
                } else {
                    particleMap[i][j] = 0;
                }
            }
        }

        particles = [].concat(...particleMap);

        cvs.remove();
    };

    const convertRange = (oldval, oldmin, oldmax, newmin, newmax) => {
        let oldrange = oldmax - oldmin;
        let newRange = newmax - newmin;
        return ((oldval - oldmin) * newRange) / oldrange + newmin;
    };

    const applyAudioEffects = (e) => {
        delayUpdate(e);
        pannerUpdate(e);
    };

    const pannerUpdate = (e) => {
        panner.pan = convertRange(
            e.clientX,
            1,
            window.screen.width,
            -0.75,
            0.75
        );
    };

    const delayUpdate = (e) => {
        delay.feedback = convertRange(
            e.clientY,
            1,
            window.screen.height,
            0.1,
            0.9
        );
    };

    const initParticles = () => {
        img.src = publicUrl + "images/venice_small.png";

        tog = true;

        ctx = canvas.getContext("2d");

        w = canvas.width =
            COLS * particleConfig.SPACING + particleConfig.MARGIN * 2;
        h = canvas.height =
            ROWS * particleConfig.SPACING + particleConfig.MARGIN * 2;

        container.style.marginLeft = Math.round(w * -0.5) + "px";
        container.style.marginTop = Math.round(h * -0.5) + "px";

        container.addEventListener("mousemove", function (e) {
            bounds = container.getBoundingClientRect();
            mx = e.clientX - bounds.left;
            my = e.clientY - bounds.top;
            applyAudioEffects(e);
        });

        container.appendChild(canvas);
    };

    const drawParticles = () => {
        if ((tog = !tog)) {
            for (let i = 0; i < NUM_PARTICLES; i++) {
                if (!particles[i]) continue;
                particles[i].move({ x: mx, y: my });
            }
        } else {
            b = (a = ctx.createImageData(w, h)).data;
            for (let i = 0; i < NUM_PARTICLES; i++) {
                if (!particles[i]) continue;
                p = particles[i].getPos();
                b[(n = (~~p.x + ~~p.y * w) * 4)] =
                    b[n + 1] =
                    b[n + 2] =
                        particleConfig.COLOR;
                b[n + 3] = 255;
            }

            ctx.putImageData(a, 0, 0);
        }

        requestAnimationFrame(drawParticles);
    };

    return (
        <div
            onClick={playSound}
            ref={containerRef}
            sx={{ position: "absolute", left: "50%", top: "50%" }}
        ></div>
    );
}
