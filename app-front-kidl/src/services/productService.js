import axios from "axios";

const BASE_URL = 'http://localhost:3001/api/products';

export const fetchProducts = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  return response.json();
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch product details");
  }
};
