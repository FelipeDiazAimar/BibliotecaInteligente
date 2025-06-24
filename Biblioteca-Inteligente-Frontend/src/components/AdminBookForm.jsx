import React, { useState } from 'react';
import './AdminPage.css';
import { useUser } from '../context/UserContext';

const AdminPage = () => {
  const { usuario, setUsuario } = useUser();
  const [books, setBooks] = useState([]);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookDescription, setBookDescription] = useState('');

  const handleAddBook = () => {
    if (bookTitle && bookAuthor) {
      const newBook = {
        title: bookTitle,
        author: bookAuthor,
        description: bookDescription,
      };
      setBooks([...books, newBook]);
      setBookTitle('');
      setBookAuthor('');
      setBookDescription('');
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logged out');
  };

  return (
    <div className="admin-overlay">
      <div className="admin-navbar">
        <h1 className="admin-logo">Admin Panel</h1>
        <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="admin-main">
        <h2>Add New Book</h2>
        <div className="admin-form">
          <input
            type="text"
            placeholder="Book Title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={bookDescription}
            onChange={(e) => setBookDescription(e.target.value)}
          />
          <button className="admin-add-btn" onClick={handleAddBook}>Add Book</button>
        </div>
        <h2>Book List</h2>
        <ul className="admin-book-list">
          {books.map((book, index) => (
            <li key={index} className="admin-book-item">
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>{book.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;