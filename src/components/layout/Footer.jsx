import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer>
            <section className="footerSection">
                <div>
                    <h4>Raccourcis rapides</h4>
                    <ul>
                        <li><Link to="/dashboard">Accueil</Link></li>
                        <li><Link to="/notifications">Notifications</Link></li>
                        <li><Link to="/calendar">Calendrier</Link></li>
                        <li><Link to="/stats">Statistiques</Link></li>
                        <li><Link to="/reports">Rapports</Link></li>
                        <li><Link to="/settings">Paramètres</Link></li>
                    </ul>
                </div>

                <div>
                    <h4>Liens utiles</h4>
                    <ul>
                        <li><Link to="/help">Aide</Link></li>
                        <li><Link to="/documentation">Documentation</Link></li>
                        <li><Link to="/report-bug">Signaler un bug</Link></li>
                        <li><Link to="/submit-idea">Proposer une idée</Link></li>
                    </ul>
                </div>

                <div>
                    <h4>Réseau</h4>
                    <ul>
                        <li><Link to="/about">À propos</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/changelog">Changelog</Link></li>
                        <li><a href="https://github.com/NoahQuagh/Together" target="_blank" rel="noreferrer">GitHub</a></li>
                        <li><Link to="/status">Statut</Link></li>
                    </ul>
                </div>

                <div className="footer-logo-wrap">
                    <div className="fl-spinner">
                        <div className="fl-bg" />
                        <div className="fl-elements">
                            <div className="fl-top">
                                <div className="fl-bar-long" />
                                <div className="fl-bar-short" />
                            </div>
                            <div className="fl-bottom">
                                <div className="fl-block" />
                                <div className="fl-block" />
                            </div>
                        </div>
                        <div className="fl-face">
                            <div className="fl-eyes">
                                <div className="fl-eye" />
                                <div className="fl-eye" />
                            </div>
                            <div className="fl-mouth" />
                        </div>
                    </div>

                    <div className="fl-text">
                        <h2>Together</h2>
                        <p className="fl-signature">Votre plateforme collaborative.</p>
                    </div>
                </div>
            </section>

            <div className="separator" />

            <section className="footerSection footerSection2">
                <p>
                    Copyright © 2026 Together | <Link to="/privacy">Politique de confidentialité</Link> | Version 1.0.0
                </p>
            </section>
        </footer>
    );
}