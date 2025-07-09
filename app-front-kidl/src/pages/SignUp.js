import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(5, "min 5"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phone: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, "Enter a valid phone number")
      .optional(),
    address: Yup.object().shape({
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      zipCode: Yup.string().required("Zip code is required"),
      country: Yup.string().required("Country is required"),
    }),
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zipCode: "",
      country: "",
    },
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await axios.post("http://localhost:3001/api/auth/signup", values); // Adjust the API endpoint URL
      navigate("/login"); 
    } catch (error) {
      setErrors({ email: error.response.data.error || "Signup failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Field
                  type="text"
                  id="phone"
                  name="phone"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2">Address</h3>
                <div className="mb-2">
                  <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                    Street
                  </label>
                  <Field
                    type="text"
                    id="address.street"
                    name="address.street"
                    className="mt-1 p-2 block w-full border rounded-md"
                  />
                  <ErrorMessage
                    name="address.street"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <Field
                    type="text"
                    id="address.city"
                    name="address.city"
                    className="mt-1 p-2 block w-full border rounded-md"
                  />
                  <ErrorMessage
                    name="address.city"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                    Zip Code
                  </label>
                  <Field
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    className="mt-1 p-2 block w-full border rounded-md"
                  />
                  <ErrorMessage
                    name="address.zipCode"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <Field
                    type="text"
                    id="address.country"
                    name="address.country"
                    className="mt-1 p-2 block w-full border rounded-md"
                  />
                  <ErrorMessage
                    name="address.country"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
