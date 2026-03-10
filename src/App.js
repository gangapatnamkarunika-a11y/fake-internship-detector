import React, { useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";

function App() {

  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [reasons, setReasons] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const fakeWords = [
    "registration",
    "fee",
    "limited",
    "whatsapp",
    "earn",
    "50000",
    "direct hiring",
    "no interview",
    "apply now",
    "urgent",
    "pay now"
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const analyzePoster = async () => {

    if (!image) {
      alert("Please upload a poster");
      return;
    }

    setLoading(true);

    const { data: { text } } = await Tesseract.recognize(
      image,
      "eng"
    );

    console.log(text);

    setText(text);

    const lowerText = text.toLowerCase();

    let found = [];

    fakeWords.forEach(word => {
      if (lowerText.includes(word)) {
        found.push(word);
      }
    });

    let fakeScore = found.length * 15;

    if (fakeScore > 100) fakeScore = 100;

    setScore(fakeScore);

    if (found.length >= 2) {
      setResult("⚠️ Fake Internship Poster");
    } else {
      setResult("✅ Looks Genuine");
    }

    setReasons(found);

    setLoading(false);
  };

  return (
    <div className="container">

      <h1>Fake Internship Poster Detector</h1>

      <p>Upload an internship poster to detect scams</p>

      <input type="file" onChange={handleImageUpload} />

      {image && (
        <div className="preview">
          <img src={image} alt="poster preview"/>
        </div>
      )}

      <button onClick={analyzePoster}>Analyze Poster</button>

      {loading && <h2>Analyzing Poster...</h2>}

      {result && (

        <div className="result">

          <h2>{result}</h2>

          <h3>Fake Probability: {score}%</h3>

          {reasons.length > 0 && (
            <>
              <h3>Suspicious Indicators:</h3>
              <ul>
                {reasons.map((r,i)=>(
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}

          <h3>Extracted Text:</h3>

          <div className="textBox">
            {text}
          </div>

        </div>

      )}

    </div>
  );
}

export default App;