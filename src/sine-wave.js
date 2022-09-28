/** @jsxImportSource theme-ui */
import { jsx } from "theme-ui";

import { useRef, useEffect } from "react";

export default function SineWave(props) {
    const canvasRef = useRef();
    const audioCtx = props.audioCtx;

    useEffect(() => {
        draw();
    }, []);

    let musicPlaying = true;
    let step = -4;
    let onAmp = 60;
    let offAmp = 15;
    let amplitude = musicPlaying ? onAmp : offAmp;

    const plotSine = (ctx, xOffset) => {
        let width = ctx.canvas.width;
        let height = ctx.canvas.height;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(255,255,255)";

        let x = 4;
        let y = 0;
        let frequency = 30;

        while (x < width) {
            y = height / 2 + amplitude * Math.sin((x + xOffset) / frequency);
            ctx.lineTo(x, y);
            x++;
        }
        ctx.stroke();
        ctx.save();
    };

    const draw = () => {
        let canvas = canvasRef.current;
        let context = canvas.getContext("2d");

        context.clearRect(0, 0, 500, 500);
        context.save();

        plotSine(context, step);
        context.restore();

        step += 0.5;
        window.requestAnimationFrame(draw);
    };

    const toggleMusic = () => {
        musicPlaying = !musicPlaying;

        if (audioCtx.state === "running") {
            rampDown();
            audioCtx.suspend();
        } else if (audioCtx.state === "suspended") {
            rampUp();
            audioCtx.resume();
        }
    };

    const convertRange = (oldval, oldmin, oldmax, newmin, newmax) => {
        let oldrange = oldmax - oldmin;
        let newRange = newmax - newmin;
        return ((oldval - oldmin) * newRange) / oldrange + newmin;
    };

    const rampDown = () => {
        let every = 10;
        let stepSize = convertRange(every, 1, 1000, offAmp, onAmp) / every;
        let interval = setInterval(function () {
            if (amplitude <= offAmp) {
                amplitude = offAmp;
                clearInterval(interval);
            }
            amplitude -= stepSize;
        }, every);
    };

    const rampUp = () => {
        let every = 10;
        let stepSize = convertRange(every, 1, 1000, offAmp, onAmp) / every;
        let interval = setInterval(function () {
            if (amplitude >= onAmp) {
                amplitude = onAmp;
                clearInterval(interval);
            }
            amplitude += stepSize;
        }, every);
    };

    return (
        <canvas
            sx={{
                width: "100px",
                position: "absolute",
                top: "90%",
                left: "90%",
                cursor: "pointer",
            }}
            ref={canvasRef}
            onClick={toggleMusic}
        ></canvas>
    );
}
