import React, { useState } from 'react';
import { Blobatar } from "@blobatar/react";
import {idle, thinking} from "blobatar/expression";
import "blobatar/motion.css";
import "blobatar/gaze.css";

export function LoadingSpinner({ caption = "Chargement en cours..." }) {

    return (
        <div className="section-loading-center">
            <div className="sp-wrap">
                <div style={{ width: 140, height: 140 }}>
                    <Blobatar
                        name="together-user"
                        traits={{
                            tone: 0.71,
                            hue: 0.645,
                        }}
                        expression={thinking}
                        animate="always"
                        size={150}
                    />
                </div>
            </div>
            {caption && <span className="demo-caption">{caption}</span>}
        </div>
    );
}