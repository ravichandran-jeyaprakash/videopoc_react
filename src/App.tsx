import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import VideoUpload from './components/VideoUpload';
import Analysis from './components/Analysis';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [options, setOptions] = useState({
    transcription: true,
    summary: true,
    highlight: false,
  });

  const handleUploadComplete = (data: any) => {
    setAnalysisData(data);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({
      ...options,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <VideoUpload onUploadComplete={handleUploadComplete} options={options} />
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select options to process:
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={options.transcription} onChange={handleOptionChange} name="transcription" />}
              label="Transcription"
            />
            <FormControlLabel
              control={<Checkbox checked={options.summary} onChange={handleOptionChange} name="summary" />}
              label="Summary Output"
            />
            <FormControlLabel
              control={<Checkbox checked={options.highlight} onChange={handleOptionChange} name="highlight" />}
              label="Highlight Video (Optional)"
            />
          </FormGroup>
        </Box>
        {analysisData && <Analysis data={analysisData} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
