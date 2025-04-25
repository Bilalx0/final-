import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CollectibleForm = () => {
  const { reference } = useParams(); // Get reference from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reference: "",
    category: "",
    title: "",
    subTitle: "",
    price: "",
    description: "",
    videoLink: "",
    agentName: "",
    designation: "",
    contactNo: "",
    email: "",
    whatsappNo: "",
    callNo: "",
  });
  const [images, setImages] = useState([]); // New images to upload
  const [existingImages, setExistingImages] = useState([]); // Existing image URLs
  const [agentImage, setAgentImage] = useState(null); // Agent profile image
  const [collectibleId, setCollectibleId] = useState(null); // MongoDB _id
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-5kh4.onrender.com"
      : "http://localhost:5001";

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_IMAGE_COUNT = 10;
  const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  // Fetch existing data for editing
  useEffect(() => {
    if (reference) {
      const fetchCollectible = async () => {
        setFetchLoading(true);
        setSubmitError("");
        try {
          const response = await axios.get(`${BASE_URL}/api/luxury-collectibles/${reference}`, {
            timeout: 30000,
          });
          const data = response.data;
          console.log("Fetched collectible:", data);

          if (!data || typeof data !== "object") {
            throw new Error("Invalid response data from server.");
          }

          setCollectibleId(data._id || null);
          setFormData({
            reference: data.reference || "",
            category: data.category || "",
            title: data.title || "",
            subTitle: data.subTitle || "",
            price: data.price || "",
            description: data.description || "",
            videoLink: data.videoLink || "",
            agentName: data.agentName || "",
            designation: data.designation || "",
            contactNo: data.contactNo || "",
            email: data.email || "",
            whatsappNo: data.whatsappNo || "",
            callNo: data.callNo || "",
          });
          setExistingImages(data.images || []);
        } catch (err) {
          console.error("Error fetching collectible:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          const errorMessage =
            err.response?.status === 404
              ? "Collectible not found."
              : err.response?.data?.message || err.message || "Failed to load collectible data.";
          setSubmitError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setFetchLoading(false);
        }
      };
      fetchCollectible();
    }
  }, [reference]);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`Compressed file ${file.name}:`, compressedFile);
      return compressedFile;
    } catch (err) {
      console.error(`Image compression error for ${file.name}:`, err);
      toast.error(`Failed to compress image ${file.name}: ${err.message}`);
      return null;
    }
  };

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files) {
      if (name === "images") {
        const newFiles = Array.from(files);
        console.log("Selected images:", newFiles);

        // Validate total image count
        if (images.length + existingImages.length + newFiles.length > MAX_IMAGE_COUNT) {
          setSubmitError(`Cannot upload more than ${MAX_IMAGE_COUNT} images.`);
          toast.error(`Cannot upload more than ${MAX_IMAGE_COUNT} images.`);
          return;
        }

        // Validate file types and sizes
        const invalidFiles = newFiles.filter(
          (file) => !SUPPORTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
        );
        if (invalidFiles.length > 0) {
          const errorMessages = invalidFiles.map((file) => {
            if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
              return `File ${file.name} is not a supported image type.`;
            }
            return `File ${file.name} exceeds 5MB limit.`;
          });
          setSubmitError(errorMessages.join(" "));
          toast.error(errorMessages.join(" "));
          return;
        }

        // Compress images
        const compressedImages = await Promise.all(
          newFiles.map(async (file) => {
            const compressedFile = await compressImage(file);
            return compressedFile;
          })
        );
        const validImages = compressedImages.filter((img) => img !== null);
        setImages((prev) => [...prev, ...validImages]);
        setSubmitError("");
      } else if (name === "agentImage") {
        const file = files[0];
        if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
          setSubmitError(`Agent image ${file.name} is not a supported type.`);
          toast.error(`Agent image ${file.name} is not a supported type.`);
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          setSubmitError(`Agent image ${file.name} exceeds 5MB limit.`);
          toast.error(`Agent image ${file.name} exceeds 5MB limit.`);
          return;
        }
        const compressedFile = await compressImage(file);
        if (compressedFile) {
          setAgentImage(compressedFile);
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    // Validate required fields
    const requiredFields = [
      "reference",
      "category",
      "title",
      "price",
      "description",
      "agentName",
      "contactNo",
      "email",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]?.trim());
    if (missingFields.length > 0) {
      const errorMessage = `Please fill all required fields: ${missingFields.join(", ")}`;
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      // Append all form data fields, converting to strings
      Object.keys(formData).forEach((key) => {
        const value = formData[key] !== null && formData[key] !== undefined ? formData[key].toString() : "";
        formDataToSend.append(key, value);
      });

      // Append new images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Append existing image URLs
      if (existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      // Append agent image
      if (agentImage) {
        formDataToSend.append("agentImage", agentImage);
      }

      // Debug: Log form data
      console.log("Sending form data:", Object.fromEntries(formDataToSend));

      let response;
      if (collectibleId) {
        // Update existing collectible
        response = await axios.put(
          `${BASE_URL}/api/luxury-collectibles/${collectibleId}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 60000,
          }
        );
      } else {
        // Create new collectible
        response = await axios.post(`${BASE_URL}/api/luxury-collectibles`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        });
      }

      console.log("Submission successful:", response.data);
      setSubmitSuccess(true);
      toast.success(`Collectible ${collectibleId ? "updated" : "submitted"} successfully!`);

      if (!collectibleId) {
        setFormData({
          reference: "",
          category: "",
          title: "",
          subTitle: "",
          price: "",
          description: "",
          videoLink: "",
          agentName: "",
          designation: "",
          contactNo: "",
          email: "",
          whatsappNo: "",
          callNo: "",
        });
        setImages([]);
        setExistingImages([]);
        setAgentImage(null);
        document.querySelectorAll('input[type="file"]').forEach((input) => (input.value = ""));
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Submission error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to submit collectible.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!collectibleId) return;
    if (!window.confirm("Are you sure you want to delete this collectible?")) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await axios.delete(`${BASE_URL}/api/luxury-collectibles/${collectibleId}`);
      setSubmitSuccess(true);
      toast.success("Collectible deleted successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Error deleting collectible:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete collectible.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-20 mb-8 font-inter">
      {fetchLoading && (
        <div className="mb-6 p-4 bg-gray-100 text-gray-700">Loading collectible data...</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {collectibleId ? "Edit Collectible" : "Add New Collectible"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Reference", name: "reference" },
              { label: "Category", name: "category" },
              { label: "Title", name: "title" },
              { label: "Sub Title", name: "subTitle" },
              { label: "Price", name: "price", type: "number" },
            ].map(({ label, name, type = "text" }) => (
              <div key={label} className="form-group">
                <label className="block text-gray-700 mb-2">
                  {label}
                  {["Reference", "Category", "Title", "Price"].includes(label) && "*"}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                  placeholder={`Enter ${label}`}
                  required={["Reference", "Category", "Title", "Price"].includes(label)}
                  min={label === "Price" ? "1" : undefined}
                  disabled={fetchLoading || isSubmitting}
                />
              </div>
            ))}
            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 mb-2">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                placeholder="Enter Description"
                rows="4"
                required
                disabled={fetchLoading || isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">
                Images (Max {MAX_IMAGE_COUNT})
              </label>
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Existing Images:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Collectible ${index}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          disabled={fetchLoading || isSubmitting}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input
                type="file"
                name="images"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp"
                disabled={fetchLoading || isSubmitting}
              />
              {images.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Selected new images:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          disabled={fetchLoading || isSubmitting}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Video Link</label>
              <input
                type="url"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                placeholder="Enter Video Link"
                disabled={fetchLoading || isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Agent Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Agent Name", name: "agentName", type: "text" },
              { label: "Designation", name: "designation", type: "text" },
              { label: "Contact No", name: "contactNo", type: "tel" },
              { label: "Email", name: "email", type: "email" },
              { label: "WhatsApp No", name: "whatsappNo", type: "tel" },
              { label: "Call No", name: "callNo", type: "tel" },
            ].map(({ label, name, type }) => (
              <div key={label} className="form-group">
                <label className="block text-gray-700 mb-2">
                  {label}
                  {["Agent Name", "Contact No", "Email"].includes(label) && "*"}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                  placeholder={`Enter ${label}`}
                  required={["Agent Name", "Contact No", "Email"].includes(label)}
                  disabled={fetchLoading || isSubmitting}
                />
              </div>
            ))}
            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 mb-2">Agent Profile Image</label>
              <input
                type="file"
                name="agentImage"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                accept="image/jpeg,image/png,image/gif,image/webp"
                disabled={fetchLoading || isSubmitting}
              />
              {agentImage && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(agentImage)}
                    alt="Agent Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700">
            Collectible {collectibleId ? "updated" : "submitted"} successfully!
          </div>
        )}
        {submitError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700">{submitError}</div>
        )}

        <div className="flex justify-between items-center">
          {collectibleId && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting || fetchLoading}
              className={`px-6 py-3 text-white bg-red-500 hover:bg-red-600 transition-all duration-300 ${
                isSubmitting || fetchLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Deleting..." : "Delete Collectible"}
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || fetchLoading}
            className={`px-6 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300 ${
              isSubmitting || fetchLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : collectibleId ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectibleForm;