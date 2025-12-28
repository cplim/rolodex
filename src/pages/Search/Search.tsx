import {gql} from "@apollo/client";
import {useSearchParams} from "react-router";
import {useQuery} from "@apollo/client/react";
import styles from './Search.module.css';
import { CharacterCard } from '../../components/CharacterCard';

const searchQuery = gql`
    query GetCharacters($page: Int!, $search: String!) {
        characters(page: $page, filter: {name: $search}) {
            results {
                id
                name
                image
                species
                status
                gender
            }
        }
    }`;

type SearchResponse = {
    characters: Characters
}
type Characters = {
    results: Character[]
}
type Character = {
    id: number,
    name: string,
    image: string,
    species?: string,
    status?: string,
    gender?: string
}

const Search = () => {
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') || '';
    const variables = {search: searchTerm, page: 1};
    const {loading, error, data} = useQuery<SearchResponse, typeof variables>(
        searchQuery,
        {variables: variables}
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <div className={styles.layout}>
            <header>
                Header
            </header>
            <main className={styles.carousel}>
                <div className={styles.spacer}></div>
                {data?.characters.results.map((character) => (
                    <CharacterCard
                        key={character.id}
                        id={character.id}
                        name={character.name}
                        image={character.image}
                        species={character.species}
                        status={character.status}
                        gender={character.gender}
                    />
                ))}
                <div className={styles.spacer}></div>
            </main>
            <footer>
                Footer
            </footer>
        </div>
    );
}

export default Search;