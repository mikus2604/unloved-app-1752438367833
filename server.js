
      const express = require('express');
      const { createClient } = require('@supabase/supabase-js');
      const app = express();
      app.use(express.json());
      const supabase = createClient('https://vfqmjfctgmbzoxsrizcs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcW1qZmN0Z21iem94c3JpemNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzE2NjksImV4cCI6MjA2ODAwNzY2OX0.S1-0ZjMXuW5Rzg1lBjsC2sYkT6ZND4AaSuDX0PDYq8M');

      app.get('/api/posts', async (req, res) => {
        const { data, error } = await supabase.from('posts').select('*');
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
      });

      app.post('/api/posts', async (req, res) => {
        const { title, content, author } = req.body;
        const { data, error } = await supabase.from('posts').insert([{ title, content, author }]);
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data);
      });

      app.listen(3000, () => console.log('Server running on port 3000'));
    