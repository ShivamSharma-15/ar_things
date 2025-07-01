import React from "react";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalStyle = {
    position: "relative",
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    maxWidth: "28rem",
    width: "100%",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    fontSize: "1.5rem",
    color: "#6B7280", // gray-500
    background: "none",
    border: "none",
    cursor: "pointer",
  };

  const imageContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  };

  const imageStyle = {
    maxWidth: "100%",
    maxHeight: "400px",
    borderRadius: "0.5rem",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle}>
        <button
          onClick={onClose}
          style={closeButtonStyle}
          aria-label="Close Modal"
        >
          &times;
        </button>
        <div style={imageContainerStyle}>
          <img src="/qr-code.png" alt="UwU Modal" style={imageStyle} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
