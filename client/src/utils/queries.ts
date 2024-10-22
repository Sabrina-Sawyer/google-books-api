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

export const GET_ALL_USERS = gql`
  query Users {
    users {
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

export const GET_SINGLE_USER = gql`
  query SingleUser($userId: ID!) {
    singleUser(_id: $userId) {
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

export const GOOGLE_BOOKS_Query = gql`
  query GoogleBooks($query: String!) {
    googleBooks(query: $query) {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}`

export const SAVED_BOOKS = gql`
  query SavedBooks {
    savedBooks {
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




// todo: the queries to the backend for all data or data by ID