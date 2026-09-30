import React from "react";
import { ErrorState } from "./ErrorState";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Erreur capturée par l'ErrorBoundary :", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorState
                    title="Oups ! Quelque chose a mal tourné"
                    description="Un problème inattendu s'est produit lors de l'affichage de cette page."
                    onRetry={() => window.location.reload()}
                />
            );
        }

        return this.props.children;
    }
}