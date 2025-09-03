import { useState } from 'react';
import { Modal, Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FaExpand, FaTimes } from 'react-icons/fa';
import MapBoxDemo from './MapBoxDemo'; // Adjust import path as needed

const Demos = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<any>(null);

  const demoData = [
    {
      id: 1,
      title: "3D Mapbox Demo",
      description: "Interactive 3D map with buildings and navigation controls",
      component: <MapBoxDemo />,
      thumbnail: "https://via.placeholder.com/300x200/4a90e2/ffffff?text=3D+Map"
    },
    {
      id: 2,
      title: "Demo 2",
      description: "Description for demo 2 functionality",
      component: <div style={{padding: '20px', textAlign: 'center'}}>Demo 2 Component</div>,
      thumbnail: "https://via.placeholder.com/300x200/50c878/ffffff?text=Demo+2"
    },
    {
      id: 3,
      title: "Demo 3",
      description: "Description for demo 3 functionality",
      component: <div style={{padding: '20px', textAlign: 'center'}}>Demo 3 Component</div>,
      thumbnail: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Demo+3"
    }
  ];

  const openModal = (demo:any) => {
    setSelectedDemo(demo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDemo(null);
  };

  return (
    <div className="demos" style={{ padding: '0', backgroundColor: '#1a1a1a', minHeight: '100%' }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '15px' }}>Demos</h2>
          <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
            Explore interactive demonstrations of our applications
          </p>
        </div>

        <Row>
          {demoData.map((demo) => (
            <Col lg={4} md={6} sm={12} key={demo.id} className="mb-4">
              <Card 
                style={{ 
                  backgroundColor: '#2d2d2d', 
                  border: '1px solid #404040',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  height: '100%'
                }}
                className="demo-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <Card.Img 
                    variant="top" 
                    src={demo.thumbnail}
                    style={{ 
                      height: '200px', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: '0',
                      transition: 'opacity 0.3s ease',
                      cursor: 'pointer'
                    }}
                    className="expand-btn"
                    onClick={() => openModal(demo)}
                  >
                    <FaExpand size={20} />
                  </div>
                </div>
                
                <Card.Body style={{ color: 'white' }}>
                  <Card.Title style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                    {demo.title}
                  </Card.Title>
                  <Card.Text style={{ color: '#cccccc', marginBottom: '20px' }}>
                    {demo.description}
                  </Card.Text>
                  <Button
                    variant="outline-light"
                    onClick={() => openModal(demo)}
                    style={{
                      borderColor: '#4a90e2',
                      color: '#4a90e2',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as any).style.backgroundColor = '#4a90e2';
                      (e.target as any).style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as any).style.backgroundColor = 'transparent';
                      (e.target as any).style.color = '#4a90e2';
                    }}
                  >
                    <FaExpand className="me-2" />
                    View Demo
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal for full-screen demo */}
        <Modal 
          show={showModal} 
          onHide={closeModal} 
          size="xl" 
          centered
          style={{ zIndex: 9999 }}
        >
          <Modal.Header 
            style={{ 
              backgroundColor: '#2d2d2d', 
              border: 'none',
              color: 'white'
            }}
          >
            <Modal.Title>{selectedDemo?.title}</Modal.Title>
            <Button
              variant="link"
              onClick={closeModal}
              style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '0',
                border: 'none',
                fontSize: '1.5rem'
              }}
            >
              <FaTimes />
            </Button>
          </Modal.Header>
          <Modal.Body 
            style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '0',
              minHeight: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {selectedDemo && (
              <div style={{ width: '100%', height: '100%' }}>
                {selectedDemo.component}
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>

      <style>{`
        .demo-card:hover .expand-btn {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default Demos;