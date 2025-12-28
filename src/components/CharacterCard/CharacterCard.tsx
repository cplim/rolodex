import './CharacterCard.css';

export interface CharacterCardProps {
    id: number;
    name: string;
    image: string;
    species?: string;
    status?: string;
    gender?: string;
}

export const CharacterCard = ({
    id: _id,
    name,
    image,
    species,
    status,
    gender
}: CharacterCardProps) => {
    return (
        <div className="card">
            <img
                src={image}
                alt={name}
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
                        <span className={`status ${status.toLowerCase()}`}>
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
