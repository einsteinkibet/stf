import React, { useState, useRef } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { listingsAPI } from '../../api/api';

const ImageUpload = ({ listingId, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setError('Please select valid image files (max 5MB each)');
    } else {
      setError('');
    }

    setSelectedFiles(validFiles);
    
    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await listingsAPI.uploadImage(listingId, formData);
      onUploadSuccess(response.data);
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];
    
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Upload Images</Form.Label>
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          ref={fileInputRef}
        />
        <Form.Text className="text-muted">
          Select up to 10 images (max 5MB each)
        </Form.Text>
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      {previewUrls.length > 0 && (
        <div className="mb-3">
          <h6>Preview:</h6>
          <Row>
            {previewUrls.map((url, index) => (
              <Col key={index} xs={6} md={3} className="mb-3">
                <div className="position-relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="img-thumbnail"
                    style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0"
                    onClick={() => removeFile(index)}
                    style={{ transform: 'translate(50%, -50%)' }}
                  >
                    ×
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
          >
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;