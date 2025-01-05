import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Swal from "sweetalert2";
import axios from "axios";

const ImageUploaderWithCrop = ({ setImageData, selectedImage, setSelectedImage }) => {
  const [cropper, setCropper] = useState(null);

  const handlePhotoFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please select a valid image file.",
      });
    }
  };

  const handleUpload = async () => {
    if (!cropper) {
      Swal.fire({
        icon: "error",
        title: "Crop Required",
        text: "Please crop the image before uploading.",
      });
      return;
    }

    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) return;

    const croppedBlob = await new Promise((resolve) => {
      croppedCanvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });

    const formData = new FormData();
    formData.append("thumbnail", croppedBlob);

    Swal.fire({
      title: "Uploading...",
      text: "Please wait while the image is being uploaded.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Swal.close();

      if (response.data.success) {
        const { public_id, url } = response.data.thumbnailImage;
        setImageData({ publicId: public_id, url });
        Swal.fire({
          icon: "success",
          title: "Uploaded",
          text: "Image uploaded successfully!",
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload the image. Please try again later.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200"
      >
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handlePhotoFileSelect}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <span className="mt-2 text-sm text-gray-500">Upload Your Company Logo</span>
      </label>

      {selectedImage && (
        <div className="mt-6">
          <Cropper
            src={selectedImage}
            style={{ height: 400, width: "100%" }}
            aspectRatio={0}
            guides={false}
            viewMode={3}
            dragMode="move"
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            wheelZoom={true}
            zoomable={true}
            minCropBoxWidth={50}
            minCropBoxHeight={50}
            toggleDragModeOnDblclick={false}
            onInitialized={(instance) => setCropper(instance)}
          />
          <button
            onClick={handleUpload}
            className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploaderWithCrop;
