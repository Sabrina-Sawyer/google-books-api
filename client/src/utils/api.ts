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
import type { RegisterUserInput } from '../models/User';
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

    const registerUser = async (userData: RegisterUserInput) => {
        const { data } = await addUser({
            variables: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
            },
        });

        return data.addUser; // Adjust to return the added user object including _id
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
interface GoogleBooksResult {
    loading: boolean;
    error: Error | null;
    data: GoogleAPIBook[] | null;
}

export const useGoogleBooks = (query: string): GoogleBooksResult => {
    const { loading, error, data } = useQuery<{ googleBooks: GoogleAPIBook[] }>(GOOGLE_BOOKS_QUERY, {
        variables: { query },
        skip: !query, // Skip the query if the query string is empty
    });

    if (loading) return { loading, error: null, data: null };
    if (error) return { loading: false, error, data: null };
    return { loading: false, error: null, data: data?.googleBooks || null };
};