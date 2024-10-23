import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { FormField, Label, Input, ErrorDiv, Button, Select } from '../components/StyledComponents';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  link: Yup.string().url('Invalid URL').required('Link is required'),
  resource_type: Yup.string().required('Resource type is required'),
  mentor_username: Yup.string().required('Mentor username is required'),
  mentor_email: Yup.string().email('Invalid email address').required('Mentor email is required'),
  summary: Yup.string().required('Summary is required'),
  completed_the_event: Yup.date().required('Completion date is required'),
});

const AdminDashboard = () => {
  const history = useHistory();

  const initialValues = {
    title: '',
    description: '',
    link: '',
    resource_type: 'internship',
    mentor_username: '',
    mentor_email: '',
    summary: '',
    completed_the_event: '', 
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Separate resource data from mentor data
      const resourceData = {
        title: values.title,
        description: values.description,
        link: values.link,
        resource_type: values.resource_type,
      };
      const mentorData = {
        mentor_username: values.mentor_username,
        mentor_email: values.mentor_email,
        summary: values.summary,
        completed_the_event: values.completed_the_event,
      };

      // Submit resource data first
      const resourceResponse = await fetch('/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
        credentials: 'include',
      });

      if (!resourceResponse.ok) throw new Error('Failed to submit resource');
      const newResource = await resourceResponse.json();

      // Submit mentorship data next
      const mentorshipData = {
        ...mentorData,
        resource_id: newResource.resource.id, // Link mentorship to the newly created resource
      };
      const mentorshipResponse = await fetch('/mentorships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mentorshipData),
        credentials: 'include',
      });

      if (!mentorshipResponse.ok) throw new Error('Failed to submit mentorship');
      const newMentorship = await mentorshipResponse.json();

      resetForm();
      alert('Resource and mentorship submitted successfully!');
      history.push('/college');
    } catch (error) {
      console.error('Error submitting resource and mentorship:', error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <FormField>
            <Label htmlFor="title">Title</Label>
            <Field as={Input} type="text" name="title" />
            <ErrorMessage name="title" component={ErrorDiv} />
          </FormField>

          <FormField>
            <Label htmlFor="description">Description</Label>
            <Field as={Input} type="textarea" name="description" />
            <ErrorMessage name="description" component={ErrorDiv} />
          </FormField>

          <FormField>
            <Label htmlFor="link">Link</Label>
            <Field as={Input} type="url" name="link" />
            <ErrorMessage name="link" component={ErrorDiv} />
          </FormField>

          <FormField>
            <Label htmlFor="resource_type">Type</Label>
            <Field as={Select} name="resource_type">
              <option value="internship">Internship</option>
              <option value="scholarship">Scholarship</option>
            </Field>
            <ErrorMessage name="resource_type" component={ErrorDiv} />
          </FormField>

          <FormField>
            <Label htmlFor="mentor_username">Mentor Username</Label>
            <Field as={Input} type="text" name="mentor_username" />
            <ErrorMessage name="mentor_username" component={ErrorDiv} />
          </FormField>

          <FormField>
            <Label htmlFor="mentor_email">Mentor Email</Label>
            <Field as={Input} type="email" name="mentor_email" />
            <ErrorMessage name="mentor_email" component={ErrorDiv} />
          </FormField>

          <FormField>
            <Label htmlFor="summary">Summary</Label>
            <Field as={Input} type="textarea" name="summary" />
            <ErrorMessage name="summary" component={ErrorDiv} />
          </FormField>

          <FormField>
            <Label htmlFor="completed_the_event">Completed the Event Date</Label>
            <Field as={Input} type="date" name="completed_the_event" />
            <ErrorMessage name="completed_the_event" component={ErrorDiv} />
          </FormField>

          <FormField>
            <Button type="submit">Submit Resource</Button>
          </FormField>
        </Form>
      )}
    </Formik>
  );
};

export default AdminDashboard;