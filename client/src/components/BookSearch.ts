// src/components/BookSearch.js

import React, { useState } from 'react';
import { searchGoogleBooks } from '../services/googleBooksService';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const results = await searchGoogleBooks(query);
    setBooks(results);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books"
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {books.map((book) => (
          <div key={book.id} className="book">
            <h3>{book.volumeInfo.title}</h3>
            <p>By: {book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
            <p>{book.volumeInfo.description || 'No description available.'}</p>
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={`${book.volumeInfo.title} cover`}
              />
            )}
            <a href={book.volumeInfo.infoLink} target="_blank" rel="noreferrer">
              More Info
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSearch;
