import {useSearchParams} from "react-router";

const Search = () => {
    const [searchParams] = useSearchParams();
    return(
      <div>
          <h1>You searched for: {searchParams.get('q')}</h1>
      </div>
    );
}

export default Search;