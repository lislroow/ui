import axios from "axios";
import React, { useState, useRef } from "react";
import styled from 'styled-components';


const UploadImages = () => {
  const [ uploadImages, setUploadImages ] = useState<string[]>([]);
  const [ uploadImageFiles, setUploadImageFiles ] = useState<File[]>([]);
  const uploadAreaRef = useRef<HTMLDivElement>();

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    const newImages: string[] = [];
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result.toString());
          if (newImages.length === imageFiles.length) {
            setUploadImages((prev) => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    
    setUploadImageFiles((prev) => [...prev, ...imageFiles]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    uploadImageFiles.forEach((item) => {
      formData.append("files", item);
    });

    try {
      const response = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("서버 응답:", response.data);
    } catch (error) {
      console.error("업로드 실패:", error);
    }
  };

  return (
    <>
      <UploadArea ref={uploadAreaRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleImageDrop}
        >
        <div ref={uploadAreaRef} className="image-drop">
          {uploadImages.map((src, index) => (
            <img key={index} src={src} alt={`Dropped ${index}`} />
          ))}
        </div>
      </UploadArea>
    </>
  );
}

// upload-area
const UploadArea = styled.div`
  width: 400px;
  height: 300px;
  border: 2px dashed #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  text-align: center;

  &> .image-drop {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  };

  &> .image-drop > img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin: 5px;
    border-radius: 8px;
  };
`;

export default UploadImages;
