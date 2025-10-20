"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div>
            <h2>Une erreur est survenue</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Réessayer</button>
        </div>
    );
}
