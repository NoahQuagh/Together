import React, {useState} from 'react';
import {Blobatar} from "@blobatar/react";
import {idle, sad, thinking} from "blobatar/expression";
import "blobatar/motion.css";
import "blobatar/gaze.css";


export function ErrorMessage({
                                 message = "Une erreur est survenue lors du chargement des données.",
                             }) {
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
                    expression={sad}
                    animate="always"
                    size={150}
                />
            </div>
        </div>
        <span className="demo-caption">{message}</span>
    </div>
    );
}