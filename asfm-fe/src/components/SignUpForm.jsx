import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useForm } from '@tanstack/react-form';
import { useBoundStore } from '@/store';
import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { Route } from '@/routes/SignIn';

function SignUpForm() {
  const navigate = useNavigate();
  const signUp = useBoundStore((state) => state.signUp);
  const [authError, setAuthError] = useState('');

  const form = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      address: '',
      phone: '',
    },
    onSubmit: async ({ value }) => {
      setAuthError('');
      const error = await signUp(value);

      if (error) {
        setAuthError(error.message);
        return;
      }

      navigate({ to: '/' });
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-100 md:w-1/2 lg:w-1/3 m-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Enter Your Information to Create an Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
            <div className="bg-destructive/15 border border-destructive/50 text-destructive px-4 py-3 rounded-md mb-4">
              <p className="text-sm">{authError}</p>
            </div>
          )}
          <form
            id="sign-up-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldSet className="gap-7">
              <FieldGroup className="grid grid-cols-2">
                <form.Field
                  name="first_name"
                  validators={{
                    onSubmit: ({ value }) => (value === '' ? 'First name is required' : undefined),
                  }}
                  children={(field) => {
                    const error = field.state.meta.errors?.[0];
                    const isInvalid = field.state.meta.isTouched && !!error;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="First Name"
                          aria-invalid={isInvalid}
                        />
                        {error && <FieldError>{error}</FieldError>}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="last_name"
                  validators={{
                    onSubmit: ({ value }) => (value === '' ? 'Last name is required' : undefined),
                  }}
                  children={(field) => {
                    const error = field.state.meta.errors?.[0];
                    const isInvalid = field.state.meta.isTouched && !!error;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Last Name"
                          aria-invalid={isInvalid}
                        />
                        {error && <FieldError>{error}</FieldError>}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="email"
                  validators={{
                    onSubmit: ({ value }) => (value === '' ? 'Email is required' : undefined),
                  }}
                  children={(field) => {
                    const error = field.state.meta.errors?.[0];
                    const isInvalid = field.state.meta.isTouched && !!error;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Email address"
                          aria-invalid={isInvalid}
                        />
                        {error && <FieldError>{error}</FieldError>}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="phone"
                  validators={{
                    onSubmit: ({ value }) => value === '' ? 'Please Provide a Phone Number' : undefined
                  }}
                  children={(field) => {
                    const error = field.state.meta.errors?.[0];
                    const isInvalid = field.state.meta.isTouched && !!error;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="phone"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Phone Number"
                          aria-invalid={isInvalid}
                        />
                        {error && <FieldError>{error}</FieldError>}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="address"
                  validators={{
                    onSubmit: ({ value }) => value === '' ? 'Please Provide an Address' : undefined
                  }}
                  children={(field) => {
                    const error = field.state.meta.errors?.[0];
                    const isInvalid = field.state.meta.isTouched && !!error;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Address"
                          aria-invalid={isInvalid}
                        />
                        {error && <FieldError>{error}</FieldError>}
                      </Field>
                    );
                  }}
                  />
                  <form.Field
                    name="password"
                    validators={{
                      onSubmit: ({ value }) => (value === '' ? 'Password is required' : undefined),
                    }}
                    children={(field) => {
                      const error = field.state.meta.errors?.[0];
                      const isInvalid = field.state.meta.isTouched && !!error;
                      return (
                        <Field
                          data-invalid={isInvalid}
                          className="col-span-full"
                        >
                          <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Password"
                            aria-invalid={isInvalid}
                          />
                          {error && <FieldError>{error}</FieldError>}
                        </Field>
                      );
                    }}
                  />
                  <form.Field
                    name="confirm-password"
                    validators={{
                      onSubmit: ({ value }) => {
                        if (value === '') return 'Confirm!';
                        if (value !== form.getFieldValue('password')) return 'Passwords Must Match';
                      }
                    }}
                    children={(field) => {
                      const error = field.state.meta.errors?.[0];
                      const isInvalid = field.state.meta.isTouched && !!error;
                      return (
                        <Field
                          data-invalid={isInvalid}
                          className="col-span-full"
                        >
                          <FieldLabel htmlFor={field.name}>Password Confirmation</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Confirm Password"
                            aria-invalid={isInvalid}
                          />
                          {error && <FieldError>{error}</FieldError>}
                        </Field>
                      );
                    }}
                  />
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
        <CardFooter>
          <FieldGroup>
            <Button type="submit" form="sign-up-form" className="w-[70%] m-auto">
              Sign Up
            </Button>
          </FieldGroup>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUpForm;
