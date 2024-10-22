import { useMutation, useQuery } from '@apollo/client';
import {
    GET_ME,
    GET_ALL_USERS,
    GET_SINGLE_USER,
    GOOGLE_BOOKS_QUERY,
} from './queries';
import {
    ADD_USER,
    LOGIN,
    SAVE_BOOK,
    REMOVE_BOOK,
} from './mutations';
import type { User } from '../models/User';
import type { GoogleAPIBook } from '../models/GoogleAPIBook';

// Fetch all users.
export const getAllUsers = () => {
    const { loading, error, data } = useQuery(GET_ALL_USERS);

    if (loading) return { loading, error: null, data: null };
    if (error) return { loading: false, error, data: null };

    return { loading: false, error: null, data };
};

// Fetch a user by ID.
export const getUserByID = (userId: string) => {
    const { loading, error, data } = useQuery(GET_SINGLE_USER, {
        variables: { userId },
    });

    if (loading) return { loading, error: null, data: null };
    if (error) return { loading: false, error, data: null };

    return { loading: false, error: null, data };
};

// Fetch the logged-in user's profile.
export const getMe = () => {
    const { loading, error, data } = useQuery(GET_ME);

    if (loading) return { loading, error: null, data: null };
    if (error) return { loading: false, error, data: null };

    return { loading: false, error: null, data };
};

// Register a new user.
export const useRegisterUser = () => {
    const [addUser] = useMutation(ADD_USER);

    const registerUser = async (userData: User) => {
        const { data } = await addUser({ variables: userData });
        return data;
    };

    return { registerUser };
};

// Log in a user.
export const useLoginUser = () => {
    const [login] = useMutation(LOGIN);

    const loginUser = async (email: string, password: string) => {
        const { data } = await login({ variables: { email, password } });
        return data;
    };

    return { loginUser };
};

// Save a book to the user's list.
export const useSaveBook = () => {
    const [saveBook] = useMutation(SAVE_BOOK);

    const saveUserBook = async (bookData: GoogleAPIBook) => {
        const { data } = await saveBook({ variables: { bookData } });
        return data;
    };

    return { saveUserBook };
};

// Remove a book from the user's list.
export const useRemoveBook = () => {
    const [removeBook] = useMutation(REMOVE_BOOK);

    const removeUserBook = async (bookId: string) => {
        const { data } = await removeBook({ variables: { bookId } });
        return data;
    };

    return { removeUserBook };
};

// Search books using the Google Books API.
export const searchGoogleBooks = (query: string) => {
    const { loading, error, data } = useQuery(GOOGLE_BOOKS_QUERY, {
        variables: { query },
    });

    if (loading) return { loading, error: null, data: null };
    if (error) return { loading: false, error, data: null };

    return { loading: false, error: null, data };
};
