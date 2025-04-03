import React, { useState } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  LinearProgress,
  Paper
} from '@mui/material';
import { AttachFile, Delete, CloudUpload } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

const FileUpload = ({ onUploadComplete, maxFiles = 5, acceptedTypes = '*' }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    const uploadedUrls = [];
    const newProgress = { ...uploadProgress };

    for (const file of selectedFiles) {
      const fileId = uuidv4();
      newProgress[fileId] = 0;
      setUploadProgress(newProgress);

      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${fileId}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('form-attachments')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('form-attachments')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        setFiles(prev => [...prev, { name: file.name, url: publicUrl, id: fileId }]);
        
        newProgress[fileId] = 100;
        setUploadProgress(newProgress);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Error uploading ${file.name}`);
        delete newProgress[fileId];
        setUploadProgress(newProgress);
      }
    }

    setUploading(false);
    if (uploadedUrls.length > 0) {
      onUploadComplete(uploadedUrls);
    }
  };

  const handleRemoveFile = async (fileToRemove) => {
    try {
      const filePath = fileToRemove.url.split('/').pop();
      const { error } = await supabase.storage
        .from('form-attachments')
        .remove([filePath]);

      if (error) throw error;

      setFiles(files.filter(file => file.id !== fileToRemove.id));
      onUploadComplete(files.filter(file => file.id !== fileToRemove.id).map(f => f.url));
    } catch (error) {
      console.error('Error removing file:', error);
      alert('Error removing file');
    }
  };

  return (
    <Box>
      <input
        accept={acceptedTypes}
        style={{ display: 'none' }}
        id="file-upload-input"
        multiple
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      <label htmlFor="file-upload-input">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUpload />}
          disabled={uploading || files.length >= maxFiles}
          fullWidth
          sx={{ mb: 2 }}
        >
          Upload Files ({files.length}/{maxFiles})
        </Button>
      </label>

      {files.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
          <List dense>
            {files.map((file) => (
              <ListItem key={file.id}>
                <AttachFile sx={{ mr: 1 }} />
                <ListItemText
                  primary={file.name}
                  secondary={
                    uploadProgress[file.id] < 100 ? (
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress[file.id]}
                      />
                    ) : null
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveFile(file)}
                    disabled={uploading}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {uploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
          <Typography variant="caption" display="block" textAlign="center">
            Uploading...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
