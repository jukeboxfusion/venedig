/** @jsxImportSource theme-ui */

/* Jukebox Fusion - Alexander Galperin and Marcel Joschko */

import { jsx } from "theme-ui";
import "./App.css";
import Particles from "./particles";
import { Fragment, useState } from "react";
import Tuna from "tunajs";
import SineWave from "./sine-wave";

function App() {
    const publicUrl = process.env.PUBLIC_URL;
    const [audio, setAudio] = useState(false);
    const [audioContext, setAudioContext] = useState(null);
    const [bufferedSamples, setBufferedSamples] = useState([]);

    let audioCtx, tuna, chorus, atmoGain, atmo, impulse;
    const sampleBuffer = [];
    const NUMBER_OF_SAMPLES = 23;

    const setupAudio = () => {
        if (!audioCtx) {
            try {
                audioCtx = new AudioContext();
                tuna = new Tuna(audioCtx);

                chorus = new tuna.Chorus({
                    rate: 8,
                    feedback: 0.2,
                    delay: 0.0045,
                    bypass: 0,
                });

                fetch(publicUrl + "sounds/atmo.mp3")
                    .then((response) => response.arrayBuffer())
                    .then((buffer) => audioCtx.decodeAudioData(buffer))
                    .then((buffer) => {
                        atmo = audioCtx.createBufferSource();
                        atmo.buffer = buffer;
                        atmoGain = audioCtx.createGain();
                        atmoGain.gain.value = 0;
                        atmo.connect(atmoGain)
                            .connect(chorus)
                            .connect(audioCtx.destination);
                        atmo.loop = true;
                        atmo.start(0, Math.floor(Math.random() * 511));
                        rampUpGain();
                    });

                fetch(publicUrl + "sounds/IMreverbs/Large_Long_Echo_Hall.wav")
                    .then((response) => response.arrayBuffer())
                    .then((buffer) => audioCtx.decodeAudioData(buffer))
                    .then((buffer) => {
                        impulse = audioCtx.createBufferSource();
                        impulse.buffer = buffer;
                    });

                loadSamples();
                setAudio(true);
                setAudioContext(audioCtx);

                window.addEventListener("mousemove", (e) => chorusTest(e));
            } catch (e) {
                alert("Web Audio API is not supported in this browser");
            }
        }
    };

    const convertRange = (oldval, oldmin, oldmax, newmin, newmax) => {
        let oldrange = oldmax - oldmin;
        let newRange = newmax - newmin;
        return ((oldval - oldmin) * newRange) / oldrange + newmin;
    };

    const chorusTest = (e) => {
        chorus.rate = convertRange(e.clientX, 1, window.screen.width, 0.01, 4);
    };

    const loadSamples = () => {
        for (let i = 0; i < NUMBER_OF_SAMPLES; i++) {
            fetch(publicUrl + "sounds/samples/sample_" + i + ".mp3")
                .then((response) => response.arrayBuffer())
                .then((buffer) => audioCtx.decodeAudioData(buffer))
                .then((buffer) => {
                    sampleBuffer.push(buffer);
                });
        }
        setBufferedSamples(sampleBuffer);
    };

    const rampUpGain = () => {
        let every = 10;
        let stepSize = convertRange(every, 1, 2000, 0, 0.75) / every;
        let interval = setInterval(function () {
            if (atmoGain.gain.value >= 0.75) {
                atmoGain.gain.value = 0.75;
                clearInterval(interval);
            }
            atmoGain.gain.value += stepSize;
        }, every);
    };

    return (
        <div className="App">
            {audio ? (
                <Fragment>
                    <Particles
                        audioCtx={audioContext}
                        sampleBuffer={bufferedSamples}
                        publicUrl={publicUrl}
                        numberSamples={NUMBER_OF_SAMPLES}
                    />
                    <SineWave audioCtx={audioContext} />
                </Fragment>
            ) : (
                <Fragment>
                    <div>
                        <div
                            sx={{
                                height: "100vh",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    sx={{
                                        width: "200px",
                                        my: 3,
                                        pointerEvents: "none",
                                    }}
                                    src={publicUrl + "images/jf2.png"}
                                ></img>

                                <img
                                    sx={{
                                        width: "200px",

                                        cursor: "pointer",
                                    }}
                                    src={publicUrl + "images/jf1.png"}
                                    onClick={setupAudio}
                                ></img>
                                <p
                                    sx={{
                                        color: "white",
                                        my: 3,
                                        fontFamily: "Space Mono",
                                        fontSize: "8pt",
                                    }}
                                >
                                    click and move to create your own experience
                                </p>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
}

export default App;
