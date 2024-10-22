import type { User, UserDocument } from './User';
import type { GoogleAPIBook } from '../models/GoogleAPIBook';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME, GET_ALL_USERS, GET_SINGLE_USER, GOOGLE_BOOKS_Query, SAVED_BOOKS } from './queries';
import { ADD_USER, LOGIN, SAVE_BOOK, REMOVE_BOOK } from './mutations';

export const getAllUsers = () => {
    const { loading, error, data } = useQuery(GET_ALL_USERS);
    if (loading) return { loading, error: null, data: null };
    if (error) return { loading: false, error, data: null };
    return { loading: false, error: null, data };
};

interface UserIDResult {
    loading: boolean;
    error: Error | null;
    data: UserDocument | null;   
}

export const UserByID = (userId: string): UserIDResult => {
    const { loading, error, data } = useQuery(GET_SINGLE_USER, {
        variables: { userId }
    });
    if (loading) return { loading, error: null, data: null };
    if (error) return { loading: false, error, data: null };
    return { loading: false, error: null, data };
};

interface MeResult {
    loading: boolean;
    error: Error | null;
    data: User | null;   
}   

export const Me = (): MeResult => {
    const { loading, error, data } = useQuery(GET_ME);
    if (loading) return { loading, error: null, data: null };
    if (error) return { loading: false, error, data: null };
    return { loading: false, error: null, data };
};

export const addUser {
    error: Error | null;
    data: User | null;
}


