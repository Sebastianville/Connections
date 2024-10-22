import React, { useState, useContext } from "react";
import { UserContext } from "./userContext";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormField, Label, Input, ErrorDiv, Button, Select, CheckboxInput} from './StyledComponents';

const SignUpSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Must be a valid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  password_confirmation: yup.string().oneOf([yup.ref('password'), null], "Passwords must match").required("Password confirmation is required"),
  birthdate: yup.date().required("Birthdate is required"),
  bio: yup.string().min(10, "Bio must be at least 10 characters").required("Bio is required"),
  is_mentor: yup.boolean().required("Mentor status is required"),
  cover_photo: yup.string().url("Must be a valid URL"), 
  // it is a regex that matches a strign that starts with a digit and contains exactly 11 digits in total and ends after the 11 digits
  phone_number: yup.string().matches(/^\d{11}$/, "Must be a valid phone number"), 
  receive_sms_notifications: yup.boolean(),
});

function SignUpForm() {
  const { login } = useContext(UserContext); 
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      birthdate: new Date(),
      bio: "",
      is_mentor: false, 
      cover_photo: "",
      phone_number: "",
      receive_sms_notifications: false,
    },
    validationSchema: SignUpSchema,
    validateOnChange: false, 
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await fetch('/signup', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const responseData = await response.json();
        console.log(responseData)
        if (!response.ok) {
          throw new Error(responseData.message || "Signup failed. Please try one more time.");
        }
        login(responseData);
      } catch (err) {
        console.error(err)
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormField>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          name="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} 
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && <ErrorDiv>{formik.errors.username}</ErrorDiv>}
      </FormField>

      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} 
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && <ErrorDiv>{formik.errors.email}</ErrorDiv>}
      </FormField>

      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} 
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && <ErrorDiv>{formik.errors.password}</ErrorDiv>}
      </FormField>


      {/* Password Confirmation Field */}
      <FormField>
        <Label htmlFor="password_confirmation">Password Confirmation</Label>
        <Input
          type="password"
          name="password_confirmation"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} 
          value={formik.values.password_confirmation}
        />
        {formik.touched.password_confirmation && formik.errors.password_confirmation && <ErrorDiv>{formik.errors.password_confirmation}</ErrorDiv>}
      </FormField>


      {/* Birthdate Field */}
      <FormField>
        <Label htmlFor="birthdate">Birthdate</Label>
        <Input
          type="date"
          name="birthdate"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} 
          value={formik.values.birthdate}
        />
        {formik.touched.birthdate && formik.errors.birthdate && <ErrorDiv>{formik.errors.birthdate}</ErrorDiv>}
      </FormField>


      {/* Bio Field */}
      <FormField>
        <Label htmlFor="bio">Bio</Label>
        <Input
          type="text"
          name="bio"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} 
          value={formik.values.bio}
        />
        {formik.touched.bio && formik.errors.bio && <ErrorDiv>{formik.errors.bio}</ErrorDiv>}
      </FormField>


       {/* Mentor Status Field */}
      <FormField>
        <Label htmlFor="is_mentor">Are you a mentor?</Label>
        <Select
          name="is_mentor"
          onChange={(e) => formik.setFieldValue('is_mentor', e.target.value === 'true')}
          onBlur={formik.handleBlur} 
          value={formik.values.is_mentor.toString()} 
        >
          <option value='false'>No</option>
          <option value='true'>Yes</option>
        </Select>
        {formik.touched.is_mentor && formik.errors.is_mentor && <ErrorDiv>{formik.errors.is_mentor}</ErrorDiv>}
      </FormField>


      {/* Cover Photo Field */}
      <FormField>
        <Label htmlFor="cover_photo">Cover Photo URL (Optional)</Label>
        <Input
          type="url"
          name="cover_photo"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Add this line
          value={formik.values.cover_photo}
        />
        {formik.touched.cover_photo && formik.errors.cover_photo && <ErrorDiv>{formik.errors.cover_photo}</ErrorDiv>}
      </FormField>


      {/* Phone Number Field */}
      <FormField>
        <Label htmlFor="phone_number">Phone Number (Optional)</Label>
        <Input
          type="text"
          name="phone_number"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phone_number}
        />
        {formik.touched.phone_number && formik.errors.phone_number && <ErrorDiv>{formik.errors.phone_number}</ErrorDiv>}
      </FormField>

      {/* Conditionally Render SMS Notifications Checkbox */}
      {formik.values.phone_number && (
        <FormField>
          <Label>
            <CheckboxInput
              type="checkbox"
              name="receive_sms_notifications"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.receive_sms_notifications}
            />
            Receive SMS Notifications
          </Label>
          <small>By checking this box, you agree to receive occasional SMS notifications. Standard message and data rates may apply.</small>
        </FormField>
      )}

      {/* Error Handling */}
      {error && <ErrorDiv>{error}</ErrorDiv>}

      {/* Submit Button */}
      <FormField>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Registering..." : "Register"}
        </Button>
      </FormField>
    </form>
  );
}

export default SignUpForm;