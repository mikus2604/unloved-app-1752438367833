Creating a full-stack web application for a blog involves setting up a React frontend, a Node.js backend, and a Supabase database schema. Below is an overview of how to build this application:

### Overview

1. **Frontend**: React will be used to build the user interface to display and manage blog posts.
2. **Backend**: Node.js with Express will handle API requests, interact with the database, and serve the React application.
3. **Database**: Supabase, which is built on top of PostgreSQL, will serve as the database to store blog posts and user data.

### Supabase Schema

First, set up your Supabase project and define the database schema. You can use the Supabase dashboard to create tables.

- **Blog schema**:
  ```sql
  -- Table: users
  CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
  );

  -- Table: posts
  CREATE TABLE posts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users (id),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
  );
  ```
  
### Backend: Node.js with Express

1. **Initialize Node.js Project**:
   ```bash
   mkdir blog-backend
   cd blog-backend
   npm init -y
   npm install express cors dotenv pg
   ```

2. **Setup Environment Variables**: Create a `.env` file to store your Supabase credentials.
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

3. **Create Express Server**: Set up an Express server to handle API routes.

   **server.js**:
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const { createClient } = require('@supabase/supabase-js');
   require('dotenv').config();

   const app = express();
   app.use(cors());
   app.use(express.json());

   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

   // API routes
   app.get('/posts', async (req, res) => {
       const { data, error } = await supabase.from('posts').select('*');
       if (error) return res.status(400).json({ error: error.message });
       res.json(data);
   });

   app.get('/posts/:id', async (req, res) => {
       const { id } = req.params;
       const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
       if (error) return res.status(400).json({ error: error.message });
       res.json(data);
   });

   app.post('/posts', async (req, res) => {
       const { title, content, user_id } = req.body;
       const { data, error } = await supabase.from('posts').insert([{ title, content, user_id }]);
       if (error) return res.status(400).json({ error: error.message });
       res.status(201).json(data);
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
   });
   ```

### Frontend: React

1. **Create React App**:
   ```bash
   npx create-react-app blog-frontend
   cd blog-frontend
   npm install axios
   ```

2. **Fetch and Display Data**: Use Axios to make API requests to your Node.js backend.

   **src/App.js**:
   ```javascript
   import React, { useEffect, useState } from 'react';
   import axios from 'axios';

   const App = () => {
     const [posts, setPosts] = useState([]);

     useEffect(() => {
       const fetchPosts = async () => {
         try {
           const response = await axios.get('http://localhost:5000/posts');
           setPosts(response.data);
         } catch (err) {
           console.error(err);
         }
       };
       fetchPosts();
     }, []);

     return (
       <div>
         <h1>Blog Posts</h1>
         {posts.map(post => (
           <div key={post.id}>
             <h2>{post.title}</h2>
             <p>{post.content}</p>
           </div>
         ))}
       </div>
     );
   };

   export default App;
   ```

### Run the Application

- **Backend**: 
  ```bash
  node server.js
  ```

- **Frontend**: 
  ```bash
  npm start
  ```

In the above setup, replace placeholders such as `your_supabase_url` and `your_supabase_key` with your actual Supabase project details.

This basic setup provides a framework for building your full-stack blog application. You can expand upon this by adding features such as user authentication, richer text editing capabilities, or improved error handling as necessary.