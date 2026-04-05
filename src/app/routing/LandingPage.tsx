import React, { useState, useEffect } from "react";

const LandingPage: React.FC = () => {
  const [index, setIndex] = useState(0);
  const images = [
    "https://media.istockphoto.com/id/1924378252/photo/empty-classroom-with-chairs-and-desks.webp?s=2048x2048&w=is&k=20&c=hoZVooLlk_phMV_D0wGJgdDxvzj6MOYIWWFh8gNZyDs=",
    "https://media.istockphoto.com/id/2161421780/photo/happy-schoolgirl-and-her-friends-raising-hands-on-a-class.jpg?s=2048x2048&w=is&k=20&c=F3ziWtlGjM935mRHKOfJrh3F1pFQJvGAH6DfM-h2noA=",
    "https://media.istockphoto.com/id/2162210336/photo/empty-school-hallway-with-red-lockers-and-checkered-floor.jpg?s=2048x2048&w=is&k=20&c=PASDTOMPNFX33qSk52gaqKZTHwWihy-rtbfvAqcfSTs=",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const moveSlide = (step: number) => {
    setIndex((prevIndex) => (prevIndex + step + images.length) % images.length);
  };

  return (
    <div
      style={{
        fontFamily: "'Poppins', Arial, sans-serif",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(90deg, #002366 0%, #0044cc 100%)",
          color: "#fff",
          padding: "25px 40px",
          fontSize: "28px",
          fontWeight: "700",
          letterSpacing: "1.5px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          animation: "slideInDown 1s ease-out",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <span
          style={{
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            animation: "fadeIn 1.5s ease-in",
          }}
        >
          Welcome to Our School
        </span>
        <button
          onClick={() => (window.location.href = "2i/dashboard")}
          style={{
            background: "linear-gradient(45deg, #00d4ff, #007bff)",
            color: "#fff",
            padding: "12px 25px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 5px 15px rgba(0, 123, 255, 0.4)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 123, 255, 0.6)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 123, 255, 0.4)")
          }
        >
          Go to Dashboard
        </button>
      </div>

      {/* Slideshow */}
      <div
        style={{
          position: "relative",
          width: "90%",
          maxWidth: "1000px",
          height: "500px",
          margin: "40px auto",
          overflow: "hidden",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          animation: "zoomIn 1s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            width: `${images.length * 100}%`,
            height: "100%",
            transition: "transform 0.8s ease-in-out",
            transform: `translateX(${-index * 100 / images.length}%)`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 100%",
                height: "100%",
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                animation: `fadeInSlide ${i === index ? "0.8s" : "0s"} ease-in-out`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "20px",
                  color: "#fff",
                  fontSize: "24px",
                  fontWeight: "600",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                Slide {i + 1}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "20px",
            transform: "translateY(-50%)",
            background: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "15px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "24px",
            transition: "all 0.3s ease",
            animation: "float 3s ease-in-out infinite",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          }}
          onClick={() => moveSlide(-1)}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0, 123, 255, 0.8)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0, 0, 0, 0.6)")}
        >
          ❮
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
            background: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "15px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "24px",
            transition: "all 0.3s ease",
            animation: "float 3s ease-in-out infinite reverse",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          }}
          onClick={() => moveSlide(1)}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0, 123, 255, 0.8)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0, 0, 0, 0.6)")}
        >
          ❯
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
          }}
        >
          {images.map((_, i) => (
            <div
              key={i}
              style={{
                width: "12px",
                height: "12px",
                background: i === index ? "#00d4ff" : "rgba(255, 255, 255, 0.5)",
                borderRadius: "50%",
                cursor: "pointer",
                transition: "background 0.3s ease",
                boxShadow: i === index ? "0 0 10px rgba(0, 212, 255, 0.5)" : "none",
              }}
              onClick={() => setIndex(i)}
            ></div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          background: "#fff",
          margin: "30px 20px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          animation: "fadeInUp 1s ease-out 0.5s both, floatSection 5s ease-in-out infinite",
          position: "relative",
          zIndex: 5,
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#002366",
            marginBottom: "20px",
            background: "linear-gradient(45deg, #007bff, #00d4ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          About Our School
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: "#555",
            lineHeight: "1.6",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          We provide top-quality education with state-of-the-art facilities and a dedicated team of experienced faculty committed to your success.
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          background: "linear-gradient(135deg, #e3efff 0%, #d1e0ff 100%)",
          margin: "30px 20px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          animation: "fadeInUp 1s ease-out 0.7s both, floatSection 5s ease-in-out infinite reverse",
          position: "relative",
          zIndex: 5,
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#002366",
            marginBottom: "20px",
            background: "linear-gradient(45deg, #007bff, #00d4ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Why Choose Us?
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: "#555",
            lineHeight: "1.6",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Discover excellent academic programs, a wide range of extracurricular activities, and a nurturing environment designed to help every student thrive.
        </p>
      </div>

      {/* Floating Particles */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              background: "rgba(0, 212, 255, 0.3)",
              borderRadius: "50%",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatParticle ${Math.random() * 6 + 4}s infinite ease-in-out`,
              boxShadow: "0 0 10px rgba(0, 212, 255, 0.2)",
            }}
          ></div>
        ))}
      </div>

      {/* Inline Keyframes */}
      <style>
        {`
          @keyframes slideInDown {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeInSlide {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes floatSection {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes floatParticle {
            0% { transform: translateY(0) translateX(0); opacity: 0.8; }
            50% { transform: translateY(-20px) translateX(${Math.random() * 20 - 10}px); opacity: 0.5; }
            100% { transform: translateY(-40px) translateX(${Math.random() * 20 - 10}px); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;






// import React, { useState, useEffect } from "react";

// const LandingPage: React.FC = () => {
//   const [index, setIndex] = useState(0);
//   const images = [
//     "https://media.istockphoto.com/id/1924378252/photo/empty-classroom-with-chairs-and-desks.webp?s=2048x2048&w=is&k=20&c=hoZVooLlk_phMV_D0wGJgdDxvzj6MOYIWWFh8gNZyDs=",
//     "https://media.istockphoto.com/id/2161421780/photo/happy-schoolgirl-and-her-friends-raising-hands-on-a-class.jpg?s=2048x2048&w=is&k=20&c=F3ziWtlGjM935mRHKOfJrh3F1pFQJvGAH6DfM-h2noA=",
//     "https://media.istockphoto.com/id/2162210336/photo/empty-school-hallway-with-red-lockers-and-checkered-floor.jpg?s=2048x2048&w=is&k=20&c=PASDTOMPNFX33qSk52gaqKZTHwWihy-rtbfvAqcfSTs=",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [images.length]);

//   const moveSlide = (step: number) => {
//     setIndex((prevIndex) => (prevIndex + step + images.length) % images.length);
//   };

//   return (
//     <div style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0, boxSizing: "border-box", background: "#f0f0f5" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#002366", color: "white", padding: "20px", fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>
//         <span>Welcome to Our School</span>
//         <button 
//           onClick={() => window.location.href = '/dashboard'}
//           style={{ background: "#0044cc", color: "white", padding: "10px 20px", borderRadius: "8px", fontSize: "16px", border: "none", cursor: "pointer", transition: "background 0.3s" }}
//           onMouseOver={(e) => e.currentTarget.style.background = "#0033a0"}
//           onMouseOut={(e) => e.currentTarget.style.background = "#0044cc"}
//         >
//           Go to Dashboard
//         </button>
//       </div>

//       <div style={{ position: "relative", width: "800px", height: "400px", margin: "30px auto", overflow: "hidden", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
//         <div style={{ display: "flex", width: `${images.length * 100}%`, transition: "transform 0.5s ease-in-out", transform: `translateX(${-index * 100 / images.length}%)` }}>
//           {images.map((src, i) => (
//             <img key={i} src={src} alt={`Slide ${i + 1}`} style={{ width: "100%", height: "400px", objectFit: "cover", flex: "0 0 100%" }} />
//           ))}
//         </div>
//         <div style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", background: "rgba(0, 0, 0, 0.5)", color: "white", padding: "10px", borderRadius: "50%", cursor: "pointer" }} onClick={() => moveSlide(-1)}>&#10094;</div>
//         <div style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", background: "rgba(0, 0, 0, 0.5)", color: "white", padding: "10px", borderRadius: "50%", cursor: "pointer" }} onClick={() => moveSlide(1)}>&#10095;</div>
//       </div>

//       <div style={{ padding: "40px", textAlign: "center", background: "#ffffff", margin: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
//         <h2>About Our School</h2>
//         <p>We provide top-quality education with modern facilities and experienced faculty.</p>
//       </div>

//       <div style={{ padding: "40px", textAlign: "center", background: "#e3e3e3", margin: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
//         <h2>Why Choose Us?</h2>
//         <p>Excellent academic programs, extracurricular activities, and a nurturing environment.</p>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;
