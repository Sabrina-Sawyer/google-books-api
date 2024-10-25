import { gql } from '@apollo/client';

// Query to get all users.
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// Query to get a specific user by ID.
export const GET_SINGLE_USER = gql`
  query GetSingleUser($_id: ID!) {
    user(_id: $_id) {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// Query to get the current logged-in user’s data.
export const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// Query to search books using Google Books API.
export const GOOGLE_BOOKS_QUERY = gql`
  query GoogleBooksQuery($query: String!) {
    googleBooks(query: $query) {
      id
      volumeInfo {
        title
        authors
        description
        imageLinks {
          thumbnail
        }
      }oh
    }
  }
`;

export const SEARCH_BOOKS = gql`
  query searchBooks($search: String!) {
    searchBooks(search: $search) {
      _id
      bookId
      authors
      description
      title
      image
      link
    }
  }
`;