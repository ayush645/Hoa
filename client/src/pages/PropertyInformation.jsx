import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  handleUpdatePropertyInforamtionAPi,
  imageUpload,
  getAllPropertyInformationApi,
  deletePropertyInformationApi, // Import the delete API function
} from "../services/operation/function";
import GetPropertyInformation from "../components/GetPropertyInfromation";
import ImageUploaderWithCrop from "../components/common/ImageUpload";
import axios from "axios";

const PropertyInformation = () => {
  const [pName, setPName] = useState("");
  const [pAddress, setPAddress] = useState("");
  const [pLocation, setPLocation] = useState("");
  const [ownerTitle, setOwnerTitle] = useState("");
  const [numberOfunits, setNumberOfUnits] = useState("");
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState({ publicId: "", url: "" }); // State to store only public_id and url
  const [selectedImage, setSelectedImage] = useState(null); // Base64 image data

  const { id } = useParams();
  const navigate = useNavigate();

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
      categoryId: id,
    };

    const success = await handleUpdatePropertyInforamtionAPi(propertyData);

    if (success) {
      setPName("");
      setPAddress("");
      setPLocation("");
      setOwnerTitle("");
      setNumberOfUnits("");
      setImages([]);
      setShowForm(false);
      fetchPropertyInformation();
    }
  };

  // Fetch Property Information
  const fetchPropertyInformation = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllPropertyInformationApi(id);
      setPropertyData(data);
    } catch (error) {
      console.error("Error fetching property information:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Property
  const handleDelete = async (propertyId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this property? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      const success = await deletePropertyInformationApi(propertyId);
      if (success) {
        fetchPropertyInformation();
      }
    }
  };


 
  useEffect(() => {
    fetchPropertyInformation();
  }, [id]);


  const handlePrint = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/print/propertyinformation/${id}`,
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link and simulate a click
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Property_Report.pdf`); // Set filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
      alert("Failed to download PDF.");
    }
  };





  const [toSuggestions, setToSuggestions] = useState([]);


  const onChangeTo = (event) => {
    const value = event.target.value;
    setPLocation(value);
    fetchSuggestions(value, setToSuggestions);
  };

  const fetchSuggestions = (value, setSuggestions) => {
    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: value }, (predictions) => {
      setSuggestions(predictions || []);
    });
  };

  const onSuggestionSelectedTo = (suggestion) => {
    setPLocation(suggestion.description);
    setToSuggestions([]);
  };
  return (
    <div className="p-6 min-h-screen">
      <div className="property-page flex flex-col items-center mb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          <button
            onClick={() => navigate("/")}
            // className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            style={{ right: "575px" }}
            className="button-85"
          >
            Go to Home
          </button>
       
          <button
            onClick={handlePrint}

            style={{ right: '510px', top: '510px' }}

            // className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            className="button-85"
          >
            Print Property
          </button>
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


<input
                    type="text"
                    placeholder="To"
                    value={pLocation}
                    onChange={onChangeTo}
                    className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-2xl"
                  />
                  <ul className="mt-2">
                    {toSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        onClick={() => onSuggestionSelectedTo(suggestion)}
                        className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-2xl"
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>

              {/* Dropzone for File Upload */}
              {/* <Dropzone onDrop={uploadImage}>
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
              </Dropzone> */}

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

      <GetPropertyInformation
        propertyData={propertyData}
        loading={loading}
        onDelete={handleDelete} // Pass the delete function
        fetchPropertyInformation={fetchPropertyInformation}
      />
    </div>
  );
};

export default PropertyInformation;
