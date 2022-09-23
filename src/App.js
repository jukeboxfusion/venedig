import "./App.css";
import Wad from "web-audio-daw";
import Tuna from "tunajs";

function App() {
    const publicUrl = process.env.PUBLIC_URL;
    // variables

    let audioCtx;
    let source;
    let sound;
    let audio;
    const samples = [];
    const NUMBER_OF_SAMPLES = 59;

    // functions

    const init = () => {
        if (!audioCtx) {
            try {
                audioCtx = new AudioContext();
                audio = new Audio(publicUrl + "ambient.wav");

                source = audioCtx.createMediaElementSource(audio);
                source.connect(audioCtx.destination);
                loadSamples();

                console.log("created audiocontext");
            } catch (e) {
                alert("Web Audio API is not supported in this browser");
            }
        }
    };

    const loadSamples = () => {
        for (let i = 0; i < NUMBER_OF_SAMPLES; i++) {
            samples.push(
                new Wad({
                    source: publicUrl + "samples/sample_" + i + ".wav",
                    delay: {},
                    panning: 0,
                    panningModel: "HRTF",
                    rolloffFactor: 1,
                    reverb: {
                        impulse:
                            publicUrl +
                            "IMreverbs/" +
                            "Large Long Echo Hall.wav",
                        wet: 1,
                    },
                })
            );
        }
    };

    const getRandomNumber = (max) => {
        return Math.floor(Math.random() * max);
    };

    const getRandomMinMax = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
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

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={init}>Start Context</button>
                <div>
                    <img
                        onClick={(e) => playSound(e)}
                        src={publicUrl + "/images/obama.jpg"}
                        alt="logo"
                    />
                </div>
            </header>
        </div>
    );
}

export default App;
