import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shared/library');
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching library data:', error);
      setLoading(false);
    }
  };

  const handleAddBook = async (book) => {
    try {
      const response = await fetch('/api/shared/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      const data = await response.json();
      setBooks([...books, data]);
      alert('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      // This would typically record the borrow transaction
      alert('Book borrowed successfully!');
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      // This would typically record the return transaction
      alert('Book returned successfully!');
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <DashboardLayout title="Librarian Dashboard">
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Library Inventory */}
        <div className="card inventory-card">
          <h2>Library Inventory</h2>
          {books.length > 0 ? (
            <ul>
              {books.map((book) => (
                <li key={book._id}>
                  <h3>{book.title}</h3>
                  <p>Author: {book.author}</p>
                  <p>Category: {book.category}</p>
                  <p>Total Copies: {book.totalCopies}</p>
                  <p>Available: {book.availableCopies}</p>
                  <p>Borrowed: {book.totalCopies - book.availableCopies}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No books in inventory.</p>
          )}
        </div>

        {/* Add New Book */}
        <div className="card add-book-card">
          <h2>Add New Book</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleAddBook({
              title: formData.get('title'),
              author: formData.get('author'),
              category: formData.get('category'),
              totalCopies: parseInt(formData.get('totalCopies')),
              availableCopies: parseInt(formData.get('totalCopies')),
            });
            e.target.reset();
          }}>
            <input type="text" name="title" placeholder="Book Title" required />
            <input type="text" name="author" placeholder="Author" required />
            <input type="text" name="category" placeholder="Category" required />
            <input type="number" name="totalCopies" placeholder="Total Copies" required />
            <button type="submit">Add Book</button>
          </form>
        </div>

        {/* Borrowed Books Management */}
        <div className="card borrowed-card">
          <h2>Borrowed Books</h2>
          {borrowedBooks.length > 0 ? (
            <ul>
              {borrowedBooks.map((borrow) => (
                <li key={borrow.id}>
                  <h3>{borrow.bookTitle}</h3>
                  <p>Borrowed by: {borrow.borrower}</p>
                  <p>Due Date: {new Date(borrow.dueDate).toLocaleDateString()}</p>
                  <button onClick={() => handleReturnBook(borrow.id)}>Mark Returned</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No borrowed books.</p>
          )}
        </div>

        {/* Library Statistics */}
        <div className="card stats-card">
          <h2>Library Statistics</h2>
          {inventory ? (
            <div>
              <p>Total Books: {inventory.totalBooks}</p>
              <p>Total Copies: {inventory.totalCopies}</p>
              <p>Available: {inventory.availableCopies}</p>
              <p>Borrowed: {inventory.borrowedCopies}</p>
              <p>Occupancy: {((inventory.borrowedCopies / inventory.totalCopies) * 100).toFixed(1)}%</p>
            </div>
          ) : (
            <p>No statistics available.</p>
          )}
        </div>
      </div>

      {loading && <p className="text-center text-gray-500 py-4">Loading dashboard...</p>}
      </div>
    </DashboardLayout>
  );
};

export default LibrarianDashboard;
