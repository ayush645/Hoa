import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import ImageUploaderWithCrop from "./common/ImageUpload";
import Dropzone from "react-dropzone";
import { handleUpdatePropertyInforamtionAPi, imageUpload } from "../services/operation/function";
import axios from "axios";

const GetPropertyInformation = ({ propertyData, loading, onDelete }) => {
  const [pName, setPName] = useState("");
  const [pAddress, setPAddress] = useState("");
  const [pLocation, setPLocation] = useState("");
  const [ownerTitle, setOwnerTitle] = useState("");
  const [numberOfunits, setNumberOfUnits] = useState("");
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imageData, setImageData] = useState({ publicId: "", url: "" }); // State to store only public_id and url
  const [selectedImage, setSelectedImage] = useState(null); // Base64 image data

  const[selectId,setSelectId] = useState(null)

  // Upload Images
  const uploadImage = async (acceptedFiles) => {
    const response = await imageUpload(acceptedFiles);
    const uploadedImages = response?.map((image) => ({
      public_id: image.asset_id,
      url: image.url,
    }));
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  const removeImage = (publicId) => {
    const updatedImages = images.filter(
      (image) => image.public_id !== publicId
    );
    setImages(updatedImages);
  };

  // Create Property Information
  const handleSubmit = async () => {
    const propertyData = {
      pName,
      pAddress,
      pLocation,
      ownerTitle,
      images: JSON.stringify(images),
      logo: imageData,
      numberOfunits,
      };

    const success = await handleUpdatePropertyInforamtionAPi(propertyData,selectId);

    if (success) {
      // setPName("");
      // setPAddress("");
      // setPLocation("");
      // setOwnerTitle("");
      // setNumberOfUnits("");
      // setImages([]);
      // setShowForm(false);
    }
  };


  const editForm = async (id) => {
    setShowForm(true)
    setSelectId(id)
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/propertyinformation/get/${id}`);
      if (response.data?.success) {
        const property = response.data?.property;
        setPName(property.pName);
        setPAddress(property.pAddress);
        setPLocation(property.pLocation);
        setOwnerTitle(property.ownerTitle);
        setNumberOfUnits(property.numberOfunits);
        setImages(property.images);
        setImageData(property.logo); // Assuming logo is part of the response
      }
    } catch (error) {
      console.log(error);
    }
  };



  if (loading) {
    return (
      <p className="text-center text-gray-500 text-lg font-semibold">
        Loading property information...
      </p>
    );
  }

  if (propertyData.length === 0) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        No property information found.
      </p>
    );
  }

  return (
    <div className="property-info-container px-6 py-12 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        Property Information
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {propertyData.map((property) => (
          <div
            key={property._id}
            className="property-card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Header Section */}
            <div className="flex justify-between items-center p-4 bg-blue-50 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={property.logo.url}
                  alt="Property Logo"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-700">
                  {property.pName}
                </h3>
              </div>
              <button
                 onClick={() => editForm(property._id)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
                title="Delete Property"
              >
                <CiEdit size={16} />
              </button>
            </div>

            {/* Property Details */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600">
                <strong>Address:</strong> {property.pAddress}
              </p>
              <p className="text-gray-600">
                <strong>Ownership Title:</strong> {property.ownerTitle}
              </p>
              <p className="text-gray-600">
                <strong>Number of Units:</strong> {property.numberOfunits}
              </p>
            </div>

            {/* Images and Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 pb-6">
              {property.images.length > 0 && (
                <div>
                  <h4 className="text-center text-blue-600 mb-2 font-medium">
                    Property Images
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Property Image ${index + 1}`}
                        className="w-full object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {property.pLocation && (
                <div>
                  <h4 className="text-center text-blue-600 mb-2 font-medium">
                    Location Map
                  </h4>
                  <iframe
                    src={property.pLocation}
                    className="w-full h-64 rounded-lg shadow-sm border"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Property Location"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">
              {/* Close Button */}
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close Form"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>

              {/* Form Title */}
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Create Property Information
              </h2>

              {/* Form Fields */}
              <input
                type="text"
                placeholder="Enter property name"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                className="border p-2 w-full mb-4 rounded-lg"
              />
              <input
                type="text"
                placeholder="Enter property address"
                value={pAddress}
                onChange={(e) => setPAddress(e.target.value)}
                className="border p-2 w-full mb-4 rounded-lg"
              />
              <input
                type="text"
                placeholder="Enter property location"
                value={pLocation}
                onChange={(e) => setPLocation(e.target.value)}
                className="border p-2 w-full mb-4 rounded-lg"
              />
              <input
                type="text"
                placeholder="Enter ownership title"
                value={ownerTitle}
                onChange={(e) => setOwnerTitle(e.target.value)}
                className="border p-2 w-full mb-4 rounded-lg"
              />
              <input
                type="number"
                placeholder="Enter number of units"
                value={numberOfunits}
                onChange={(e) => setNumberOfUnits(e.target.value)}
                className="border p-2 w-full mb-4 rounded-lg"
              />

              {/* Dropzone for File Upload */}
              <Dropzone onDrop={uploadImage}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed p-4 text-center cursor-pointer mb-4"
                  >
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                )}
              </Dropzone>

              {/* Display Uploaded Images */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {images.map((image) => (
                  <div key={image.public_id} className="relative">
                    <img
                      src={image.url}
                      alt="Uploaded"
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(image.public_id)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              {/* Image Uploader with Crop */}
              <ImageUploaderWithCrop
                setImageData={setImageData}
                setSelectedImage={setSelectedImage}
                selectedImage={selectedImage}
              />

              {/* Submit Button */}
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-700"
                >
                  Create Property Information
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default GetPropertyInformation;
