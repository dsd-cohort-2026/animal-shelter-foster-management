import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import shelterLogo from "../assets/shelter-logo.png";

export default function LoginPage() {
  return (
    <section className="flex flex-col ">
      <div className="w-full flex flex-col items-center">
        <img src={shelterLogo} alt="Shelter Logo" className="w-full md:max-w-[500px]" />
      </div>
      <div className="flex flex-col items-center w-full">
        <Card className="w-full max-w-[700px]">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email and password below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-y-4">
                <div>
                  <Label htmlFor="email" className="pb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe123@gmail.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="pb-2">
                    Password
                  </Label>
                  <Input id="password" type="password" required />
                </div>
                <div>
                  {/* currently navigation is a placeholder */}
                  <a href="/" className="hover:underline underline-offset-3">
                    Forgot your password?
                  </a>
                </div>
                <div>
                  <Button className="bg-evergreen cursor-pointer" type="submit">
                    Sign In
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
