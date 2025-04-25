import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const MagazineForm = () => {
  const { id } = useParams(); // Get ID for editing
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    author: "",
    category: "",
    title: "",
    subtitle: "",
    mainimage: null,
    bodytext: "",
    time: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const quillRef = useRef(null);

  const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://backend-5kh4.onrender.com"
    : "http://localhost:5001";
  

  // Fetch existing article data
  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/magazineDetail/${id}`);
          const data = response.data;
          setFormData({
            author: data.author || "",
            category: data.category || "",
            title: data.title || "",
            subtitle: data.subtitle || "",
            mainimage: null, // File input starts empty
            bodytext: data.content || "",
            time: data.time ? new Date(data.time).toISOString().slice(0, 16) : "",
          });
        } catch (error) {
          console.error("Error fetching article:", error);
          setError("Failed to load article data.");
        }
      };
      fetchArticle();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, mainimage: e.target.files[0] }));
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, bodytext: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate required fields
    if (!formData.author || !formData.title || !formData.time || !formData.bodytext || !formData.category) {
      setError("Author, Title, Time, Body Text, and Category are required.");
      return;
    }

    // Prepare form data
    const submitData = new FormData();
    submitData.append("author", formData.author);
    submitData.append("title", formData.title);
    submitData.append("subtitle", formData.subtitle);
    submitData.append("time", formData.time);
    submitData.append("content", formData.bodytext);
    submitData.append("category", formData.category);
    if (formData.mainimage) {
      submitData.append("mainImage", formData.mainimage);
    }

    try {
      let response;
      if (id) {
        // Update existing article
        response = await axios.put(`${BASE_URL}/api/magazineDetail/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Article updated successfully!");
        navigate("/dashboard/magazine");
      } else {
        // Create new article
        response = await axios.post(`${BASE_URL}/api/magazineDetail`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Article submitted successfully!");
        setFormData({
          author: "",
          category: "",
          title: "",
          subtitle: "",
          mainimage: null,
          bodytext: "",
          time: "",
        });
        document.querySelector('input[type="file"]').value = "";
      }
    } catch (error) {
      console.error("Error submitting article:", error);
      setError(
        error.response?.data?.message || "Failed to submit article. Please try again."
      );
    }
  };

  // Custom bold handler for Quill (unchanged)
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.getModule("toolbar").addHandler("bold", customBoldHandler);
    }
  }, []);

  const customBoldHandler = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.format("bold", !quill.getFormat().bold);
    }
  };

  return (
    <div className="w-full p-4 md:p-20 mb-8 font-inter">
      <div className="bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {id ? "Edit Article" : "Add New Article"}
        </h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <label className="block font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border outline-none"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="THE MANSION GUIDE">THE MANSION GUIDE</option>
              <option value="THE PENTHOUSE GUIDE">THE PENTHOUSE GUIDE</option>
              <option value="THE LIFESTYLE GUIDE">THE LIFESTYLE GUIDE</option>
              <option value="DEVELOPMENTS">DEVELOPMENTS</option>
              <option value="NEWSROOM">NEWSROOM</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
            {[
              { label: "Author", name: "author", type: "text" },
              { label: "Title", name: "title", type: "text" },
              { label: "Sub-Title", name: "subtitle", type: "text" },
              { label: "Time", name: "time", type: "datetime-local" },
              { label: "Main Image", name: "mainimage", type: "file" },
            ].map((field) => (
              <div key={field.label} className="w-full">
                <label className="block font-semibold mb-2">{field.label}</label>
                {field.type === "file" ? (
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleImageChange}
                    className="w-full p-2 border outline-none"
                    accept="image/*"
                    required={!id} // Required only for new articles
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border outline-none"
                    placeholder={`Enter ${field.label}`}
                    required={field.name !== "subtitle"}
                  />
                )}
              </div>
            ))}
            <div className="w-full md:col-span-2">
              <label className="block font-semibold mb-1">Body Text</label>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.bodytext}
                onChange={handleQuillChange}
                modules={{
                  toolbar: {
                    container: [
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                    ],
                  },
                }}
              />
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
            >
              {id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MagazineForm;