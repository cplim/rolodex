import {gql} from "@apollo/client";
import {useSearchParams} from "react-router";
import {useQuery} from "@apollo/client/react";
import styles from './Search.module.css';

const searchQuery = gql`
    query GetCharacters($page: Int!, $search: String!) {
        characters(page: $page, filter: {name: $search}) {
            results {
                id,
                name
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
    name: string
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
            <main>
                <h1>You searched for: {searchTerm}</h1>
                {data && <ul>
                    {data.characters.results.map(character => <li key={character.id}>{character.name}</li>)}
                </ul>}
            </main>
            <footer>
                Footer
            </footer>
        </div>
    );
}

export default Search;