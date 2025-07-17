import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { API_URLS } from '../api/apiConfig';

// Configure axios defaults
axios.defaults.withCredentials = true;

interface VideoUploadProps {
  onUploadComplete: (data: any) => void;
  options: {
    transcription: boolean;
    summary: boolean;
    highlight: boolean;
  };
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadComplete, options }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid video file (MP4, AVI, MOV, or MKV)');
      return;
    }

    // Check file size (500MB limit)
    if (file.size > 500 * 1024 * 1024) {
      setError('File size must be less than 500MB');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('transcription', String(options.transcription));
    formData.append('summary', String(options.summary));
    formData.append('highlight', String(options.highlight));

    // Debug: log the values being sent
    console.log('FormData:', {
      transcription: String(options.transcription),
      summary: String(options.summary),
      highlight: String(options.highlight)
    });

    try {
      console.log('Uploading file:', file.name);
      const response = await axios.post(API_URLS.upload(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      console.log('Upload response:', response.data);
      
      if (response.data && response.data.summary) {
        // Check if we have a valid response with video metadata
        if (response.data.summary.duration && response.data.summary.fps) {
          onUploadComplete(response.data);
        } else {
          throw new Error('Invalid video metadata in response');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      console.error('Upload error details:', err);
      let errorMessage = 'Error uploading video. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        errorMessage = err.response.data.error || errorMessage;
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Please check if the server is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        errorMessage = err.message || errorMessage;
      }
      
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, options]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? 'Drop the video here'
            : 'Drag and drop a video file here, or click to select'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Supported formats: MP4, AVI, MOV, MKV (max 500MB)
        </Typography>
      </Box>

      {uploading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default VideoUpload;