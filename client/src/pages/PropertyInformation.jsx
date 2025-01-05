import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  handleCreatePropertyInforamtionAPi,
  imageUpload,
  getAllPropertyInformationApi,
  deletePropertyInformationApi, // Import the delete API function
} from "../services/operation/function";
import GetPropertyInformation from "../components/GetPropertyInfromation";

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
      numberOfunits,
      categoryId: id,
    };

    const success = await handleCreatePropertyInforamtionAPi(propertyData);

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

  return (
    <div className="p-6 min-h-screen">
      <div className="property-page flex flex-col items-center mb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          <button
            onClick={() => navigate("/")}
            // className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            className="button-85"
          >
            Go to Home
          </button>
          <button
            // className={`${
            //   showForm ? "bg-red-500" : "bg-blue-500"
            // } text-white px-6 py-2 rounded-lg hover:opacity-90`}
            className="button-85"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Property Information"}
          </button>
          <button
            onClick={() => window.print()}
            // className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            className="button-85"
          >
            Print Property
          </button>
        </div>

        {showForm && (
          <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl">
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

            <Dropzone onDrop={uploadImage}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed p-4 text-center cursor-pointer mb-4"
                >
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              )}
            </Dropzone>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {images.map((image) => (
                <div key={image.public_id} className="relative">
                  <img
                    src={image.url}
                    alt="Uploaded"
                    className="h-24 w-full object-cover"
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
            <br />

            <div className="flex justify-center items-center">
              <button
                onClick={handleSubmit}
                // className="bg-green-500 text-white px-6 py-2 rounded-lg w-full hover:bg-green-600"
                className="button-85"
              >
                Create Property Information
              </button>
            </div>
          </div>
        )}
      </div>

      <GetPropertyInformation
        propertyData={propertyData}
        loading={loading}
        onDelete={handleDelete} // Pass the delete function
      />
    </div>
  );
};

export default PropertyInformation;
