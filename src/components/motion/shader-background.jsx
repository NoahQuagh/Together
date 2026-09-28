import React from "react";
import { useReducedMotion } from "motion/react";
import { MeshGradient, GrainGradient, Warp, Waves } from "@paper-design/shaders-react";

export function ShaderBackground({
                                     variant = "mesh-gradient",
                                     colors = ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"],
                                     colorBack = "#000000",
                                     speed = 0.4,
                                     distortion = 0.8,
                                     swirl = 0.3,
                                     className = "",
                                     ...props
                                 }) {
    const shouldReduceMotion = useReducedMotion();
    const activeSpeed = shouldReduceMotion ? 0 : speed;

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {variant === "mesh-gradient" && (
                <MeshGradient
                    colors={colors}
                    speed={activeSpeed}
                    distortion={distortion}
                    swirl={swirl}
                    style={{ width: "100%", height: "100%" }}
                    {...props}
                />
            )}

            {variant === "grain-gradient" && (
                <GrainGradient
                    colors={colors}
                    colorBack={colorBack}
                    speed={activeSpeed}
                    style={{ width: "100%", height: "100%" }}
                    {...props}
                />
            )}

            {variant === "warp" && (
                <Warp
                    colors={colors}
                    speed={activeSpeed}
                    style={{ width: "100%", height: "100%" }}
                    {...props}
                />
            )}

            {variant === "waves" && (
                <Waves
                    colorFront={colors[0] || "#ffbb00"}
                    colorBack={colorBack}
                    speed={activeSpeed}
                    style={{ width: "100%", height: "100%" }}
                    {...props}
                />
            )}
        </div>
    );
}