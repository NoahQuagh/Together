import React from "react";
import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/motion.css";
import "blobatar/gaze.css";

export function LoginAvatar({ email }) {
    const { ref } = useGaze({ travel: 5, lookAt: "pointer" });

    return (
        <div style={{ width: 150, height: 150, margin: "0 auto 20px" }}>
            <Blobatar
                ref={ref}
                name={email || "together-user"}
                animate="always"
                size={150}
            />
        </div>
    );
}