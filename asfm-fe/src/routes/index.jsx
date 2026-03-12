import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useBoundStore } from '@/store';
import heroImage from '@/assets/asfm-hero.webp';
import checkoutImage from '@/assets/checkout.jpeg';
import medicationImage from '@/assets/medication.jpeg';
import historyImage from '@/assets/history.jpeg';
import { Button } from '@/components/ui/button';
import { BriefcaseMedical, Dog, Warehouse } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const loading = useBoundStore((state) => state.loading);
  const user = useBoundStore((state) => state.user);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="min-h-[75vh] flex items-center">
        <div className="bg-secondary/50 min-h-content w-full flex flex-col-reverse md:flex-row items-center justify-between rounded-2xl">
          <div className="flex flex-col max-w-[90vw] 2xl:max-w-[75vw] gap-3 md:gap-6 p-3 md:p-5 lg:p-7 md:max-w-[50vw] md:w-auto">
            <h2 className="text-2xl md:text-h1 text-primary">
              Foster care made simple and accountable
            </h2>
            <p className="lg:text-lg">
              ShelterSync tracks every foster supply, medical update, and animal profile so shelters
              stay organized and animals stay healthy.
            </p>
            {!user && (
              <Button
                variant="outline"
                className="w-fit"
                onClick={() => navigate({ to: '/signin' })}
              >
                Start Tracking Foster Care
              </Button>
            )}
          </div>
          <img
            src={heroImage}
            className="h-auto w-3xl aspect-square max-w-[90vw] md:max-w-[50vw] md:w-auto rounded-r-2xl"
            alt="woman sitting in chair with tablet adn petting a dog"
          />
        </div>
      </section>
      {/* Features */}
      <section className="min-h-[50vh] flex flex-col items-center gap-3 md:gap-6 my-[10%]">
        <h2 className="text-2xl md:text-h1 text-primary">Product Features</h2>
        <p className="text-center">
          Stop losing thousands in supplies and reduce medical liability
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-6 mt-[10%] h-full">
          <div className="bg-secondary/30 px-2.5 lg:px-4 py-10 md:min-h-60 h-auto sm:w-1/3 flex flex-col justify-start rounded-xl">
            <Warehouse className="sm:h-8 sm:w-8" />
            <h2 className="text-h2">Inventory accountability</h2>
            <p>Track crates, food, and medication sent to foster homes</p>
          </div>
          <div className="bg-secondary/30 px-2.5 lg:px-4 py-10 md:min-h-60 h-auto sm:w-1/3 flex flex-col justify-start rounded-xl">
            <BriefcaseMedical className="sm:h-8 sm:w-8" />
            <h2 className="text-h2">Medical Compliance</h2>
            <p>Foster parents record medication, symptoms, and behavior</p>
          </div>
          <div className="bg-secondary/30 px-2.5 lg:px-4 py-10 md:min-h-60 h-auto sm:w-1/3 flex flex-col justify-start rounded-xl">
            <Dog className="sm:h-8 sm:w-8" />
            <h2 className="text-h2">Animal Profile Database</h2>
            <p>One complete source of truth for every animal</p>
          </div>
        </div>
      </section>
      {/* How it works */}
      <section className="min-h-[50vh]">
        <div className="flex flex-col items-center">
          <h2 className="text-h1 text-primary">How it works</h2>
          <div className="flex flex-col md:flex-row gap-3 mt-[10%]">
            <div className="relative inline-block">
              <img
                src={checkoutImage}
                alt="woman checking out supplies at an animal shelter"
                className="block w-[90%] md:w-full h-auto m-auto rounded-2xl"
                loading="lazy"
              />
              <div className="absolute bg-card/90 bottom-[10%] w-[90%] md:w-full min-h-50 px-2.5 py-5 left-[50%] md:left-0 translate-x-[-50%] md:translate-none">
                <h3 className="text-xl md:text-h2">1. Foster parent checks out supplies</h3>
                <p className="text-sm md:text-md">
                  Crates, food, and medications are logged with animal's name
                </p>
              </div>
            </div>
            <div className="relative inline-block">
              <img
                src={medicationImage}
                alt="woman giving medications to dog"
                className="block w-[90%] md:w-full h-auto m-auto rounded-2xl"
                loading="lazy"
              />
              <div className="absolute bg-card/90 bottom-[10%] w-[90%] md:w-full min-h-50 px-2.5 py-5 left-[50%] md:left-0 translate-x-[-50%] md:translate-none">
                <h3 className="text-xl md:text-h2">2. Medical care gets recorded daily</h3>
                <p className="text-sm md:text-md">
                  Foster parents log medications and behavior changes as they happen
                </p>
              </div>
            </div>
            <div className="relative inline-block">
              <img
                src={historyImage}
                alt="sitting dog"
                className="block w-[90%] md:w-full h-auto m-auto rounded-2xl"
                loading="lazy"
              />
              <div className="absolute bg-card/90 bottom-[10%] w-[90%] md:w-full min-h-50 px-2.5 py-5 left-[50%] md:left-0 translate-x-[-50%] md:translate-none">
                <h3 className="text-xl md:text-h2">3. Animal returns with complete history</h3>
                <p className="text-sm md:text-md">
                  The shelter has every detail needed to continue care without gaps
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
