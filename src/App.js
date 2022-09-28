/** @jsxImportSource theme-ui */
import { jsx } from "theme-ui";
import "./App.css";
import Particles from "./particles";
import { Fragment, useState, useRef } from "react";
import Tuna from "tunajs";
import SineWave from "./sine-wave";
import BackgroundAtmo from "./background-atmo";
import { createNoise3D } from "simplex-noise";

function App() {
    const publicUrl = process.env.PUBLIC_URL;
    const [audio, setAudio] = useState(false);
    const [audioContext, setAudioContext] = useState(null);
    const [bufferedSamples, setBufferedSamples] = useState([]);
    // variables

    // const circleRef = useRef();
    // const circle = circleRef.current;

    let audioCtx;
    let tuna, chorus, atmoGain;
    let atmo;
    let impulse;
    const sampleBuffer = [];
    const NUMBER_OF_SAMPLES = 16;

    const noise3D = createNoise3D();

    // initialize the noise function

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
                        atmoGain.gain.value = 0.75;
                        atmo.connect(atmoGain)
                            .connect(chorus)
                            .connect(audioCtx.destination);
                        atmo.loop = true;
                        atmo.start(0, Math.floor(Math.random() * 511));
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

    return (
        <div className="App">
            {audio ? (
                <Fragment>
                    <Particles
                        audioCtx={audioContext}
                        sampleBuffer={bufferedSamples}
                        publicUrl={publicUrl}
                        numberSamples={NUMBER_OF_SAMPLES}
                        noise={noise3D}
                    />
                    <SineWave audioCtx={audioContext} />
                </Fragment>
            ) : (
                <Fragment>
                    <div onClick={setupAudio}>
                        <div
                            sx={{
                                height: "100vh",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 32442342334,
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
                                    sx={{ width: "200px", my: 3 }}
                                    src={publicUrl + "images/jf2.png"}
                                ></img>

                                <img
                                    sx={{ width: "200px" }}
                                    src={publicUrl + "images/jf1.png"}
                                ></img>
                                <p sx={{ color: "white", my: 3 }}>
                                    best experienced with headphones
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
