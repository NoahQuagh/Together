import React, { useState } from "react";
import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import { sleepy, mad, idle } from "blobatar/expression";
import { useNavigate } from "react-router-dom";
import "blobatar/motion.css";
import "blobatar/gaze.css";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
    //state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [currentExpression, setCurrentExpression] = useState(idle);
    const navigate = useNavigate();
    const { login } = useAuth();

    const { ref } = useGaze({
        travel: 5,
        lookAt: showPassword ? { x: 0, y: -100 } : "pointer",
    });

    //comportements
    const triggerErrorExpression = () => {
        setCurrentExpression(mad);
        setTimeout(() => {
            setCurrentExpression(idle);
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/loginUser.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, mot_de_passe: password }),
            });

            const data = await response.json();

            const appBaseUrl = import.meta.env.VITE_APP_BASE_URL || "";

            if (data.success) {
                login(data.user);
                navigate("/dashboard");
            }else {
                setError(data.message || "Identifiants incorrects.");
                triggerErrorExpression();
            }
        } catch (err) {
            setError("Erreur de connexion au serveur.");
            triggerErrorExpression();
        } finally {
            setLoading(false);
        }
    };

    const activeExpression = showPassword ? sleepy : currentExpression;

    //render
    return (
        <div>
            <div className="back-button">
                <button onClick={() => window.history.back()}>
                    <i className="ti ti-arrow-left"></i> Retour
                </button>
            </div>

            <main className="auth-page">
                <aside className="auth-side">
                    <div className="auth-side-inner">

                        <div className="logo-complete">
                            <div className="line">
                                <div className="demo-item">
                                    <div className="tog-spinner large">
                                        <div className="tog-bg"></div>
                                        <div className="tog-elements">
                                            <div className="tog-top">
                                                <div className="tog-bar-long"></div>
                                                <div className="tog-bar-short"></div>
                                            </div>
                                            <div className="tog-bottom">
                                                <div className="tog-block"></div>
                                                <div className="tog-block"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="auth-side-copy">
                                    <h2>Together</h2>
                                    <p className="signature">Votre plateforme collaborative.</p>
                                </div>
                            </div>
                        </div>

                        <ul className="auth-side-features">
                            <li>
                                <span className="feat-dot feat-dot--blue"></span>
                                Partage en temps réel
                            </li>
                            <li>
                                <span className="feat-dot feat-dot--green"></span>
                                Sécurité renforcée
                            </li>
                            <li>
                                <span className="feat-dot feat-dot--yellow"></span>
                                Interface intuitive
                            </li>
                        </ul>

                        <div className="auth-side-badge">v1.0.0</div>
                    </div>
                </aside>

                <section className="auth-panel">
                    <div className="auth-stage" id="authStage" data-active="login">
                        <div className="auth-form-wrap" id="fLogin" data-form="login">



                            <div className="auth-form-head">
                                <div
                                    ref={ref}
                                    style={{ width: 140, height: 140, margin: "0 auto 20px auto" }}
                                >
                                    <Blobatar
                                        name="together-user"
                                        traits={{
                                            tone: 0.71,
                                            hue: 0.645,
                                        }}
                                        expression={activeExpression}
                                        animate="always"
                                        size={150}
                                    />
                                </div>
                                <div className="titleForm">
                                    <p className="auth-eyebrow">Connexion</p>
                                    <h1>Bon retour parmi nous</h1>
                                </div>
                            </div>

                            <form className="auth-form" onSubmit={handleSubmit}>
                                <div className="auth-field">
                                    <label htmlFor="login-email">E-mail</label>
                                    <div className="auth-input-wrap">
                                        <i className="ti ti-mail" aria-hidden="true"></i>
                                        <input
                                            type="email"
                                            id="login-email"
                                            name="email"
                                            placeholder="together@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <div className="auth-field-head">
                                        <label htmlFor="login-mdp">Mot de passe</label>
                                        <a href="reset.php" className="auth-link-xs">
                                            Oublié ?
                                        </a>
                                    </div>
                                    <div className="auth-input-wrap">
                                        <i className="ti ti-lock" aria-hidden="true"></i>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="login-mdp"
                                            name="mot_de_passe"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="auth-eye"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label="Afficher le mot de passe"
                                        >
                                            <i className={showPassword ? "ti ti-eye-off" : "ti ti-eye"}></i>
                                        </button>
                                    </div>
                                </div>

                                <label className="auth-checkbox">
                                    <input type="checkbox" name="souvenir" />
                                    <span className="check-box"></span>
                                    Se souvenir de moi
                                </label>

                                <button type="submit" className="auth-btn-submit" disabled={loading}>
                                    <span>{loading ? "Connexion..." : "Se connecter"}</span>
                                    <i className="ti ti-arrow-right" aria-hidden="true"></i>
                                </button>

                                {error && (
                                    <div className="auth-alert auth-alert--error">
                                        <i className="ti ti-alert-circle" aria-hidden="true"></i>
                                        {error}
                                    </div>
                                )}
                            </form>

                            <div className="auth-switch-row">
                                <span>Pas encore de compte ?</span>
                                <button
                                    className="auth-switch-btn"
                                    onClick={() => (window.location.href = "signIn.php")}
                                >
                                    Créer un compte
                                    <i className="ti ti-chevron-right" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}