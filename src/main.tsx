import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Search from "./Search.tsx";
import {ApolloProvider} from "@apollo/client/react";
import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
    link: new HttpLink({uri: "https://rickandmortyapi.com/graphql"}),
    cache: new InMemoryCache()
});

createRoot(document.getElementById('root')!).render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <StrictMode>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path='search' element={<Search />} />
                </Routes>
            </StrictMode>
        </BrowserRouter>
    </ApolloProvider>
)
