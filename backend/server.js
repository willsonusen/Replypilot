import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({origin: '*'}));
app.use(express.json());

app.get('/', (req,res)=> res.send('ReplyPilot Backend is LIVE! API Ready'));

app.get('/api/threads/:userId', async (req,res)=>{
  try{
    const r = await axios.get(`https://graph.threads.net/v1.0/${req.params.userId}/threads`, {
      params: { fields: 'id,text,permalink,reply_count,timestamp', access_token: process.env.THREADS_TOKEN }
    });
    res.json(r.data);
  }catch(e){ res.status(500).json({error: e.response?.data || e.message}); }
});

app.get('/api/replies/:threadId', async (req,res)=>{
  try{
    const r = await axios.get(`https://graph.threads.net/v1.0/${req.params.threadId}/replies`, {
      params: { fields: 'id,text,username,timestamp,like_count', access_token: process.env.THREADS_TOKEN }
    });
    res.json(r.data);
  }catch(e){ res.status(500).json({error: e.response?.data || e.message}); }
});

app.post('/api/hide/:replyId', async (req,res)=>{
  try{
    const r = await axios.post(`https://graph.threads.net/v1.0/${req.params.replyId}/hide`, { hide: req.body.hide }, { params: { access_token: process.env.THREADS_TOKEN }});
    res.json(r.data);
  }catch(e){ res.status(500).json({error: e.response?.data || e.message}); }
});

app.post('/api/reply', async (req,res)=>{
  const { userId, replyToId, text } = req.body;
  if(!userId || !replyToId || !text) return res.status(400).json({error: 'userId, replyToId, text required'});
  try{
    const r = await axios.post(`https://graph.threads.net/v1.0/${userId}/threads`, {
      media_type: 'TEXT',
      text: text,
      reply_to_id: replyToId
    }, { params: { access_token: process.env.THREADS_TOKEN }});
    res.json(r.data);
  }catch(e){ res.status(500).json({error: e.response?.data || e.message}); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Backend running on '+PORT));
