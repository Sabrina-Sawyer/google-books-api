import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries'; // Import your GET_ME query
import { Book } from '../models/Book.js'; // Import your Book interface
import { REMOVE_BOOK } from '../utils/mutations'; // Import your REMOVE_BOOK mutation
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const SavedBooks = () => {
    const { loading, error, data } = useQuery(GET_ME); // Fetch user data including saved books
    const [deleteBook] = useMutation(REMOVE_BOOK); // Use mutation to remove a book

    const handleDeleteBook = async (bookId: string) => {
        try {
            await deleteBook({
                variables: { bookId },
                refetchQueries: [{ query: GET_ME }], // Refetch user data to update saved books list
            });
        } catch (err) {
            console.error('Error deleting book:', err);
        }
    };

    if (loading) return <h2>LOADING...</h2>;
    if (error) return <p>Error loading saved books: {error.message}</p>;

    const userData = data.me; // Assuming GET_ME returns user data with savedBooks

    return (
        <>
            <div className='text-light bg-dark p-5'>
                <Container>
                    <h1>Viewing {userData.username}'s saved books!</h1>
                </Container>
            </div>
            <Container>
                <h2 className='pt-5'>
                    {userData.savedBooks.length
                        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                        : 'You have no saved books!'}
                </h2>
                <Row>
                    {userData.savedBooks.map((book: Book) => (
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
                                    <Button
                                        className='btn-block btn-danger'
                                        onClick={() => handleDeleteBook(book.bookId)}
                                    >
                                        Delete this Book!
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default SavedBooks;
