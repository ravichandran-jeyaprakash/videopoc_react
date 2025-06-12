import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;

interface AnalysisProps {
  data: {
    summary: {
      filename: string;
      duration: number;
      fps: number;
      resolution: [number, number];
      transcript: string | null;
      transcript_file: string | null;
      analysis_file: string | null;
      highlight_file: string | null;
      summaries: {
        paragraph_summary: string;
        bullet_points: string[];
        key_points: string[];
        decisions: string[];
        action_items: string[];
      } | null;
      timestamps: Array<{ timestamp: string; text: string }> | null;
    };
  };
}

const Analysis: React.FC<AnalysisProps> = ({ data }) => {
  const { summary } = data;
  const [error, setError] = useState<string | null>(null);

  // Clear error state when new data comes in
  useEffect(() => {
    setError(null);
  }, [data]);

  const handleDownload = async (type: string, format: string) => {
    try {
      console.log(`Downloading ${type} in ${format} format...`);
      const response = await axios.get(
        `http://localhost:5000/download/${type}/${format}/${summary.filename}`,
        { 
          responseType: 'blob',
          withCredentials: true
        }
      );
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${summary.filename}_${type}.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log(`Successfully downloaded ${filename}`);
    } catch (error: any) {
      console.error('Download error:', error);
      let errorMessage = 'Error downloading file. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data instanceof Blob) {
          // Try to read the error message from the blob
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result as string);
              setError(errorData.error || errorMessage);
            } catch (e) {
              setError(errorMessage);
            }
          };
          reader.readAsText(error.response.data);
        } else {
          setError(error.response.data.error || errorMessage);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(error.message || errorMessage);
      }
    }
  };

  const handleDownloadHighlights = async () => {
    try {
      console.log('Downloading highlights video...');
      const response = await axios.get(
        `http://localhost:5000/highlights/${summary.filename}`,
        { 
          responseType: 'blob',
          withCredentials: true
        }
      );
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${summary.filename}_highlights.mp4`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log(`Successfully downloaded ${filename}`);
    } catch (error: any) {
      console.error('Download error:', error);
      let errorMessage = 'Error downloading highlights. Please try again.';
      
      if (error.response) {
        if (error.response.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result as string);
              setError(errorData.error || errorMessage);
            } catch (e) {
              setError(errorMessage);
            }
          };
          reader.readAsText(error.response.data);
        } else {
          setError(error.response.data.error || errorMessage);
        }
      } else if (error.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError(error.message || errorMessage);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Video Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Video Information
            </Typography>
            <Typography>
              Duration: {Math.round(summary.duration)} seconds
            </Typography>
            <Typography>
              Resolution: {summary.resolution[0]}x{summary.resolution[1]}
            </Typography>
            <Typography>FPS: {summary.fps}</Typography>
          </Paper>
        </Grid>

        {!summary.transcript && (
          <Grid item xs={12}>
            <Alert severity="warning">
              No transcript was generated for this video. This could be due to:
              <ul>
                <li>The video has no audio track</li>
                <li>The audio quality is too low</li>
                <li>The video format is not supported for transcription</li>
              </ul>
            </Alert>
          </Grid>
        )}

        {/* Download Options */}
        {summary.transcript && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Download Options
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload('analysis', 'txt')}
                >
                  Analysis (TXT)
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload('analysis', 'docx')}
                >
                  Analysis (DOCX)
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload('analysis', 'pdf')}
                >
                  Analysis (PDF)
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload('transcript', 'txt')}
                >
                  Transcript (TXT)
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload('transcript', 'docx')}
                >
                  Transcript (DOCX)
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadHighlights}
                >
                  Highlights Video
                </Button>
              </Box>1
            </Paper>
          </Grid>
        )}

        {/* Summary */}
        {summary.summaries && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography paragraph>
                {summary.summaries.paragraph_summary}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Key Points
              </Typography>
              <List>
                {summary.summaries.key_points.map((point, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Decisions
              </Typography>
              <List>
                {summary.summaries.decisions.map((decision, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={decision} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Action Items
              </Typography>
              <List>
                {summary.summaries.action_items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Transcript with Timestamps */}
        {summary.timestamps && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Transcript with Timestamps
              </Typography>
              <List>
                {summary.timestamps.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={item.text}
                        secondary={`[${item.timestamp}]`}
                      />
                    </ListItem>
                    {index < summary.timestamps!.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Analysis; 