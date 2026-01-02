import './CharacterCard.css';
import { TEST_IDS } from '../../test/test-ids';

export interface CharacterCardProps {
    name: string | null | undefined;
    image: string | null | undefined;
    species?: string | null;
    status?: string | null;
    gender?: string | null;
}

export const CharacterCard = ({
    name,
    image,
    species,
    status,
    gender
}: CharacterCardProps) => {
    // Defensive handling for required fields that might be null/undefined from API
    const safeName = name || 'Unknown Character';

    // Placeholder SVG for missing images
    const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23cccccc" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="Arial" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
    const safeImage = image || placeholderImage;

    return (
        <div className="card" data-testid={TEST_IDS.CHARACTER_CARD}>
            <img
                src={safeImage}
                alt={`${safeName} character`}
                className="image"
                onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = placeholderImage;
                }}
            />
            <div className="content">
                <h3 className="name">{safeName}</h3>
                {species && (
                    <p className="detail">
                        <span className="label">Species:</span> {species}
                    </p>
                )}
                {status && (
                    <p className="detail">
                        <span className="label">Status:</span>
                        <span
                            className={`status ${status.toLowerCase()}`}
                            data-testid={TEST_IDS.CHARACTER_STATUS}
                        >
                            {status}
                        </span>
                    </p>
                )}
                {gender && (
                    <p className="detail">
                        <span className="label">Gender:</span> {gender}
                    </p>
                )}
            </div>
        </div>
    );
};
