import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { LoginAvatar } from "./components/LoginAvatar";

function LoginAvatarWrapper() {
    const [email, setEmail] = useState("");

    useEffect(() => {
        const input = document.getElementById("login-email");
        if (!input) return;

        const handleInput = (e) => setEmail(e.target.value.trim());
        input.addEventListener("input", handleInput);

        return () => input.removeEventListener("input", handleInput);
    }, []);

    return <LoginAvatar email={email} />;
}

const container = document.getElementById("blobatar-root");
if (container) {
    ReactDOM.createRoot(container).render(<LoginAvatarWrapper />);
}