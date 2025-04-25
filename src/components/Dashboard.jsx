import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assests/TMM-LANDING PAGE 1.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = ({
  viewType,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 5,
  onPageChange = () => {},
}) => {
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]); // For mansions, penthouses
  const [luxuryCollectibles, setLuxuryCollectibles] = useState([]); // For luxury collectibles
  const [magazineDetails, setMagazineDetails] = useState([]);
  const navigate = useNavigate();

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-5kh4.onrender.com"
      : "http://localhost:5001";

  // Format date consistently across tables
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle row click
  const handleRowClick = (item) => {
    console.log("Selected item:", item);
  };

  // Generic delete handler
  const handleDelete = async (id, type, endpoint) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}${endpoint}/${id}`);
      toast.success(`${type} deleted successfully`);

      if (type === "Inquiry") {
        setInquiries(inquiries.filter((item) => item._id !== id));
      } else if (type === "Newsletter") {
        setProperties(properties.filter((item) => item.id !== id));
      } else if (type === "Magazine Article") {
        setMagazineDetails(magazineDetails.filter((item) => item.id !== id));
      } else if (type === "Luxury Collectible") {
        setLuxuryCollectibles(luxuryCollectibles.filter((item) => item.id !== id));
      } else if (["Mansion", "Penthouse"].includes(type)) {
        setProperties(properties.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(
        `Failed to delete ${type}: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = (e, id, type) => {
    e.stopPropagation();
    if (type === "Magazine Article") {
      navigate(`/magazineform/${id}`);
    } else if (type === "Luxury Collectible") {
      navigate(`/collectiblesform/${id}`);
    } else if (["Mansion", "Penthouse"].includes(type)) {
      navigate(`/mansionform/${id}`);
    }
  };

  // Handle add click
  const handleAddClick = (type) => {
    console.log(`Add new ${type}`);
  };

  // Filtering logic for inquiries (leads)
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(inquiry.createdAt).toDateString() ===
        selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  // Pagination for inquiries
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = filteredInquiries.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const calculatedTotalPages = Math.ceil(
    filteredInquiries.length / itemsPerPage
  );

  // Filtering logic for properties (mansions, penthouses)
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      viewType === "property"
        ? property.email?.toLowerCase().includes(searchTerm.toLowerCase())
        : property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || property.category === filterCategory;
    const matchesDate =
      !selectedDate ||
      new Date(property.createdAt || property.createdTime).toDateString() ===
        selectedDate.toDateString();
    return (
      matchesSearch &&
      (viewType === "property" ? matchesCategory && matchesDate : matchesDate)
    );
  });

  // Filtering logic for luxury collectibles
  const filteredLuxuryCollectibles = luxuryCollectibles.filter((collectible) => {
    const matchesSearch =
      collectible.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collectible.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(collectible.createdAt).toDateString() ===
        selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  // Filtering logic for magazine details
  const filteredMagazineDetails = magazineDetails.filter((magazine) => {
    const matchesSearch =
      magazine.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magazine.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(magazine.time).toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  // Fetch inquiries for leads view
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/inquiries`);
        setInquiries(response.data);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        setError(error.message);
      }
    };

    if (viewType === "leads") {
      fetchInquiries();
    }
  }, [viewType, BASE_URL]);

  // Fetch newsletter for property view
  useEffect(() => {
    const fetchNewsletter = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/newsletter`);
        const transformedData = response.data.map((item) => ({
          id: item._id,
          email: item.email || "N/A",
          category: item.category || "Unknown",
          createdTime: item.createdAt || new Date().toISOString(),
        }));
        setProperties(transformedData);
      } catch (error) {
        console.error("Error fetching newsletter:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === "property") {
      fetchNewsletter();
    }
  }, [viewType, BASE_URL]);

  // Fetch properties for mansions, penthouses
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/properties`);
        const data = response.data;

        const transformedData = data
          .filter((item) => {
            if (viewType === "mansions") return item.propertytype === "Mansion";
            if (viewType === "penthouses")
              return item.propertytype === "Penthouse";
            return false;
          })
          .map((item) => ({
            id: item._id,
            reference: item.reference || "N/A",
            title: item.title || "N/A",
            email: item.email || "N/A",
            category: item.propertytype || "Unknown",
            location: item.propertyaddress || item.community || "N/A",
            price: item.price || "N/A",
            createdAt: item.createdAt || new Date().toISOString(),
          }));

        setProperties(transformedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (["mansions", "penthouses"].includes(viewType)) {
      fetchProperties();
    }
  }, [viewType, BASE_URL]);

  // Fetch luxury collectibles
  useEffect(() => {
    const fetchLuxuryCollectibles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/luxury-collectibles`);
        const transformedData = response.data.map((item) => ({
          id: item._id,
          reference: item.reference || "N/A",
          title: item.title || "N/A",
          category: item.category || "Unknown",
          price: item.price || "N/A",
          createdAt: item.createdAt || new Date().toISOString(),
        }));
        setLuxuryCollectibles(transformedData);
      } catch (error) {
        console.error("Error fetching luxury collectibles:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === "luxurycollectibles") {
      fetchLuxuryCollectibles();
    }
  }, [viewType, BASE_URL]);

  // Fetch magazine details
  useEffect(() => {
    const fetchMagazineDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/magazineDetails`);
        const transformedData = response.data.map((item) => ({
          id: item._id,
          author: item.author || "N/A",
          title: item.title || "N/A",
          subtitle: item.subtitle || "N/A",
          time: item.time || item.createdAt || new Date().toISOString(),
          mainImage: item.mainImage || null,
          content: item.content || "N/A",
        }));
        setMagazineDetails(transformedData);
      } catch (error) {
        console.error("Error fetching magazine details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (viewType === "magazine") {
      fetchMagazineDetails();
    }
  }, [viewType, BASE_URL]);

  return (
    <div className="flex-1 bg-[#F9F9F8]">
      <ToastContainer />
      <div className="flex bg-[#F9F9F8] pr-4 flex-col sm:flex-row justify-end py-6">
        <img src={logo} className="w-[400px]" alt="logo" />
      </div>
      <div className="p-6">
        {viewType === "leads" ? (
          // Leads section (unchanged)
          <div className="overflow-x-auto font-inter">
            <div className="flex justify-between items-center mb-2">
              <h2>All Leads</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by Email, Name, or Reference"
                  className="flex-1 px-4 py-2 text-gray-700 focus:outline-none border border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-[#00603A] px-4 py-[10px] text-white hover:text-[#00603A] border border-[#00603A] hover:bg-transparent transition">
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
              <h2 className="text-base font-inter">Leads</h2>
              <div className="flex gap-2">
                <button className="bg-white text-[#00603A] px-3 py-1 hover:bg-gray-200">
                  Import
                </button>
                <button className="bg-white text-[#00603A] px-3 py-1 hover:bg-gray-200">
                  Export
                </button>
              </div>
            </div>
            <table className="min-w-full border text-sm font-inter">
              <thead>
                <tr className="bg-[#BAD4CA]">
                  <th className="py-2 px-2 border">Reference no</th>
                  <th className="py-2 px-2 border">First Name</th>
                  <th className="py-2 px-2 border">Last Name</th>
                  <th className="py-2 px-2 border">Email</th>
                  <th className="py-2 px-2 border">Phone</th>
                  <th className="py-2 px-2 border">
                    Created Time
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      customInput={
                        <button className="px-2 py-1 cursor-pointer">
                          {selectedDate ? formatDate(selectedDate) : ""} 🔽
                        </button>
                      }
                    />
                  </th>
                  <th className="py-2 px-2 border">Message</th>
                  <th className="py-2 px-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-2 px-2 border text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-2 px-2 border text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : currentPosts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-2 px-2 border text-center">
                      No leads match your search
                    </td>
                  </tr>
                ) : (
                  currentPosts.map((inquiry) => (
                    <tr
                      key={inquiry._id}
                      className="hover:bg-gray-100"
                      onClick={() => handleRowClick(inquiry)}
                    >
                      <td className="py-2 border text-center">
                        {inquiry.reference || "N/A"}
                      </td>
                      <td className="py-2 px-2 border">
                        {inquiry.firstName || "NEW"}
                      </td>
                      <td className="py-2 px-2 border">
                        {inquiry.lastName || "N/A"}
                      </td>
                      <td className="py-2 border text-center">
                        {inquiry.email || "N/A"}
                      </td>
                      <td className="py-2 px-2 border">
                        {inquiry.phone || "N/A"}
                      </td>
                      <td className="py-2 px-2 border">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="py-2 px-2 border">
                        <div
                          className="max-w-[200px] truncate"
                          title={inquiry.message}
                        >
                          {inquiry.message || "N/A"}
                        </div>
                      </td>
                      <td className="py-2 px-2 border">
                        <div className="flex gap-2 justify-center">
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              handleDelete(
                                inquiry._id,
                                "Inquiry",
                                "/api/inquiries"
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {calculatedTotalPages > 1 && (
              <div className="flex justify-between mt-4">
                {currentPage > 1 && (
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="bg-gray-700 text-white px-4 py-2"
                  >
                    Previous
                  </button>
                )}
                {currentPage < calculatedTotalPages && (
                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="bg-gray-700 text-white px-4 py-2"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        ) : viewType === "property" ? (
          // Newsletter section (unchanged)
          <div className="overflow-x-auto font-inter">
            <h1 className="text-2xl mb-4">Newsletter</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 text-sm">
              <h1 className="flex flex-col text-base">
                <span>
                  Dashboard <span className="text-blue-600">/ Newsletter </span>
                </span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search By Email"
                    className="flex-1 px-4 py-2 text-gray-700 focus:outline-none border border-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="bg-[#00603A] px-4 py-[10px] text-white hover:text-[#00603A] border border-[#00603A] hover:bg-transparent transition">
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto font-inter">
              <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
                <h2 className="text-base font-inter">Newsletter List</h2>
                <div className="flex gap-2">
                  <button className="bg-white text-[#00603A] px-3 py-1 hover:bg-gray-200">
                    Export
                  </button>
                </div>
              </div>
              <table className="min-w-full border font-inter text-sm">
                <thead>
                  <tr className="bg-[#BAD4CA]">
                    <th className="py-2 px-4 border">S.NO</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">
                      <label className="px-2">Category</label>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="border py-2 rounded"
                      >
                        <option value="All">All</option>
                        <option value="Newsletter">Newsletter</option>
                        <option value="Magazine">Magazine</option>
                      </select>
                    </th>
                    <th className="py-2 px-4 border">
                      <label className="px-2">Created Time</label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        customInput={
                          <button className="border px-2 py-1 rounded bg-white shadow-sm cursor-pointer">
                            {selectedDate
                              ? formatDate(selectedDate)
                              : "Select Time"}{" "}
                            🔽
                          </button>
                        }
                      />
                    </th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-2 px-2 border text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-2 px-2 border text-center text-red-600"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-2 px-2 border text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((property, index) => (
                      <tr
                        key={property.id}
                        className={`hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                        onClick={() => handleRowClick(property)}
                      >
                        <td className="py-2 px-2 border">{index + 1}</td>
                        <td className="py-2 px-2 border">{property.email}</td>
                        <td className="py-2 px-2 border">
                          {property.category}
                        </td>
                        <td className="py-2 px-2 border">
                          {formatDate(property.createdTime)}
                        </td>
                        <td className="py-2 px-2 border">
                          <div className="flex gap-2 justify-center">
                            <FaTrash
                              className="text-red-600 cursor-pointer"
                              onClick={() =>
                                handleDelete(
                                  property.id,
                                  "Newsletter",
                                  "/api/newsletter"
                                )
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewType === "mansions" ? (
          // Mansions section
          <div className="overflow-x-auto font-inter">
            <h1 className="text-2xl mb-4">Mansion Listings</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 text-sm">
              <h1 className="flex flex-col text-base">
                <span>
                  Dashboard <span className="text-blue-600">/ Mansions </span>
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <Link to="/mansionform">
                  <button
                    className="bg-white text-[#00603A] px-3 py-[10px] hover:bg-gray-200"
                    onClick={() => handleAddClick("mansion")}
                    title="Add New Mansion"
                  >
                    <FaPlus />
                  </button>
                </Link>
                <input
                  type="text"
                  placeholder="Search by Title or Reference"
                  className="flex-1 px-4 py-2 text-gray-700 focus:outline-none border border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-[#00603A] px-4 py-[10px] text-white hover:text-[#00603A] border border-[#00603A] hover:bg-transparent transition">
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto font-inter">
              <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
                <h2 className="text-base font-inter">Mansion Listings</h2>
                <div className="flex gap-2">
                  <button className="bg-white text-[#00603A] px-3 py-1 hover:bg-gray-200">
                    Export
                  </button>
                </div>
              </div>
              <table className="min-w-full border font-inter text-sm">
                <thead>
                  <tr className="bg-[#BAD4CA]">
                    <th className="py-2 px-4 border">Ref no.</th>
                    <th className="py-2 px-4 border">Title</th>
                    <th className="py-2 px-4 border">Location</th>
                    <th className="py-2 px-4 border">Price</th>
                    <th className="py-2 px-4 border">Created Time</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-2 px-2 border text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-2 px-2 border text-center text-red-600"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-2 px-2 border text-center">
                        No mansion listings available
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((property, index) => (
                      <tr
                        key={property.id}
                        className={`hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                        onClick={() => handleRowClick(property)}
                      >
                        <td className="py-2 px-2 border">
                          {property.reference}
                        </td>
                        <td className="py-2 px-2 border">{property.title}</td>
                        <td className="py-2 px-2 border">
                          {property.location}
                        </td>
                        <td className="py-2 px-2 border">{property.price}</td>
                        <td className="py-2 px-2 border">
                          {formatDate(property.createdAt)}
                        </td>
                        <td className="py-2 px-2 border">
                          <div className="flex gap-2 justify-center">
                            <FaEdit
                              className="text-green-600 cursor-pointer"
                              onClick={(e) =>
                                handleEditClick(e, property.id, "Mansion")
                              }
                            />
                            <FaTrash
                              className="text-red-600 cursor-pointer"
                              onClick={() =>
                                handleDelete(
                                  property.id,
                                  "Mansion",
                                  "/api/properties" // Fixed endpoint
                                )
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewType === "penthouses" ? (
          // Penthouses section
          <div className="overflow-x-auto font-inter">
            <h1 className="text-2xl mb-4">Penthouse Listings</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 text-sm">
              <h1 className="flex flex-col text-base">
                <span>
                  Dashboard <span className="text-blue-600">/ Penthouses </span>
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <Link to="/mansionform">
                  <button
                    className="bg-white text-[#00603A] px-3 py-[10px] hover:bg-gray-200"
                    onClick={() => handleAddClick("penthouse")}
                    title="Add New Penthouse"
                  >
                    <FaPlus />
                  </button>
                </Link>
                <input
                  type="text"
                  placeholder="Search by Title or Reference"
                  className="flex-1 px-4 py-2 text-gray-700 focus:outline-none border border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-[#00603A] px-4 py-[10px] text-white hover:text-[#00603A] border border-[#00603A] hover:bg-transparent transition">
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto font-inter">
              <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
                <h2 className="text-base font-inter">Penthouse Listings</h2>
                <div className="flex gap-2">
                  <button className="bg-white text-[#00603A] px-3 py-1 hover:bg-gray-200">
                    Export
                  </button>
                </div>
              </div>
              <table className="min-w-full border font-inter text-sm">
                <thead>
                  <tr className="bg-[#BAD4CA]">
                    <th className="py-2 px-4 border">Ref no.</th>
                    <th className="py-2 px-4 border">Title</th>
                    <th className="py-2 px-4 border">Location</th>
                    <th className="py-2 px-4 border">Price</th>
                    <th className="py-2 px-4 border">Created Time</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-2 px-2 border text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-2 px-2 border text-center text-red-600"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-2 px-2 border text-center">
                        No penthouse listings available
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((property, index) => (
                      <tr
                        key={property.id}
                        className={`hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                        onClick={() => handleRowClick(property)}
                      >
                        <td className="py-2 px-2 border">
                          {property.reference}
                        </td>
                        <td className="py-2 px-2 border">{property.title}</td>
                        <td className="py-2 px-2 border">
                          {property.location}
                        </td>
                        <td className="py-2 px-2 border">{property.price}</td>
                        <td className="py-2 px-2 border">
                          {formatDate(property.createdAt)}
                        </td>
                        <td className="py-2 px-2 border">
                          <div className="flex gap-2 justify-center">
                            <FaEdit
                              className="text-green-600 cursor-pointer"
                              onClick={(e) =>
                                handleEditClick(e, property.id, "Penthouse")
                              }
                            />
                            <FaTrash
                              className="text-red-600 cursor-pointer"
                              onClick={() =>
                                handleDelete(
                                  property.id,
                                  "Penthouse",
                                  "/api/properties" // Fixed endpoint
                                )
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewType === "luxurycollectibles" ? (
          // Luxury Collectibles section (unchanged)
          <div className="overflow-x-auto font-inter">
            <h1 className="text-2xl mb-4">Luxury Collectibles</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 text-sm">
              <h1 className="flex flex-col text-base">
                <span>
                  Dashboard{" "}
                  <span className="text-blue-600">/ Luxury Collectibles </span>
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <Link to="/collectiblesform">
                  <button
                    className="bg-white text-[#00603A] px-3 py-[10px] hover:bg-gray-200"
                    onClick={() => handleAddClick("luxury collectible")}
                    title="Add New Luxury Collectible"
                  >
                    <FaPlus />
                  </button>
                </Link>
                <input
                  type="text"
                  placeholder="Search by Title or Reference"
                  className="flex-1 px-4 py-2 text-gray-700 focus:outline-none border border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-[#00603A] px-4 py-[10px] text-white hover:text-[#00603A] border border-[#00603A] hover:bg-transparent transition">
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto font-inter">
              <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
                <h2 className="text-base font-inter">Luxury Collectibles</h2>
                <div className="flex gap-2">
                  <button className="bg-white text-[#00603A] px-3 py-1 hover:bg-gray-200">
                    Export
                  </button>
                </div>
              </div>
              <table className="min-w-full border font-inter text-sm">
                <thead>
                  <tr className="bg-[#BAD4CA]">
                    <th className="py-2 px-4 border">Ref no.</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Category</th>
                    <th className="py-2 px-4 border">Price</th>
                    <th className="py-2 px-4 border">
                      <label className="px-2">Created Time</label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        customInput={
                          <button className="border px-2 py-1 rounded bg-white shadow-sm cursor-pointer">
                            {selectedDate
                              ? formatDate(selectedDate)
                              : "Select Time"}{" "}
                            🔽
                          </button>
                        }
                      />
                    </th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-2 px-2 border text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-2 px-2 border text-center text-red-600"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : filteredLuxuryCollectibles.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-2 px-2 border text-center">
                        No luxury collectibles available
                      </td>
                    </tr>
                  ) : (
                    filteredLuxuryCollectibles.map((collectible, index) => (
                      <tr
                        key={collectible.id}
                        className={`hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                        onClick={() => handleRowClick(collectible)}
                      >
                        <td className="py-2 px-2 border">
                          {collectible.reference}
                        </td>
                        <td className="py-2 px-2 border">
                          {collectible.title}
                        </td>
                        <td className="py-2 px-2 border">
                          {collectible.category}
                        </td>
                        <td className="py-2 px-2 border">
                          {collectible.price}
                        </td>
                        <td className="py-2 px-2 border">
                          {formatDate(collectible.createdAt)}
                        </td>
                        <td className="py-2 px-2 border">
                          <div className="flex gap-2 justify-center">
                            <FaEdit
                              className="text-green-600 cursor-pointer"
                              onClick={(e) =>
                                handleEditClick(
                                  e,
                                  collectible.id,
                                  "Luxury Collectible"
                                )
                              }
                            />
                            <FaTrash
                              className="text-red-600 cursor-pointer"
                              onClick={() =>
                                handleDelete(
                                  collectible.id,
                                  "Luxury Collectible",
                                  "/api/luxury-collectibles"
                                )
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewType === "magazine" ? (
          // Magazine section
          <div className="overflow-x-auto font-inter">
            <h1 className="text-2xl mb-4">Magazine Articles</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 text-sm">
              <h1 className="flex flex-col text-base">
                <span>
                  Dashboard <span className="text-blue-600">/ Magazine </span>
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <Link to="/magazineform">
                  <button
                    className="bg-white text-[#00603A] px-3 py-[10px] hover:bg-gray-200"
                    onClick={() => handleAddClick("magazine article")}
                    title="Add New Magazine Article"
                  >
                    <FaPlus />
                  </button>
                </Link>
                <input
                  type="text"
                  placeholder="Search by Title or Author"
                  className="flex-1 px-4 py-2 text-gray-700 focus:outline-none border border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-[#00603A] px-4 py-[10px] text-white hover:text-[#00603A] border border-[#00603A] hover:bg-transparent transition">
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto font-inter">
              <div className="bg-[#00603A] text-white py-2 px-4 flex justify-between items-center">
                <h2 className="text-base font-inter">Magazine Articles</h2>
                <div className="flex gap-2">
                  <button className="bg-white text-[#00603A] px-3 py-1 hover:bg-gray-200">
                    Export
                  </button>
                </div>
              </div>
              <table className="min-w-full border font-inter text-sm">
                <thead>
                  <tr className="bg-[#BAD4CA]">
                    <th className="py-2 px-4 border">S.NO</th>
                    <th className="py-2 px-4 border">Title</th>
                    <th className="py-2 px-4 border">Author</th>
                    <th className="py-2 px-4 border">Subtitle</th>
                    <th className="py-2 px-4 border">
                      <label className="px-2">Published Time</label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        customInput={
                          <button className="border px-2 py-1 rounded bg-white shadow-sm cursor-pointer">
                            {selectedDate
                              ? formatDate(selectedDate)
                              : "Select Time"}{" "}
                            🔽
                          </button>
                        }
                      />
                    </th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-2 px-2 border text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-2 px-2 border text-center text-red-600"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : filteredMagazineDetails.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-2 px-2 border text-center">
                        No magazine articles available
                      </td>
                    </tr>
                  ) : (
                    filteredMagazineDetails.map((magazine, index) => (
                      <tr
                        key={magazine.id}
                        className={`hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                        onClick={() => handleRowClick(magazine)}
                      >
                        <td className="py-2 px-2 border">{index + 1}</td>
                        <td className="py-2 px-2 border">{magazine.title}</td>
                        <td className="py-2 px-2 border">{magazine.author}</td>
                        <td className="py-2 px-2 border">
                          <div
                            className="max-w-[200px] truncate"
                            title={magazine.subtitle}
                          >
                            {magazine.subtitle || "N/A"}
                          </div>
                        </td>
                        <td className="py-2 px-2 border">
                          {formatDate(magazine.time)}
                        </td>
                        <td className="py-2 px-2 border">
                          <div className="flex gap-2 justify-center">
                            <Link to={`/magazine/${magazine.id}`}>
                              <FaEye className="text-blue-600 cursor-pointer" />
                            </Link>
                            <FaEdit
                              className="text-green-600 cursor-pointer"
                              onClick={(e) =>
                                handleEditClick(
                                  e,
                                  magazine.id,
                                  "Magazine Article"
                                )
                              }
                            />
                            <FaTrash
                              className="text-red-600 cursor-pointer"
                              onClick={() =>
                                handleDelete(
                                  magazine.id,
                                  "Magazine Article",
                                  "/api/magazineDetail"
                                )
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl">Select a view from the sidebar</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;