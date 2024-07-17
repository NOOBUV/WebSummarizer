import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const validateUrl = (url) => {
    // implement validation
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateUrl(url)) {
      setError('Please enter a valid URL.');
      return;
    }
    setError('');
    try {
      const response = axios.post('https://websummarizerbackend.onrender.com/crawl_and_summarize', {
        url: url
      })
      .then(function (response) {
        console.log(response.data.summaries);
        setSummaries(response.data.summaries);
      })
      .catch(function (error) {
        console.log(error);
      });
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Web Crawler & Summarizer</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Enter website URL"
            value={url}
            onChange={handleInputChange}
            className="url-input"
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="summaries">
          {summaries.map((summary, index) => (
            <div key={index} className="summary-card">
              <h3>{summary.url}</h3>
              <p>{summary.summary}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
