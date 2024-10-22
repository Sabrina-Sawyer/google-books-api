import { gql } from '@apollo/client';

// Mutation to add a new user.
export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      userId
      username
      email
    }
  }
`;

// Mutation to log in a user.
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        userId
        username
        email
      }
    }
  }
`;

// Mutation to save a book to the user’s saved list.
export const SAVE_BOOK = gql`
  mutation SaveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      userId
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

// Mutation to remove a book from the user's saved list.
export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      userId
      savedBooks {
        bookId
        title
      }
    }
  }
`;
