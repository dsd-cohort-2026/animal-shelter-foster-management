import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useForm } from '@tanstack/react-form';
import { useBoundStore } from '@/store';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

function SignInForm() {
  const navigate = useNavigate();
  const signIn = useBoundStore((state) => state.signIn);
  const [authError, setAuthError] = useState('');

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setAuthError('');
      const error = await signIn(value.email, value.password);

      if (error) {
        setAuthError(error.message);
        return;
      }

      navigate({ to: '/' });
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-100 m-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
            <div className="bg-destructive/15 border border-destructive/50 text-destructive px-4 py-3 rounded-md mb-4">
              <p className="text-sm">{authError}</p>
            </div>
          )}
          <form
            id="sign-in-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldSet className="gap-7">
              <FieldGroup>
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
                  name="password"
                  validators={{
                    onSubmit: ({ value }) => (value === '' ? 'Password is required' : undefined),
                  }}
                  children={(field) => {
                    const error = field.state.meta.errors?.[0];
                    const isInvalid = field.state.meta.isTouched && !!error;
                    return (
                      <Field data-invalid={isInvalid}>
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
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
        <CardFooter>
          <FieldGroup>
            <Button type="submit" form="sign-in-form" className="w-[70%] m-auto">
              Sign In
            </Button>
          </FieldGroup>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignInForm;
