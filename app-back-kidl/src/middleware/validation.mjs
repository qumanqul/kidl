import express from "express";
import { check, validationResult } from "express-validator"; // Import check and validationResult

export const validateOrder = [
  check("products")
    .isArray({ min: 1 })
    .withMessage("Products must be an array with at least one item."),
  check("products.*.productId")
    .isString()
    .withMessage("Product ID must be a string."),
  check("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1."),
  check("shippingAddress.street")
    .notEmpty()
    .withMessage("Street is required."),
  check("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required."),
  check("shippingAddress.zipCode")
    .notEmpty()
    .withMessage("Zip code is required."),
  check("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required."),
  check("paymentMethod")
    .isIn(["credit_card", "paypal"])
    .withMessage("Payment method must be 'credit_card' or 'paypal'."),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateSignup = [
    check('name').notEmpty().withMessage('Name is required.'),
    check('email').isEmail().withMessage('Valid email is required.'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
    check('phone')
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage('Please enter a valid phone number.'),
  ];


  