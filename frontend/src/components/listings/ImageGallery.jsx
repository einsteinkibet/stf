import React, { useState } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';

const ImageGallery = ({ images }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-5 bg-light rounded">
        <p className="text-muted">No images available</p>
      </div>
    );
  }

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  return (
    <>
      <Row className="g-2">
        <Col md={8}>
          <img
            src={images[0]?.image || '/placeholder-image.jpg'}
            alt="Main"
            className="img-fluid rounded w-100"
            style={{ height: '400px', objectFit: 'cover', cursor: 'pointer' }}
            onClick={() => handleImageClick(images[0])}
          />
        </Col>
        <Col md={4}>
          <Row className="g-2">
            {images.slice(1, 5).map((image, index) => (
              <Col key={index} xs={6}>
                <img
                  src={image.image}
                  alt={`Thumbnail ${index + 1}`}
                  className="img-fluid rounded w-100"
                  style={{ height: '95px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleImageClick(image)}
                />
              </Col>
            ))}
            {images.length > 5 && (
              <Col xs={6}>
                <div
                  className="bg-secondary rounded d-flex align-items-center justify-content-center w-100"
                  style={{ height: '95px', cursor: 'pointer' }}
                  onClick={() => handleImageClick(images[4])}
                >
                  <span className="text-white">+{images.length - 4} more</span>
                </div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Body className="p-0">
          {selectedImage && (
            <img
              src={selectedImage.image}
              alt="Full size"
              className="img-fluid w-100"
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageGallery;