import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../components/userContext';

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);

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
        const response = await fetch(`http://localhost:5555/users/${user.id}`, {
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
      } catch (error) {
        console.error('Error updating password:', error);
      }
    },
  });

  return (
    <div>
      <h1> Update Your Profile</h1>
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
    </div>
  );
};

export default Profile;