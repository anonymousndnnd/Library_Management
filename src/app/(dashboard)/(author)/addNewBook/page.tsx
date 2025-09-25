'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function AddNewBook() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const router=useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/author_addBook', { title, description }); 
      // Make sure this matches your route path

      if (res.data.success) {
        setMessage('Book added successfully!')
        router.replace('/authorDashboard');
      } else {
        setMessage(res.data.message || 'Failed to add book');
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add New Book</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description: </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}