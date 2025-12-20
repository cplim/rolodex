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
            <main className={styles.carousel}>
                <div className={styles.card}></div>
                <div className={styles.card}>1</div>
                <div className={styles.card}>2</div>
                <div className={styles.card}>3</div>
                <div className={styles.card}>4</div>
                <div className={styles.card}>5</div>
                <div className={styles.card}>6</div>
                <div className={styles.card}>7</div>
                <div className={styles.card}>8</div>
                <div className={styles.card}>9</div>
                <div className={styles.card}>10</div>
                <div className={styles.card}>11</div>
                <div className={styles.card}>12</div>
                <div className={styles.card}>13</div>
                <div className={styles.card}>14</div>
                <div className={styles.card}></div>
            </main>
            <footer>
                Footer
            </footer>
        </div>
    );
}

export default Search;