import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePageForm = () => {
  const [heroData, setHeroData] = useState({
    _id: null,
    heading: '',
    subheading: '',
    image: null,
  });
  const [heroExistingImage, setHeroExistingImage] = useState(null);

  const [mansionData, setMansionData] = useState({
    _id: null,
    description: '',
    btntext: '',
    ref1: '',
    ref2: '',
    ref3: '',
    ref4: '',
  });

  const [penthouseData, setPenthouseData] = useState({
    _id: null,
    description: '',
    btntext: '',
    ref1: '',
    ref2: '',
    ref3: '',
    ref4: '',
  });

  const [collectiblesData, setCollectiblesData] = useState({
    _id: null,
    description: '',
    btntext: '',
    ref1: '',
    ref2: '',
    ref3: '',
    ref4: '',
  });

  const [magazineData, setMagazineData] = useState({
    _id: null,
    heading: '',
    subheading: '',
    image: null,
  });
  const [magazineExistingImage, setMagazineExistingImage] = useState(null);

  const [featuredData, setFeaturedData] = useState({
    _id: null,
    ref1: '',
    ref2: '',
    ref3: '',
    ref4: '',
  });

  const [featuredProperties, setFeaturedProperties] = useState(null);
  const [mansionFeaturedProperties, setMansionFeaturedProperties] = useState(null);
  const [penthouseFeaturedProperties, setPenthouseFeaturedProperties] = useState(null);
  const [collectiblesFeaturedProperties, setCollectiblesFeaturedProperties] = useState(null);

  const [linksData, setLinksData] = useState({
    _id: null,
    mansionText1: '',
    mansionLink1: '',
    mansionText2: '',
    mansionLink2: '',
    mansionText3: '',
    mansionLink3: '',
    mansionText4: '',
    mansionLink4: '',
    penthouseText1: '',
    penthouseLink1: '',
    penthouseText2: '',
    penthouseLink2: '',
    penthouseText3: '',
    penthouseLink3: '',
    penthouseText4: '',
    penthouseLink4: '',
  });

  const [reviewData, setReviewData] = useState({
    _id: null,
    reviewerName: '',
    company: '',
    content: '',
    isApproved: false,
  });

  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState({
    hero: '',
    featured: '',
    mansionContent: '',
    mansionReferences: '',
    penthouseContent: '',
    penthouseReferences: '',
    collectiblesContent: '',
    collectiblesReferences: '',
    magazine: '',
    links: '',
    review: '',
  });
  const [isLoading, setIsLoading] = useState({
    hero: false,
    featured: false,
    mansionContent: false,
    mansionReferences: false,
    penthouseContent: false,
    penthouseReferences: false,
    collectiblesContent: false,
    collectiblesReferences: false,
    magazine: false,
    links: false,
    review: false,
  });

  // State for valid references
  const [validReferences, setValidReferences] = useState([]);

  const BASE_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://backend-5kh4.onrender.com'
      : 'http://localhost:5001';

  // Fetch data and valid references
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch valid references
        const propertiesResponse = await axios.get(`${BASE_URL}/api/properties`);
        const references = propertiesResponse.data
          .map(property => property.reference)
          .filter(ref => ref);
        setValidReferences(references);

        // Hero
        const heroResponse = await axios.get(`${BASE_URL}/api/hero`);
        if (heroResponse.data) {
          setHeroData({
            _id: heroResponse.data._id,
            heading: heroResponse.data.heading || '',
            subheading: heroResponse.data.subheading || '',
            image: null,
          });
          setHeroExistingImage(heroResponse.data.image || null);
        }

        // Featured
        const featuredResponse = await axios.get(`${BASE_URL}/api/featured`);
        setFeaturedProperties(featuredResponse.data || null);
        if (featuredResponse.data) {
          setFeaturedData({
            _id: featuredResponse.data._id,
            ref1: featuredResponse.data.references?.[0] || '',
            ref2: featuredResponse.data.references?.[1] || '',
            ref3: featuredResponse.data.references?.[2] || '',
            ref4: featuredResponse.data.references?.[3] || '',
          });
        }

        // Mansion
        const mansionResponse = await axios.get(`${BASE_URL}/api/mansion`);
        if (mansionResponse.data) {
          setMansionData(prev => ({
            ...prev,
            _id: mansionResponse.data._id,
            description: mansionResponse.data.description || '',
            btntext: mansionResponse.data.btntext || '',
          }));
        }
        const mansionFeaturedResponse = await axios.get(
          `${BASE_URL}/api/mansion/featured`
        );
        setMansionFeaturedProperties(mansionFeaturedResponse.data || null);
        if (mansionFeaturedResponse.data) {
          setMansionData(prev => ({
            ...prev,
            ref1: mansionFeaturedResponse.data.references?.[0] || '',
            ref2: mansionFeaturedResponse.data.references?.[1] || '',
            ref3: mansionFeaturedResponse.data.references?.[2] || '',
            ref4: mansionFeaturedResponse.data.references?.[3] || '',
          }));
        }

        // Penthouse
        const penthouseResponse = await axios.get(`${BASE_URL}/api/penthouse`);
        if (penthouseResponse.data) {
          setPenthouseData(prev => ({
            ...prev,
            _id: penthouseResponse.data._id,
            description: penthouseResponse.data.description || '',
            btntext: penthouseResponse.data.btntext || '',
          }));
        }
        const penthouseFeaturedResponse = await axios.get(
          `${BASE_URL}/api/penthouse/featured`
        );
        setPenthouseFeaturedProperties(penthouseFeaturedResponse.data || null);
        if (penthouseFeaturedResponse.data) {
          setPenthouseData(prev => ({
            ...prev,
            ref1: penthouseFeaturedResponse.data.references?.[0] || '',
            ref2: penthouseFeaturedResponse.data.references?.[1] || '',
            ref3: penthouseFeaturedResponse.data.references?.[2] || '',
            ref4: penthouseFeaturedResponse.data.references?.[3] || '',
          }));
        }

        // Collectibles
        const collectiblesResponse = await axios.get(
          `${BASE_URL}/api/collectibles`
        );
        if (collectiblesResponse.data) {
          setCollectiblesData(prev => ({
            ...prev,
            _id: collectiblesResponse.data._id,
            description: collectiblesResponse.data.description || '',
            btntext: collectiblesResponse.data.btntext || '',
          }));
        }
        const collectiblesFeaturedResponse = await axios.get(
          `${BASE_URL}/api/collectibles/featured`
        );
        setCollectiblesFeaturedProperties(
          collectiblesFeaturedResponse.data || null
        );
        if (collectiblesFeaturedResponse.data) {
          setCollectiblesData(prev => ({
            ...prev,
            ref1: collectiblesFeaturedResponse.data.references?.[0] || '',
            ref2: collectiblesFeaturedResponse.data.references?.[1] || '',
            ref3: collectiblesFeaturedResponse.data.references?.[2] || '',
            ref4: collectiblesFeaturedResponse.data.references?.[3] || '',
          }));
        }

        // Magazine
        const magazineResponse = await axios.get(`${BASE_URL}/api/magazine`);
        if (magazineResponse.data) {
          setMagazineData({
            _id: magazineResponse.data._id,
            heading: magazineResponse.data.heading || '',
            subheading: magazineResponse.data.subheading || '',
            image: null,
          });
          setMagazineExistingImage(magazineResponse.data.image || null);
        }

        // Links
        const linksResponse = await axios.get(`${BASE_URL}/api/links`);
        if (linksResponse.data) {
          setLinksData({
            _id: linksResponse.data._id,
            mansionText1: linksResponse.data.mansionText1 || '',
            mansionLink1: linksResponse.data.mansionLink1 || '',
            mansionText2: linksResponse.data.mansionText2 || '',
            mansionLink2: linksResponse.data.mansionLink2 || '',
            mansionText3: linksResponse.data.mansionText3 || '',
            mansionLink3: linksResponse.data.mansionLink3 || '',
            mansionText4: linksResponse.data.mansionText4 || '',
            mansionLink4: linksResponse.data.mansionLink4 || '',
            penthouseText1: linksResponse.data.penthouseText1 || '',
            penthouseLink1: linksResponse.data.penthouseLink1 || '',
            penthouseText2: linksResponse.data.penthouseText2 || '',
            penthouseLink2: linksResponse.data.penthouseLink2 || '',
            penthouseText3: linksResponse.data.penthouseText3 || '',
            penthouseLink3: linksResponse.data.penthouseLink3 || '',
            penthouseText4: linksResponse.data.penthouseText4 || '',
            penthouseLink4: linksResponse.data.penthouseLink4 || '',
          });
        }

        // Reviews
        const reviewsResponse = await axios.get(
          `${BASE_URL}/api/reviews/admin`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessages(prev => ({
          ...prev,
          hero: 'Failed to load existing hero data.',
          featured: 'Failed to load existing featured data.',
          mansionContent: 'Failed to load existing mansion content.',
          mansionReferences: 'Failed to load existing mansion references.',
          penthouseContent: 'Failed to load existing penthouse content.',
          penthouseReferences: 'Failed to load existing penthouse references.',
          collectiblesContent: 'Failed to load existing collectibles content.',
          collectiblesReferences: 'Failed to load existing collectibles references.',
          magazine: 'Failed to load existing magazine data.',
          links: 'Failed to load existing links data.',
          review: 'Failed to load existing reviews.',
        }));
      }
    };

    fetchData();
  }, [BASE_URL]);

  const handleHeroSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, hero: true }));
    setMessages(prev => ({ ...prev, hero: '' }));

    if (
      !heroData.heading &&
      !heroData.subheading &&
      !heroData.image &&
      heroExistingImage
    ) {
      setMessages(prev => ({
        ...prev,
        hero: 'At least one field must be updated when an image exists!',
      }));
      setIsLoading(prev => ({ ...prev, hero: false }));
      return;
    }

    if (!heroData.heading && !heroData.subheading && !heroData.image) {
      setMessages(prev => ({
        ...prev,
        hero: 'At least one field is required!',
      }));
      setIsLoading(prev => ({ ...prev, hero: false }));
      return;
    }

    const formData = new FormData();
    if (heroData.heading) formData.append('heading', heroData.heading);
    if (heroData.subheading) formData.append('subheading', heroData.subheading);
    if (heroData.image) formData.append('image', heroData.image);

    try {
      let response;
      if (heroData._id) {
        response = await axios.put(
          `${BASE_URL}/api/hero/${heroData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          hero: 'Hero section updated successfully!',
        }));
      } else {
        response = await axios.post(`${BASE_URL}/api/hero`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessages(prev => ({
          ...prev,
          hero: 'Hero section saved successfully!',
        }));
      }

      setHeroData({
        _id: response.data._id,
        heading: response.data.heading || '',
        subheading: response.data.subheading || '',
        image: null,
      });
      setHeroExistingImage(response.data.image || null);
    } catch (error) {
      console.error('Error saving/updating hero section:', error);
      setMessages(prev => ({
        ...prev,
        hero:
          error.response?.data?.error || 'Failed to save/update hero section',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, hero: false }));
    }
  };

  const handleRemoveHeroImage = async () => {
    if (!heroData._id) return;

    setIsLoading(prev => ({ ...prev, hero: true }));
    setMessages(prev => ({ ...prev, hero: '' }));

    try {
      const response = await axios.put(
        `${BASE_URL}/api/hero/${heroData._id}`,
        { removeImage: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setHeroExistingImage(null);
      setHeroData(prev => ({
        ...prev,
        image: null,
      }));
      setMessages(prev => ({
        ...prev,
        hero: 'Hero image removed successfully!',
      }));
    } catch (error) {
      console.error('Error removing hero image:', error);
      setMessages(prev => ({
        ...prev,
        hero: error.response?.data?.error || 'Failed to remove hero image',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, hero: false }));
    }
  };

  const handleFeaturedSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, featured: true }));
    setMessages(prev => ({ ...prev, featured: '' }));

    const references = [
      featuredData.ref1,
      featuredData.ref2,
      featuredData.ref3,
      featuredData.ref4,
    ].filter(ref => ref);

    if (references.length === 0) {
      setMessages(prev => ({
        ...prev,
        featured: 'At least one reference number is required!',
      }));
      setIsLoading(prev => ({ ...prev, featured: false }));
      return;
    }

    // Validate references
    for (const ref of references) {
      if (!validReferences.includes(ref)) {
        setMessages(prev => ({
          ...prev,
          featured: `Invalid reference number: ${ref}`,
        }));
        setIsLoading(prev => ({ ...prev, featured: false }));
        return;
      }
    }

    try {
      let response;
      if (featuredData._id) {
        response = await axios.put(
          `${BASE_URL}/api/featured/${featuredData._id}`,
          { references },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          featured: 'Featured properties updated successfully!',
        }));
      } else {
        response = await axios.post(`${BASE_URL}/api/featured`, { references });
        setMessages(prev => ({
          ...prev,
          featured: 'Featured properties saved successfully!',
        }));
      }

      setFeaturedData({
        _id: response.data._id || response.data.data?._id,
        ref1: response.data.references?.[0] || response.data.data?.references?.[0] || '',
        ref2: response.data.references?.[1] || response.data.data?.references?.[1] || '',
        ref3: response.data.references?.[2] || response.data.data?.references?.[2] || '',
        ref4: response.data.references?.[3] || response.data.data?.references?.[3] || '',
      });

      const updatedFeaturedPropertiesResponse = await axios.get(
        `${BASE_URL}/api/featured`
      );
      setFeaturedProperties(updatedFeaturedPropertiesResponse.data || null);
    } catch (error) {
      console.error('Error saving/updating featured properties:', error);
      setMessages(prev => ({
        ...prev,
        featured:
          error.response?.data?.error || 'Failed to save/update featured properties',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, featured: false }));
    }
  };

  const handleMansionContentSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, mansionContent: true }));
    setMessages(prev => ({ ...prev, mansionContent: '' }));

    if (!mansionData.description && !mansionData.btntext) {
      setMessages(prev => ({
        ...prev,
        mansionContent: 'At least one content field is required!',
      }));
      setIsLoading(prev => ({ ...prev, mansionContent: false }));
      return;
    }

    try {
      let response;
      if (mansionData._id) {
        response = await axios.put(
          `${BASE_URL}/api/mansion/${mansionData._id}`,
          {
            description: mansionData.description,
            btntext: mansionData.btntext,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          mansionContent: 'Mansion content updated successfully!',
        }));
      } else {
        response = await axios.post(`${BASE_URL}/api/mansion`, {
          description: mansionData.description,
          btntext: mansionData.btntext,
        });
        setMessages(prev => ({
          ...prev,
          mansionContent: 'Mansion content saved successfully!',
        }));
      }

      setMansionData(prev => ({
        ...prev,
        _id: response.data._id || prev._id,
        description: response.data.description || '',
        btntext: response.data.btntext || '',
      }));
    } catch (error) {
      console.error('Error saving/updating mansion content:', error);
      setMessages(prev => ({
        ...prev,
        mansionContent:
          error.response?.data?.error || 'Failed to save/update mansion content',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, mansionContent: false }));
    }
  };

  const handleMansionReferencesSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, mansionReferences: true }));
    setMessages(prev => ({ ...prev, mansionReferences: '' }));

    const references = [
      mansionData.ref1,
      mansionData.ref2,
      mansionData.ref3,
      mansionData.ref4,
    ].filter(ref => ref);

    if (references.length === 0) {
      setMessages(prev => ({
        ...prev,
        mansionReferences: 'At least one reference number is required!',
      }));
      setIsLoading(prev => ({ ...prev, mansionReferences: false }));
      return;
    }

    // Validate references
    for (const ref of references) {
      if (!validReferences.includes(ref)) {
        setMessages(prev => ({
          ...prev,
          mansionReferences: `Invalid reference number: ${ref}`,
        }));
        setIsLoading(prev => ({ ...prev, mansionReferences: false }));
        return;
      }
    }

    try {
      let response;
      const mansionFeatured = mansionFeaturedProperties;
      if (mansionFeatured && mansionFeatured._id) {
        response = await axios.put(
          `${BASE_URL}/api/mansion/featured/${mansionFeatured._id}`,
          { references },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          mansionReferences: 'Mansion references updated successfully!',
        }));
      } else {
        response = await axios.post(`${BASE_URL}/api/mansion/featured`, {
          references,
        });
        setMessages(prev => ({
          ...prev,
          mansionReferences: 'Mansion references saved successfully!',
        }));
      }

      setMansionData(prev => ({
        ...prev,
        ref1: response.data.references?.[0] || response.data.data?.references?.[0] || '',
        ref2: response.data.references?.[1] || response.data.data?.references?.[1] || '',
        ref3: response.data.references?.[2] || response.data.data?.references?.[2] || '',
        ref4: response.data.references?.[3] || response.data.data?.references?.[3] || '',
      }));

      const updatedMansionFeaturedResponse = await axios.get(
        `${BASE_URL}/api/mansion/featured`
      );
      setMansionFeaturedProperties(updatedMansionFeaturedResponse.data || null);
    } catch (error) {
      console.error('Error saving/updating mansion references:', error);
      setMessages(prev => ({
        ...prev,
        mansionReferences:
          error.response?.data?.error || 'Failed to save/update mansion references',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, mansionReferences: false }));
    }
  };

  const handlePenthouseContentSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, penthouseContent: true }));
    setMessages(prev => ({ ...prev, penthouseContent: '' }));

    if (!penthouseData.description && !penthouseData.btntext) {
      setMessages(prev => ({
        ...prev,
        penthouseContent: 'At least one content field is required!',
      }));
      setIsLoading(prev => ({ ...prev, penthouseContent: false }));
      return;
    }

    try {
      let response;
      if (penthouseData._id) {
        response = await axios.put(
          `${BASE_URL}/api/penthouse/${penthouseData._id}`,
          {
            description: penthouseData.description,
            btntext: penthouseData.btntext,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          penthouseContent: 'Penthouse content updated successfully!',
        }));
      } else {
        response = await axios.post(`${BASE_URL}/api/penthouse`, {
          description: penthouseData.description,
          btntext: penthouseData.btntext,
        });
        setMessages(prev => ({
          ...prev,
          penthouseContent: 'Penthouse content saved successfully!',
        }));
      }

      setPenthouseData(prev => ({
        ...prev,
        _id: response.data._id || prev._id,
        description: response.data.description || '',
        btntext: response.data.btntext || '',
      }));
    } catch (error) {
      console.error('Error saving/updating penthouse content:', error);
      setMessages(prev => ({
        ...prev,
        penthouseContent:
          error.response?.data?.error ||
          'Failed to save/update penthouse content',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, penthouseContent: false }));
    }
  };

  const handlePenthouseReferencesSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, penthouseReferences: true }));
    setMessages(prev => ({ ...prev, penthouseReferences: '' }));

    const references = [
      penthouseData.ref1,
      penthouseData.ref2,
      penthouseData.ref3,
      penthouseData.ref4,
    ].filter(ref => ref);

    if (references.length === 0) {
      setMessages(prev => ({
        ...prev,
        penthouseReferences: 'At least one reference number is required!',
      }));
      setIsLoading(prev => ({ ...prev, penthouseReferences: false }));
      return;
    }

    // Validate references
    for (const ref of references) {
      if (!validReferences.includes(ref)) {
        setMessages(prev => ({
          ...prev,
          penthouseReferences: `Invalid reference number: ${ref}`,
        }));
        setIsLoading(prev => ({ ...prev, penthouseReferences: false }));
        return;
      }
    }

    try {
      let response;
      const penthouseFeatured = penthouseFeaturedProperties;
      if (penthouseFeatured && penthouseFeatured._id) {
        response = await axios.put(
          `${BASE_URL}/api/penthouse/featured/${penthouseFeatured._id}`,
          { references },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          penthouseReferences: 'Penthouse references updated successfully!',
        }));
      } else {
        response = await axios.post(`${BASE_URL}/api/penthouse/featured`, {
          references,
        });
        setMessages(prev => ({
          ...prev,
          penthouseReferences: 'Penthouse references saved successfully!',
        }));
      }

      setPenthouseData(prev => ({
        ...prev,
        ref1: response.data.references?.[0] || response.data.data?.references?.[0] || '',
        ref2: response.data.references?.[1] || response.data.data?.references?.[1] || '',
        ref3: response.data.references?.[2] || response.data.data?.references?.[2] || '',
        ref4: response.data.references?.[3] || response.data.data?.references?.[3] || '',
      }));

      const updatedPenthouseFeaturedResponse = await axios.get(
        `${BASE_URL}/api/penthouse/featured`
      );
      setPenthouseFeaturedProperties(
        updatedPenthouseFeaturedResponse.data || null
      );
    } catch (error) {
      console.error('Error saving/updating penthouse references:', error);
      setMessages(prev => ({
        ...prev,
        penthouseReferences:
          error.response?.data?.error || 'Failed to save/update penthouse references',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, penthouseReferences: false }));
    }
  };

  const handleCollectiblesContentSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, collectiblesContent: true }));
    setMessages(prev => ({ ...prev, collectiblesContent: '' }));

    if (!collectiblesData.description && !collectiblesData.btntext) {
      setMessages(prev => ({
        ...prev,
        collectiblesContent: 'At least one content field is required!',
      }));
      setIsLoading(prev => ({ ...prev, collectiblesContent: false }));
      return;
    }

    try {
      let response;
      if (collectiblesData._id) {
        response = await axios.put(
          `${BASE_URL}/api/collectibles/${collectiblesData._id}`,
          {
            description: collectiblesData.description,
            btntext: collectiblesData.btntext,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          collectiblesContent: 'Collectibles content updated successfully!',
        }));
      } else {
        response = await axios.post(`${BASE_URL}/api/collectibles`, {
          description: collectiblesData.description,
          btntext: collectiblesData.btntext,
        });
        setMessages(prev => ({
          ...prev,
          collectiblesContent: 'Collectibles content saved successfully!',
        }));
      }

      setCollectiblesData(prev => ({
        ...prev,
        _id: response.data._id || prev._id,
        description: response.data.description || '',
        btntext: response.data.btntext || '',
      }));
    } catch (error) {
      console.error('Error saving/updating collectibles content:', error);
      setMessages(prev => ({
        ...prev,
        collectiblesContent:
          error.response?.data?.error ||
          'Failed to save/update collectibles content',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, collectiblesContent: false }));
    }
  };

  const handleCollectiblesReferencesSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, collectiblesReferences: true }));
    setMessages(prev => ({ ...prev, collectiblesReferences: '' }));

    const references = [
      collectiblesData.ref1,
      collectiblesData.ref2,
      collectiblesData.ref3,
      collectiblesData.ref4,
    ].filter(ref => ref);

    if (references.length === 0) {
      setMessages(prev => ({
        ...prev,
        collectiblesReferences: 'At least one reference number is required!',
      }));
      setIsLoading(prev => ({ ...prev, collectiblesReferences: false }));
      return;
    }

    // Validate references
    for (const ref of references) {
      if (!validReferences.includes(ref)) {
        setMessages(prev => ({
          ...prev,
          collectiblesReferences: `Invalid reference number: ${ref}`,
        }));
        setIsLoading(prev => ({ ...prev, collectiblesReferences: false }));
        return;
      }
    }

    try {
      let response;
      const collectiblesFeatured = collectiblesFeaturedProperties;
      if (collectiblesFeatured && collectiblesFeatured._id) {
        response = await axios.put(
          `${BASE_URL}/api/collectibles/featured/${collectiblesFeatured._id}`,
          { references },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          collectiblesReferences: 'Collectibles references updated successfully!',
        }));
      } else {
        response = await axios.post(
          `${BASE_URL}/api/collectibles/featured`,
          { references }
        );
        setMessages(prev => ({
          ...prev,
          collectiblesReferences: 'Collectibles references saved successfully!',
        }));
      }

      setCollectiblesData(prev => ({
        ...prev,
        ref1: response.data.references?.[0] || response.data.data?.references?.[0] || '',
        ref2: response.data.references?.[1] || response.data.data?.references?.[1] || '',
        ref3: response.data.references?.[2] || response.data.data?.references?.[2] || '',
        ref4: response.data.references?.[3] || response.data.data?.references?.[3] || '',
      }));

      const updatedCollectiblesFeaturedResponse = await axios.get(
        `${BASE_URL}/api/collectibles/featured`
      );
      setCollectiblesFeaturedProperties(
        updatedCollectiblesFeaturedResponse.data || null
      );
    } catch (error) {
      console.error('Error saving/updating collectibles references:', error);
      setMessages(prev => ({
        ...prev,
        collectiblesReferences:
          error.response?.data?.error ||
          'Failed to save/update collectibles references',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, collectiblesReferences: false }));
    }
  };

  const handleMagazineSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, magazine: true }));
    setMessages(prev => ({ ...prev, magazine: '' }));

    if (
      !magazineData.heading &&
      !magazineData.subheading &&
      !magazineData.image &&
      magazineExistingImage
    ) {
      setMessages(prev => ({
        ...prev,
        magazine: 'At least one field must be updated when an image exists!',
      }));
      setIsLoading(prev => ({ ...prev, magazine: false }));
      return;
    }

    if (!magazineData.heading && !magazineData.subheading && !magazineData.image) {
      setMessages(prev => ({
        ...prev,
        magazine: 'At least one field is required!',
      }));
      setIsLoading(prev => ({ ...prev, magazine: false }));
      return;
    }

    const formData = new FormData();
    if (magazineData.heading) formData.append('heading', magazineData.heading);
    if (magazineData.subheading)
      formData.append('subheading', magazineData.subheading);
    if (magazineData.image) formData.append('image', magazineData.image);

    try {
      let response;
      if (magazineData._id) {
        response = await axios.put(
          `${BASE_URL}/api/magazine/${magazineData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          magazine: 'Magazine section updated successfully!',
        }));
      } else {
        response = await axios.post(`${BASE_URL}/api/magazine`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessages(prev => ({
          ...prev,
          magazine: 'Magazine section saved successfully!',
        }));
      }

      setMagazineData({
        _id: response.data._id,
        heading: response.data.heading || '',
        subheading: response.data.subheading || '',
        image: null,
      });
      setMagazineExistingImage(response.data.image || null);
    } catch (error) {
      console.error('Error saving/updating magazine section:', error);
      setMessages(prev => ({
        ...prev,
        magazine:
          error.response?.data?.error ||
          'Failed to save/update magazine section',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, magazine: false }));
    }
  };

  const handleRemoveMagazineImage = async () => {
    if (!magazineData._id) return;

    setIsLoading(prev => ({ ...prev, magazine: true }));
    setMessages(prev => ({ ...prev, magazine: '' }));

    try {
      const response = await axios.put(
        `${BASE_URL}/api/magazine/${magazineData._id}`,
        { removeImage: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setMagazineExistingImage(null);
      setMagazineData(prev => ({
        ...prev,
        image: null,
      }));
      setMessages(prev => ({
        ...prev,
        magazine: 'Magazine image removed successfully!',
      }));
    } catch (error) {
      console.error('Error removing magazine image:', error);
      setMessages(prev => ({
        ...prev,
        magazine:
          error.response?.data?.error || 'Failed to remove magazine image',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, magazine: false }));
    }
  };

  const handleLinksSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, links: true }));
    setMessages(prev => ({ ...prev, links: '' }));

    const linksPayload = {
      mansionText1: linksData.mansionText1,
      mansionLink1: linksData.mansionLink1,
      mansionText2: linksData.mansionText2,
      mansionLink2: linksData.mansionLink2,
      mansionText3: linksData.mansionText3,
      mansionLink3: linksData.mansionLink3,
      mansionText4: linksData.mansionText4,
      mansionLink4: linksData.mansionLink4,
      penthouseText1: linksData.penthouseText1,
      penthouseLink1: linksData.penthouseLink1,
      penthouseText2: linksData.penthouseText2,
      penthouseLink2: linksData.penthouseLink2,
      penthouseText3: linksData.penthouseText3,
      penthouseLink3: linksData.penthouseLink3,
      penthouseText4: linksData.penthouseText4,
      penthouseLink4: linksData.penthouseLink4,
    };

    const hasAtLeastOneField = Object.values(linksPayload).some(
      value => value && value.trim() !== ''
    );

    if (!hasAtLeastOneField) {
      setMessages(prev => ({
        ...prev,
        links: 'At least one field is required!',
      }));
      setIsLoading(prev => ({ ...prev, links: false }));
      return;
    }

    try {
      let response;
      if (linksData._id) {
        response = await axios.put(
          `${BASE_URL}/api/links/${linksData._id}`,
          linksPayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          links: 'Links updated successfully!',
        }));
      } else {
        response = await axios.post(`${BASE_URL}/api/links`, linksPayload);
        setMessages(prev => ({
          ...prev,
          links: 'Links saved successfully!',
        }));
      }

      setLinksData({
        _id: response.data._id,
        mansionText1: response.data.mansionText1 || '',
        mansionLink1: response.data.mansionLink1 || '',
        mansionText2: response.data.mansionText2 || '',
        mansionLink2: response.data.mansionLink2 || '',
        mansionText3: response.data.mansionText3 || '',
        mansionLink3: response.data.mansionLink3 || '',
        mansionText4: response.data.mansionText4 || '',
        mansionLink4: response.data.mansionLink4 || '',
        penthouseText1: response.data.penthouseText1 || '',
        penthouseLink1: response.data.penthouseLink1 || '',
        penthouseText2: response.data.penthouseText2 || '',
        penthouseLink2: response.data.penthouseLink2 || '',
        penthouseText3: response.data.penthouseText3 || '',
        penthouseLink3: response.data.penthouseLink3 || '',
        penthouseText4: response.data.penthouseText4 || '',
        penthouseLink4: response.data.penthouseLink4 || '',
      });
    } catch (error) {
      console.error('Error saving/updating links:', error);
      setMessages(prev => ({
        ...prev,
        links: error.response?.data?.error || 'Failed to save/update links',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, links: false }));
    }
  };

  const handleReviewSubmit = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, review: true }));
    setMessages(prev => ({ ...prev, review: '' }));

    if (
      !reviewData.reviewerName ||
      !reviewData.company ||
      !reviewData.content
    ) {
      setMessages(prev => ({
        ...prev,
        review: 'All fields are required!',
      }));
      setIsLoading(prev => ({ ...prev, review: false }));
      return;
    }

    const reviewPayload = {
      reviewerName: reviewData.reviewerName,
      company: reviewData.company,
      content: reviewData.content,
      isApproved: reviewData.isApproved,
    };

    try {
      let response;
      if (reviewData._id) {
        response = await axios.put(
          `${BASE_URL}/api/reviews/${reviewData._id}`,
          reviewPayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          review: 'Review updated successfully!',
        }));
      } else {
        response = await axios.post(
          `${BASE_URL}/api/reviews`,
          reviewPayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(prev => ({
          ...prev,
          review: 'Review saved successfully!',
        }));
      }

      const updatedReviews = await axios.get(`${BASE_URL}/api/reviews/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setReviews(updatedReviews.data);

      setReviewData({
        _id: null,
        reviewerName: '',
        company: '',
        content: '',
        isApproved: false,
      });
    } catch (error) {
      console.error('Error saving/updating review:', error);
      setMessages(prev => ({
        ...prev,
        review:
          error.response?.data?.error || 'Failed to save/update review',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, review: false }));
    }
  };

  const handleEditReview = review => {
    setReviewData({
      _id: review._id,
      reviewerName: review.reviewerName,
      company: review.company,
      content: review.content,
      isApproved: review.isApproved,
    });
  };

  const handleDeleteReview = async reviewId => {
    setIsLoading(prev => ({ ...prev, review: true }));
    setMessages(prev => ({ ...prev, review: '' }));

    try {
      await axios.delete(`${BASE_URL}/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const updatedReviews = await axios.get(`${BASE_URL}/api/reviews/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setReviews(updatedReviews.data);

      setMessages(prev => ({
        ...prev,
        review: 'Review deleted successfully!',
      }));
    } catch (error) {
      console.error('Error deleting review:', error);
      setMessages(prev => ({
        ...prev,
        review: error.response?.data?.error || 'Failed to delete review',
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, review: false }));
    }
  };

  const handleCancelEdit = () => {
    setReviewData({
      _id: null,
      reviewerName: '',
      company: '',
      content: '',
      isApproved: false,
    });
    setMessages(prev => ({ ...prev, review: '' }));
  };

  return (
    <div className="w-full mx-auto p-4 md:p-20 mb-8">
      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Hero Section</h2>
        <form onSubmit={handleHeroSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Image
            </label>
            {heroExistingImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Existing Image:</p>
                <div className="relative inline-block">
                  <img
                    src={heroExistingImage}
                    alt="Hero"
                    className="w-32 h-32 object-cover rounded"
                    onError={e => {
                      console.error(
                        'Failed to load hero image:',
                        heroExistingImage
                      );
                      e.target.src =
                        'https://via.placeholder.com/128?text=Image+Not+Found';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveHeroImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <input
              type="file"
              name="heroImage"
              accept="image/*"
              onChange={e =>
                setHeroData({ ...heroData, image: e.target.files[0] })
              }
              className="w-full p-2 border outline-none mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={heroData.heading}
              onChange={e =>
                setHeroData({ ...heroData, heading: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter hero heading"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subheading
            </label>
            <input
              type="text"
              value={heroData.subheading}
              onChange={e =>
                setHeroData({ ...heroData, subheading: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter hero subheading"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.hero}
            >
              {isLoading.hero ? 'Saving...' : heroData._id ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
        {messages.hero && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.hero.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.hero}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Featured Listings Section
        </h2>
        <form onSubmit={handleFeaturedSubmit} className="space-y-4">
          {[1, 2, 3, 4].map(index => (
            <div key={`featured-ref${index}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference No {index}
              </label>
              <input
                type="text"
                value={featuredData[`ref${index}`]}
                onChange={e =>
                  setFeaturedData({
                    ...featuredData,
                    [`ref${index}`]: e.target.value,
                  })
                }
                className="w-full p-2 border outline-none mb-2"
                placeholder={`Enter reference ${index}`}
              />
            </div>
          ))}
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.featured}
            >
              {isLoading.featured ? 'Saving...' : featuredData._id ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
        {messages.featured && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.featured.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.featured}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mansion Section</h2>
        <form onSubmit={handleMansionContentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={mansionData.description}
              onChange={e =>
                setMansionData({ ...mansionData, description: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter mansion description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={mansionData.btntext}
              onChange={e =>
                setMansionData({ ...mansionData, btntext: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter mansion button text"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.mansionContent}
            >
              {isLoading.mansionContent
                ? 'Saving...'
                : mansionData._id
                ? 'Update Content'
                : 'Submit Content'}
            </button>
          </div>
        </form>
        {messages.mansionContent && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.mansionContent.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.mansionContent}
          </div>
        )}
        <form
          onSubmit={handleMansionReferencesSubmit}
          className="space-y-4 mt-6"
        >
          {[1, 2, 3, 4].map(index => (
            <div key={`mansion-ref${index}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference No {index}
              </label>
              <input
                type="text"
                value={mansionData[`ref${index}`]}
                onChange={e =>
                  setMansionData({
                    ...mansionData,
                    [`ref${index}`]: e.target.value,
                  })
                }
                className="w-full p-2 border outline-none mb-2"
                placeholder={`Enter reference ${index}`}
              />
            </div>
          ))}
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.mansionReferences}
            >
              {isLoading.mansionReferences
                ? 'Saving...'
                : mansionFeaturedProperties?._id
                ? 'Update References'
                : 'Submit References'}
            </button>
          </div>
        </form>
        {messages.mansionReferences && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.mansionReferences.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.mansionReferences}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Penthouse Section
        </h2>
        <form onSubmit={handlePenthouseContentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={penthouseData.description}
              onChange={e =>
                setPenthouseData({
                  ...penthouseData,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter penthouse description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={penthouseData.btntext}
              onChange={e =>
                setPenthouseData({ ...penthouseData, btntext: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter penthouse button text"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.penthouseContent}
            >
              {isLoading.penthouseContent
                ? 'Saving...'
                : penthouseData._id
                ? 'Update Content'
                : 'Submit Content'}
            </button>
          </div>
        </form>
        {messages.penthouseContent && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.penthouseContent.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.penthouseContent}
          </div>
        )}
        <form
          onSubmit={handlePenthouseReferencesSubmit}
          className="space-y-4 mt-6"
        >
          {[1, 2, 3, 4].map(index => (
            <div key={`penthouse-ref${index}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference No {index}
              </label>
              <input
                type="text"
                value={penthouseData[`ref${index}`]}
                onChange={e =>
                  setPenthouseData({
                    ...penthouseData,
                    [`ref${index}`]: e.target.value,
                  })
                }
                className="w-full p-2 border outline-none mb-2"
                placeholder={`Enter reference ${index}`}
              />
            </div>
          ))}
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-��
300"
              disabled={isLoading.penthouseReferences}
            >
              {isLoading.penthouseReferences
                ? 'Saving...'
                : penthouseFeaturedProperties?._id
                ? 'Update References'
                : 'Submit References'}
            </button>
          </div>
        </form>
        {messages.penthouseReferences && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.penthouseReferences.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.penthouseReferences}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Collectibles Section
        </h2>
        <form onSubmit={handleCollectiblesContentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={collectiblesData.description}
              onChange={e =>
                setCollectiblesData({
                  ...collectiblesData,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter collectibles description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={collectiblesData.btntext}
              onChange={e =>
                setCollectiblesData({
                  ...collectiblesData,
                  btntext: e.target.value,
                })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter collectibles button text"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.collectiblesContent}
            >
              {isLoading.collectiblesContent
                ? 'Saving...'
                : collectiblesData._id
                ? 'Update Content'
                : 'Submit Content'}
            </button>
          </div>
        </form>
        {messages.collectiblesContent && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.collectiblesContent.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.collectiblesContent}
          </div>
        )}
        <form
          onSubmit={handleCollectiblesReferencesSubmit}
          className="space-y-4 mt-6"
        >
          {[1, 2, 3, 4].map(index => (
            <div key={`collectibles-ref${index}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference No {index}
              </label>
              <input
                type="text"
                value={collectiblesData[`ref${index}`]}
                onChange={e =>
                  setCollectiblesData({
                    ...collectiblesData,
                    [`ref${index}`]: e.target.value,
                  })
                }
                className="w-full p-2 border outline-none mb-2"
                placeholder={`Enter reference ${index}`}
              />
            </div>
          ))}
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.collectiblesReferences}
            >
              {isLoading.collectiblesReferences
                ? 'Saving...'
                : collectiblesFeaturedProperties?._id
                ? 'Update References'
                : 'Submit References'}
            </button>
          </div>
        </form>
        {messages.collectiblesReferences && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.collectiblesReferences.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.collectiblesReferences}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Property Links Section
        </h2>
        <form onSubmit={handleLinksSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Mansion Links
              </h3>
              {[1, 2, 3, 4].map(index => (
                <div key={`mansion-${index}`} className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mansion Text {index}
                    </label>
                    <input
                      type="text"
                      value={linksData[`mansionText${index}`]}
                      onChange={e =>
                        setLinksData({
                          ...linksData,
                          [`mansionText${index}`]: e.target.value,
                        })
                      }
                      className="w-full p-2 border outline-none mb-2"
                      placeholder={`Enter mansion text ${index}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mansion Link {index}
                    </label>
                    <input
                      type="url"
                      value={linksData[`mansionLink${index}`]}
                      onChange={e =>
                        setLinksData({
                          ...linksData,
                          [`mansionLink${index}`]: e.target.value,
                        })
                      }
                      className="w-full p-2 border outline-none mb-2"
                      placeholder={`Enter mansion link ${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Penthouse Links
              </h3>
              {[1, 2, 3, 4].map(index => (
                <div key={`penthouse-${index}`} className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penthouse Text {index}
                    </label>
                    <input
                      type="text"
                      value={linksData[`penthouseText${index}`]}
                      onChange={e =>
                        setLinksData({
                          ...linksData,
                          [`penthouseText${index}`]: e.target.value,
                        })
                      }
                      className="w-full p-2 border outline-none mb-2"
                      placeholder={`Enter penthouse text ${index}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penthouse Link {index}
                    </label>
                    <input
                      type="url"
                      value={linksData[`penthouseLink${index}`]}
                      onChange={e =>
                        setLinksData({
                          ...linksData,
                          [`penthouseLink${index}`]: e.target.value,
                        })
                      }
                      className="w-full p-2 border outline-none mb-2"
                      placeholder={`Enter penthouse link ${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.links}
            >
              {isLoading.links ? 'Saving...' : linksData._id ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
        {messages.links && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.links.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.links}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Magazine Section
        </h2>
        <form onSubmit={handleMagazineSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Magazine Image
            </label>
            {magazineExistingImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Existing Image:</p>
                <div className="relative inline-block">
                  <img
                    src={magazineExistingImage}
                    alt="Magazine"
                    className="w-32 h-32 object-cover rounded"
                    onError={e => {
                      console.error(
                        'Failed to load magazine image:',
                        magazineExistingImage
                      );
                      e.target.src =
                        'https://via.placeholder.com/128?text=Image+Not+Found';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveMagazineImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <input
              type="file"
              name="magazineImage"
              accept="image/*"
              onChange={e =>
                setMagazineData({ ...magazineData, image: e.target.files[0] })
              }
              className="w-full p-2 border outline-none mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Magazine Heading
            </label>
            <input
              type="text"
              value={magazineData.heading}
              onChange={e =>
                setMagazineData({ ...magazineData, heading: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter magazine heading"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Magazine Subheading
            </label>
            <input
              type="text"
              value={magazineData.subheading}
              onChange={e =>
                setMagazineData({ ...magazineData, subheading: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter magazine subheading"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
              disabled={isLoading.magazine}
            >
              {isLoading.magazine
                ? 'Saving...'
                : magazineData._id
                ? 'Update'
                : 'Submit'}
            </button>
          </div>
        </form>
        {messages.magazine && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.magazine.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.magazine}
          </div>
        )}
      </div>

      <div className="bg-white shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Client Reviews Section
        </h2>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer Name
            </label>
            <input
              type="text"
              value={reviewData.reviewerName}
              onChange={e =>
                setReviewData({ ...reviewData, reviewerName: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter reviewer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={reviewData.company}
              onChange={e =>
                setReviewData({ ...reviewData, company: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Content
            </label>
            <textarea
              value={reviewData.content}
              onChange={e =>
                setReviewData({ ...reviewData, content: e.target.value })
              }
              className="w-full p-2 border outline-none mb-2"
              placeholder="Enter review content"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approve Review
            </label>
            <input
              type="checkbox"
              checked={reviewData.isApproved}
              onChange={e =>
                setReviewData({ ...reviewData, isApproved: e.target.checked })
              }
              className="h-5 w-5 text-gray-900 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">
              Check to approve review for public display
            </span>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 text-right">
              <button
                type="submit"
                className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                disabled={isLoading.review}
              >
                {isLoading.review
                  ? 'Saving...'
                  : reviewData._id
                  ? 'Update'
                  : 'Submit'}
              </button>
            </div>
            {reviewData._id && (
              <div className="flex-1 text-right">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </div>
        </form>
        {messages.review && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              messages.review.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {messages.review}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Existing Reviews
          </h3>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Reviewer Name
                    </th>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Company
                    </th>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Content
                    </th>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Approved
                    </th>
                    <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr key={review._id}>
                      <td className="px-4 py-2 border text-sm text-gray-600">
                        {review.reviewerName}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-600">
                        {review.company}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-600">
                        {review.content.substring(0, 50)}...
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-600">
                        {review.isApproved ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="font-inter px-4 py-1 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="font-inter px-4 py-1 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageForm;