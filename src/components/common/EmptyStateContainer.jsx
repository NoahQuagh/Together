import React from "react";
import { EmptyStates } from "@/components/motion/empty-states/empty-states.tsx";

export function EmptyStateContainer({ mode = "all" }) {
    return (
        <div className="my-8 w-full">
            <EmptyStates defaultScene="search"/>
        </div>
    );
}