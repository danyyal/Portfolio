import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import { MdFullscreen } from "react-icons/md";
import { Badge } from "react-bootstrap";

function ProjectCards(props:any) {
  const { isPrivate, imgPath, title, description, ghLink, isBlog, demoLink } =
    props;
  
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Card className="project-card-view">
        <div className="position-relative" style={{ cursor: "pointer" }}>
          <Card.Img 
            variant="top" 
            src={imgPath} 
            height={230}
            alt="card-img" 
            onClick={handleImageClick}
            style={{ transition: "opacity 0.3s ease", maxHeight:'230px' }}
            onMouseOver={(e) => (e.target as any).style.opacity = "0.8"}
            onMouseOut={(e) => (e.target as any).style.opacity = "1"}
          />
          {imgPath &&  <div 
            className="position-absolute top-0 end-0 m-2 bg-dark bg-opacity-75 rounded p-1"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          >
            <MdFullscreen size={20} color="white" />
          </div> }
        </div>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          {isPrivate && (
              <Badge bg="warning" className="d-flex align-items-center">
                <FiLock className="me-1" size={12} />
                Private
              </Badge>
            )}
          <Card.Text style={{ textAlign: "justify" }}>{description}</Card.Text>
          <Button style={{display:'inline-flex', alignItems:'center'}} disabled={!Boolean(ghLink?.includes('http'))} variant="primary" href={ghLink} target="_blank">
            <BsGithub /> &nbsp;
            {isBlog ? "Blog" : "GitHub"}
          </Button>
          {"\n"}
          {"\n"}

          {/* If the component contains Demo link and if it's not a Blog then, it will render the below component  */}

          {!isBlog && (
            <Button
            style={{marginLeft: "10px" ,display:'inline-flex', alignItems:'center'}}
              disabled={!Boolean(demoLink)}
              variant={!Boolean(demoLink) ?'secondary' :"primary"}
              href={demoLink}
              target="_blank"
            >
              <CgWebsite /> &nbsp;
              {"Demo"}
            </Button>
          )}
        </Card.Body>
      </Card>

      {/* Fullscreen Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="xl" 
        centered
        className="fullscreen-modal"
      >
        <Modal.Header closeButton className="border-0 bg-dark text-white">
          <Modal.Title className="d-flex align-items-center">
            <MdFullscreen className="me-2" size={24} />
            {title}
          </Modal.Title>
          <style>{`
            .modal-header .btn-close {
              filter: invert(1) grayscale(100%) brightness(200%);
            }
          `}</style>
        </Modal.Header>
        <Modal.Body className="p-0">
          <img 
            src={imgPath} 
            alt={title}
            style={{ 
              width: "100%", 
              height: "auto", 
              maxHeight: "80vh", 
              objectFit: "contain" 
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
export default ProjectCards;