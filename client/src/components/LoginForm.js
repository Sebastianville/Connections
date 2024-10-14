import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

const LoginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

function LoginForm({onLogin}){

    const formik = useFormik({
        initialValues: {
          username: "",
          password: "",
        },
        validationSchema: LoginSchema,
        onSubmit: (values, { setSubmitting, setErrors }) => {
          setSubmitting(true);
          fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((r) => {
              setSubmitting(false);
            });
        },
      });
    

      return (
        <form onSubmit={formik.handleSubmit}>
          <Form>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.errors.username && formik.touched.username ? (
              <Error>{formik.errors.username}</Error>
            ) : null}
          </Form>
    
          <Form>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password && formik.touched.password ? (
              <Error>{formik.errors.password}</Error>
            ) : null}
          </Form>
    
          <Form>
            <Button type= "submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ?  "Registering..." : "Register"}
            </Button>
          </Form>
        </form>
      );
    }
    
    export default LoginForm;