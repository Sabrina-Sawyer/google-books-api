import { gql } from '@apollo/client';

// src/graphql/queries.ts

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;




// todo: the queries to the backend for all data or data by ID