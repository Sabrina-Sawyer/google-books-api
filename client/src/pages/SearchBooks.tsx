import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    Container,
    Col,
    Form,
    Button,
    Card,
    Row,
} from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks } from '../utils/api';
import Auth from '../utils/auth';
import type { Book } from '../models/Book';
import type { GoogleAPIBook } from '../models/GoogleAPIBook';

const SearchBooks = () => {
    const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [saveBook] = useMutation(SAVE_BOOK); // Using mutation to save books

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (!searchInput) {
            return false;
        }
    
        try {
            // Call the searchGoogleBooks function
            const { loading, error, data } = searchGoogleBooks(searchInput);
    
            // Check for loading state
            if (loading) {
                console.log('Loading...');
                return;
            }
    
            // Check for errors
            if (error) {
                console.error('Error fetching books:', error);
                return;
            }
    
            // Ensure data is available and contains searchBooks
            if (data && data.searchBooks) {
                const bookData = data.searchBooks.map((book: GoogleAPIBook) => ({
                    bookId: book.id,
                    authors: book.volumeInfo.authors || ['No author to display'],
                    title: book.volumeInfo.title,
                    description: book.volumeInfo.description,
                    image: book.volumeInfo.imageLinks?.thumbnail || '',
                }));
    
                setSearchedBooks(bookData);
            } else {
                console.error('No books found');
            }
    
            // Clear the search input
            setSearchInput('');
        } catch (err) {
            console.error('Error during search:', err);
        }
    };

    const handleSaveBook = async (bookId: string) => {
        const bookToSave: Book | undefined = searchedBooks.find((book) => book.bookId === bookId);

        if (!bookToSave) {
            return;
        }

        const token = Auth.loggedIn() ? Auth.getAuthToken() : null;

        if (!token) {
            return false;
        }

        try {
            const { data } = await saveBook({
                variables: { input: { ...bookToSave } }, // Adjust as necessary to match your mutation input
            });

            if (!data) {
                throw new Error('something went wrong!');
            }
            // Optionally handle any state updates or side effects here
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className='text-light bg-dark p-5'>
                <Container>
                    <h1>Search for Books!</h1>
                    <Form onSubmit={handleFormSubmit}>
                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Control
                                    name='searchInput'
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    type='text'
                                    size='lg'
                                    placeholder='Search for a book'
                                />
                            </Col>
                            <Col xs={12} md={4}>
                                <Button type='submit' variant='success' size='lg'>
                                    Submit Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>

            <Container>
                <h2 className='pt-5'>
                    {searchedBooks.length
                        ? `Viewing ${searchedBooks.length} results:`
                        : 'Search for a book to begin'}
                </h2>
                <Row>
                    {searchedBooks.map((book) => (
                        <Col md='4' key={book.bookId}>
                            <Card border='dark'>
                                {book.image && (
                                    <Card.Img
                                        src={book.image}
                                        alt={`The cover for ${book.title}`}
                                        variant='top'
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title>{book.title}</Card.Title>
                                    <p className='small'>Authors: {book.authors.join(', ')}</p>
                                    <Card.Text>{book.description}</Card.Text>
                                    {Auth.loggedIn() && (
                                        <Button
                                            className='btn-block btn-info'
                                            onClick={() => handleSaveBook(book.bookId)}
                                        >
                                            Save this Book!
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default SearchBooks;
