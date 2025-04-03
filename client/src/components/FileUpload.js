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
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const FileUpload = ({ files, setFiles }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (files.length + selectedFiles.length > 5) {
      setError('Maximum 5 files allowed');
      return;
    }

    setUploading(true);
    setError('');

    try {
      if (!isSupabaseConfigured()) {
        // Development mode - simulate file upload
        const mockFiles = selectedFiles.map(file => ({
          name: file.name,
          size: file.size,
          url: URL.createObjectURL(file),
          id: uuidv4()
        }));
        setFiles([...files, ...mockFiles]);
        return;
      }

      for (const file of selectedFiles) {
        const fileId = uuidv4();
        const fileExt = file.name.split('.').pop();
        const filePath = `${fileId}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('form-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('form-attachments')
          .getPublicUrl(filePath);

        setFiles(prev => [...prev, {
          id: fileId,
          name: file.name,
          size: file.size,
          url: publicUrl
        }]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileToDelete) => {
    if (!isSupabaseConfigured()) {
      setFiles(files.filter(f => f.id !== fileToDelete.id));
      return;
    }

    try {
      const fileName = fileToDelete.url.split('/').pop();
      await supabase.storage
        .from('form-attachments')
        .remove([fileName]);

      setFiles(files.filter(f => f.id !== fileToDelete.id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="file-upload"
        accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.x_t,.x_b,.png,.jpg,.jpeg"
      />
      <label htmlFor="file-upload">
        <Button
          component="span"
          variant="outlined"
          startIcon={<CloudUpload />}
          disabled={uploading}
          sx={{ mb: 2 }}
        >
          Upload Files
        </Button>
      </label>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1, mb: 1 }}>
          {error}
        </Typography>
      )}

      {uploading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {files.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 2 }}>
          <List>
            {files.map((file) => (
              <ListItem key={file.id}>
                <AttachFile sx={{ mr: 2 }} />
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDelete(file)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default FileUpload;
