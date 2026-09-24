import React from "react";

export function DashBlock({ title, icon, colorClass, count, emptyMessage, emptyIcon = "ti ti-coffee", children, isFull = false }) {
    const hasItems = count === undefined || count > 0;

    return (
        <div className={`dash-block ${isFull ? "dash-block--full" : ""}`}>
            {title && (
                <div className={`dash-block-header ${colorClass}`}>
                    <h3>
                        <i className={icon} aria-hidden="true" />
                        {title}
                    </h3>
                    {count !== undefined && (
                        <span className={`dash-block-count ${colorClass === "rouge" ? "dash-block-count--red" : ""}`}>
              {count}
            </span>
                    )}
                </div>
            )}

            {!hasItems ? (
                <p className="dash-empty">
                    <i className={emptyIcon} />
                    {emptyMessage}
                </p>
            ) : (
                children
            )}
        </div>
    );
}