/**
 * The form used for signing in via email/password.
 *
 * @flow
 */
import type {Credentials} from 'universal/types/auth';

import React from 'react';
import styled from 'react-emotion';
import {Link} from 'react-router-dom';
import {Field, reduxForm} from 'redux-form';

import Button from 'universal/components/Button/Button';
import InputField from 'universal/components/InputField/InputField';
import parseEmailAddressList from 'universal/utils/parseEmailAddressList';
import shouldValidate from 'universal/validation/shouldValidate';

type Props = {
  handleSubmit: () => void, // Provided by redux-form
  onSubmit: (Credentials) => Promise<any>, // Provided by clients of the exported component
  submitting: boolean,
  valid: boolean
};

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column'
});

const FieldsContainer = styled('div')({
  marginBottom: '2rem'
});

const ForgotPasswordLink = styled(Link)({
  marginTop: '1rem',
  textAlign: 'center'
});

const SignInEmailPasswordForm = (props: Props) => (
  <Form onSubmit={props.handleSubmit}>
    <FieldsContainer>
      <Field
        type="email"
        autoFocus
        component={InputField}
        placeholder="you@company.co"
        label="Email:"
        name="email"
        underline
        disabled={props.submitting}
      />
      <Field
        type="password"
        component={InputField}
        placeholder="********"
        label="Password:"
        name="password"
        underline
        disabled={props.submitting}
      />
    </FieldsContainer>
    <Button
      disabled={!props.valid}
      waiting={props.submitting}
      type="submit"
      label="Sign In"
      title="Sign In"
      colorPalette="warm"
    />
    <ForgotPasswordLink to="/reset-password">Forgot your password?</ForgotPasswordLink>
  </Form>
);

const validate = (values) => {
  const validation = {};
  if (!parseEmailAddressList(values.email)) {
    validation.email = 'Enter a valid email address.';
  }
  if (!values.password) {
    validation.password = 'Enter a password.';
  }
  return validation;
};

export default reduxForm({form: 'signin', shouldValidate, validate})(SignInEmailPasswordForm);
