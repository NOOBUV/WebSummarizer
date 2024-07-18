import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const validateUrl = (url) => {
    const pattern = new RegExp(
      /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g
    );
    return url.trim() !== '' && pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateUrl(url)) {
      setError('Please enter a valid URL.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('https://websummarizerbackend.onrender.com/crawl_and_summarize', {
        url: url
      });
      console.log(response.data.summaries);
      setSummaries(response.data.summaries);
    } catch (error) {
      console.error('There was an error!', error);
      if (error.response.data.detail === 'No URLs found.') {
        setError('Website Not Scrappable');
      } else {
        setError(error.response.data.detail);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: 40 }}>
      <Container maxWidth="md">
        <form onSubmit={handleSubmit} className='form-container'>
          <TextField
            type="text"
            placeholder="Enter website URL"
            value={url}
            onChange={handleInputChange}
            variant="outlined"
            style={{ marginRight: 10 }}
            fullWidth
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          {loading ? (
            <CircularProgress color="primary" size={24} />
          ) : (
            <Button 
              type="submit" 
              variant="outlined" 
              color="primary"
              disabled={loading}
              className = "crawl-button"
            >
              Crawl
            </Button>
          )}
        </form>
        {error && <Typography variant="body1" className = "error">{error}</Typography>}
        <Box className = "summary-box">
          {summaries.map((summary, index) => (
            <Box key={index} sx={{ width: '80%', maxWidth: 600, margin: '0 auto 20px', padding: 2, border: '1px solid #ccc', borderRadius: 4 }}>
              <Tooltip title={summary.url} placement="top" arrow>
                <Typography variant="h5" gutterBottom component="div">
                  <strong class = "summary-url">
                    {summary.url}
                  </strong>
                </Typography>
              </Tooltip>
              <Typography variant="body1" component="div">{summary.summary}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </div>
  );
}

export default App;