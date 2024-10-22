import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../components/userContext';

const Profile = () => {
  const { user, updateUser, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory()

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: values.newPassword }), 
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to update password');
        
        const updatedUser = await response.json();
        updateUser(updatedUser);
        formik.resetForm();
        
        // Display alert on successful password update
        alert('Your password has been successfully updated!');
      } catch (error) {
        console.error('Error updating password:', error);
      }
    },
  });
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      setIsLoading(true);
      setError(null);
      history.push("/")
      try {
        const response = await fetch(`/users/${user.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete account");
        }
        setUser(null); 
        alert("Account deleted successfully");
      } catch (error) {
        console.error("Error deleting account:", error);
        setError("Failed to delete account. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Update Your Profile</h1>
      <p>Username: {user.username}</p> 
      <form onSubmit={formik.handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            required
          />
        </label>
        {formik.touched.newPassword && formik.errors.newPassword ? (
          <div style={{ color: 'red' }}>{formik.errors.newPassword}</div>
        ) : null}
        <button type="submit">Change Password</button>
      </form>

      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          onClick={handleDeleteAccount}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default Profile;