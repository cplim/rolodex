import {gql} from "@apollo/client";
import {useSearchParams} from "react-router";
import {useQuery} from "@apollo/client/react";
import styles from './Search.module.css';
import { CharacterCard } from '../../components/CharacterCard';
import { TEST_IDS } from '../../test/test-ids';

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

    if (loading) return <p data-testid={TEST_IDS.SEARCH_LOADING}>Loading...</p>;
    if (error) return <p data-testid={TEST_IDS.SEARCH_ERROR}>Error :(</p>;

    const hasResults = data?.characters.results && data.characters.results.length > 0;

    return (
        <div className={styles.layout}>
            <header>
                Header
            </header>
            <main className={styles.carousel} data-testid={TEST_IDS.SEARCH_RESULTS}>
                <div className={styles.spacer}></div>
                {hasResults ? (
                    data.characters.results.map((character) => (
                        <CharacterCard
                            key={character.id}
                            name={character.name}
                            image={character.image}
                            species={character.species}
                            status={character.status}
                            gender={character.gender}
                        />
                    ))
                ) : (
                    <p data-testid={TEST_IDS.SEARCH_EMPTY}>No characters found</p>
                )}
                <div className={styles.spacer}></div>
            </main>
            <footer>
                Footer
            </footer>
        </div>
    );
}

export default Search;