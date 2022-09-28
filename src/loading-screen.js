/** @jsxImportSource theme-ui */
import { jsx } from "theme-ui";

import { useRef, useEffect } from "react";

export default function LoadingScreen(props) {
    const publicUrl = props.publicUrl;

    return (
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
                    onClick={props.setAudio(true)}
                    sx={{ width: "200px" }}
                    src={publicUrl + "images/jf1.png"}
                ></img>
                <p sx={{ color: "white" }}>best experienced with headphones</p>
            </div>
        </div>
    );
}
