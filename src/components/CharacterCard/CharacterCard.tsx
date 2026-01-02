import './CharacterCard.css';
import { TEST_IDS } from '../../test/test-ids';

export interface CharacterCardProps {
    name: string;
    image: string;
    species?: string;
    status?: string;
    gender?: string;
}

export const CharacterCard = ({
    name,
    image,
    species,
    status,
    gender
}: CharacterCardProps) => {
    return (
        <div className="card" data-testid={TEST_IDS.CHARACTER_CARD}>
            <img
                src={image}
                alt={`${name} character`}
                className="image"
            />
            <div className="content">
                <h3 className="name">{name}</h3>
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
