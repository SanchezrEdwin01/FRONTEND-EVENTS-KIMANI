import * as React from 'react';
import NavigationLayout from '@/components/NavigationLayout';
import { Event } from '@/types/event';
import { useMemo, useState } from 'react';
import Listing from './steps/Listing';
import AddHosts from './steps/AddHosts';
import { useParams } from 'react-router-dom';
import { useEvent } from '@/hooks/useEvents';
import Button from '@/components/Button';
export default function ManageHosts({ event }: { event: Event }) {
  const { eventId } = useParams();
  const { data: eventData } = useEvent(eventId);
  const [step, setStep] = useState<'listing' | 'add' | 'success'>('listing');
  return (
    <NavigationLayout
      backUrl={`/view/${eventId}`}
      title="Hosts"
      onBack={step === 'add' ? () => setStep('listing') : null}
    >
      <div className="flex flex-col flex-1 w-full">
        {step === 'listing' && (
          <Listing handleAddHosts={() => setStep('add')} event={eventData} />
        )}
        {step === 'add' && (
          <AddHosts
            associates={eventData?.hosts}
            onSuccess={() => setStep('success')}
          />
        )}
        {step === 'success' && (
          <div className="flex-1 overflow-hidden p-4">
            <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-white text-xl font-semibold font-['Hanken_Grotesk'] mb-2">
                    Invites Sent Successfully!
                  </h3>
                  <p className="text-gray-400 text-base font-normal font-['Hanken_Grotesk']">
                    All invites have been sent to the selected members.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={() => setStep('listing')}
                  className="w-full bg-[#2e2c2c] hover:bg-[#3e3c3c] text-white"
                >
                  Add More Hosts
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  className="w-full bg-transparent border border-[#2e2c2c] hover:bg-[#2e2c2c]/20 text-white"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}
