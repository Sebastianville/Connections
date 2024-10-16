import React, { useState, useContext } from "react";
import { UserContext } from "./userContext";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormField, Label, Input, Error, Button, Select } from './StyledComponents';

const SignUpSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Must be a valid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], "Passwords must match").required("Password confirmation is required"),
  birthdate: yup.date().required("Birthdate is required"),
  bio: yup.string().min(10, "Bio must be at least 10 characters").required("Bio is required"),
  is_mentor: yup.boolean().required("Mentor status is required"),
  cover_photo: yup.string().url("Must be a valid URL"), 
});

function SignUpForm() {
  const { login } = useContext(UserContext); 
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      birthdate: new Date(),
      bio: "",
      is_mentor: false, 
      cover_photo: "",
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
          birthdate: new Date(values.birthdate),
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || "Signup failed. Please try one more time.");
        }
        login(responseData);
      } catch (err) {
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
        {formik.touched.username && formik.errors.username && <Error>{formik.errors.username}</Error>}
      </FormField>

      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Add this line
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && <Error>{formik.errors.email}</Error>}
      </FormField>

      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Add this line
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && <Error>{formik.errors.password}</Error>}
      </FormField>

      <FormField>
        <Label htmlFor="passwordConfirmation">Password Confirmation</Label>
        <Input
          type="password"
          name="passwordConfirmation"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Add this line
          value={formik.values.passwordConfirmation}
        />
        {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && <Error>{formik.errors.passwordConfirmation}</Error>}
      </FormField>

      <FormField>
        <Label htmlFor="birthdate">Birthdate</Label>
        <Input
          type="date"
          name="birthdate"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Add this line
          value={formik.values.birthdate}
        />
        {formik.touched.birthdate && formik.errors.birthdate && <Error>{formik.errors.birthdate}</Error>}
      </FormField>

      <FormField>
        <Label htmlFor="bio">Bio</Label>
        <Input
          type="text"
          name="bio"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Add this line
          value={formik.values.bio}
        />
        {formik.touched.bio && formik.errors.bio && <Error>{formik.errors.bio}</Error>}
      </FormField>

      <FormField>
        <Label htmlFor="is_mentor">Are you a mentor?</Label>
        <Select
          name="is_mentor"
          onChange={(e) => formik.setFieldValue('is_mentor', e.target.value === 'true')}
          onBlur={formik.handleBlur} // Add this line
          value={formik.values.is_mentor.toString()} 
        >
          <option value='false'>No</option>
          <option value='true'>Yes</option>
        </Select>
        {formik.touched.is_mentor && formik.errors.is_mentor && <Error>{formik.errors.is_mentor}</Error>}
      </FormField>

      <FormField>
        <Label htmlFor="cover_photo">Cover Photo URL (Optional)</Label>
        <Input
          type="url"
          name="cover_photo"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} // Add this line
          value={formik.values.cover_photo}
        />
        {formik.touched.cover_photo && formik.errors.cover_photo && <Error>{formik.errors.cover_photo}</Error>}
      </FormField>

      {error && <Error>{error}</Error>}

      <FormField>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Registering..." : "Register"}
        </Button>
      </FormField>
    </form>
  );
}

export default SignUpForm;