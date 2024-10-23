import { gql } from '@apollo/client';

// Query to get all users.
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      _id   // Changed from userId to _id
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
  query GetSingleUser($_id: ID!) { // Changed userId to _id
    user(_id: $_id) {  // Changed userId to _id
      _id   // Changed from userId to _id
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
      _id   // Changed from userId to _id
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
      }
    }
  }
`;
