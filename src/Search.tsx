import {ApolloClient, gql, HttpLink, InMemoryCache} from "@apollo/client";
import {useSearchParams} from "react-router";
import {useQuery} from "@apollo/client/react";

const searchQuery = gql`
    query GetCharacters($page: Int!, $search: String!) {
        characters(page: $page, filter: {name: $search}) {
            results {
                id,
                name
            }
        }
    }`;

const Search = () => {
    const [searchParams] = useSearchParams();
    const variables = {search: searchParams.get('q'), page: 1};
    const {loading, error, data} = useQuery(searchQuery, {
        variables: variables
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return(
      <div>
          <h1>You searched for: {searchParams.get('q')}</h1>
          <ul>
              {data.characters.results.map(character => <li key={character.id}>{character.name}</li>)}
          </ul>
      </div>
    );
}

export default Search;