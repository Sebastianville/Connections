import { useState, useContext } from "react";
import { UserContext } from "./userContext";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormField, Label, Input, ErrorDiv, Button } from './StyledComponents';


const LoginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  email: yup.string().email("Must be a valid email").required("Emai is required")
});

function LoginForm() {
  const { login } = useContext(UserContext);
  const [error, setError] = useState(""); 

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Login failed. Please check your credentials.");
        }

        const user = await response.json();
        login(user); 
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
          value={formik.values.username}
        />
        {formik.errors.username && formik.touched.username ? (
          <ErrorDiv>{formik.errors.username}</ErrorDiv>
        ) : null}
      </FormField>

      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && formik.touched.email ? (
          <ErrorDiv>{formik.errors.email}</ErrorDiv>
        ) : null}
      </FormField>

      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && formik.touched.password ? (
          <ErrorDiv>{formik.errors.password}</ErrorDiv>
        ) : null}
      </FormField>

      {error && <ErrorDiv>{error}</ErrorDiv>}

      <FormField>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Logging in..." : "Log In"}
        </Button>
      </FormField>
    </form>
  );
}

export default LoginForm;