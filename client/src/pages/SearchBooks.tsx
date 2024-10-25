import { useState } from 'react';
import type { FormEvent } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks} from '../utils/api.js';
import Auth from '../utils/auth';
import { GoogleAPIBook } from '../models/GoogleAPIBook'; // Assuming this is where your GoogleAPIBook type is defined
import { Book } from '../models/Book'; // Import the Book type
// import { GOOGLE_BOOKS_QUERY } from '../utils/queries'; // Ensure this is correct

const SearchBooks = () => {
    const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [saveBook] = useMutation(SAVE_BOOK);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (!searchInput) {
            return false;
        }
    
        try {
            // Fetch books using the custom hook
            const { loading, error, data } = await searchGoogleBooks(searchInput);
    
            if (loading) return; // Optionally handle loading state
            if (error) {
                console.error('Error fetching books:', error);
                return;
            }
    
            if (data) {
                const bookData: Book[] = data.map((book: GoogleAPIBook) => ({
                    bookId: book.id,
                    authors: book.volumeInfo.authors || ['No author to display'],
                    title: book.volumeInfo.title,
                    description: book.volumeInfo.description,
                    image: book.volumeInfo.imageLinks?.thumbnail || '',
                    link: book.volumeInfo.infoLink || '', // Assuming infoLink contains the book link
                }));
    
                setSearchedBooks(bookData);
                setSearchInput('');
            }
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
                variables: { bookData: { ...bookToSave } },
            });

            if (!data) {
                throw new Error('Something went wrong!');
            }
        } catch (err) {
            console.error('Error saving book:', err);
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