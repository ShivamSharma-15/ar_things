import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../Modal";

const productImages = [
  `${process.env.PUBLIC_URL}/couch-front.png`,
  `${process.env.PUBLIC_URL}/couch-left.png`,
  `${process.env.PUBLIC_URL}/couch-right.png`,
];

export default function ProductPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (navigator.xr) {
      navigator.xr
        .isSessionSupported("immersive-ar")
        .then((supported) => setIsARSupported(supported))
        .catch(() => setIsARSupported(false));
    } else {
      setIsARSupported(false);
    }
  }, []);
  const navigate = useNavigate();
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "50px auto",
      padding: "30px",
      backgroundColor: "#fdfdfd",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      fontFamily: "'Helvetica Neue', sans-serif",
      color: "#333",
    },
    image: {
      width: "100%",
      height: "480px",
      objectFit: "cover",
      borderRadius: "12px",
      transition: "opacity 0.4s ease-in-out",
      marginBottom: "20px",
    },
    navButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "30px",
    },
    arrowButton: {
      fontSize: "16px",
      padding: "10px 18px",
      borderRadius: "9999px",
      border: "1px solid #ccc",
      backgroundColor: "#fff",
      cursor: "pointer",
      width: "120px",
      transition: "all 0.3s ease",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    description: {
      fontSize: "16px",
      lineHeight: "1.6",
      marginBottom: "30px",
      color: "#555",
    },
    price: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#222",
      marginBottom: "20px",
    },
    addToCartButton: {
      backgroundColor: "#3e3e3e",
      color: "#fff",
      padding: "14px 32px",
      fontSize: "16px",
      border: "none",
      marginRight: "10px",
      marginBottom: "10px",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  };

  const goBack = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const goForward = () => {
    setCurrentIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleAr = () => {
    if (isARSupported) {
      navigate("canvas");
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div style={styles.container}>
        <img
          src={productImages[currentIndex]}
          alt={`Sofa view ${currentIndex + 1}`}
          style={styles.image}
        />
        <div style={styles.navButtons}>
          <button style={styles.arrowButton} onClick={goBack}>
            Previous
          </button>
          <button style={styles.arrowButton} onClick={goForward}>
            Next
          </button>
        </div>
        <div>
          <h2 style={styles.title}>Luxe Modern Sofa</h2>
          <p style={styles.description}>
            Sink into comfort with our Luxe Modern Sofa — a perfect blend of
            contemporary design and plush coziness. Upholstered in high-quality
            linen with a minimal oak wood base, this piece elevates any living
            room.
          </p>
          <div style={styles.price}>₹ 9,999</div>
          <button
            style={styles.addToCartButton}
            onClick={() => alert("Added to cart! 🛒")}
          >
            Add to Cart
          </button>
          <button style={styles.addToCartButton} onClick={handleAr}>
            View In AR
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
