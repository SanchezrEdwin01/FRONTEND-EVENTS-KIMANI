import * as React from 'react';
import NavigationLayout from '@/components/NavigationLayout';
import Input from '@/components/Input';
import LabeledSelect from '@/components/LabeledSelect';
import Button from '@/components/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useEditEvent } from '@/hooks/useEvents';
import Separator from '@/components/Separator';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';
import {
  currencyOptions,
  planOptions
} from '@/containers/new-event/newEventHelper';
import { useEvent } from '@/hooks/useEvents';
export default function ManagePayments() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError
  } = useEvent(eventId);
  const { mutate: editEventMutation, isPending } = useEditEvent();
  const [formData, setFormData] = useState({
    tickets: { value: '', valid: true, step: 2, error: '' },
    plan: { value: 'free', valid: true, step: 2, error: '' },
    paymentType: { value: '', valid: true, step: 2, error: '' },
    allowMultipleTickets: { value: false, valid: true, step: 1, error: '' },
    processingFee: { value: 0, valid: true, step: 2, error: '' },
    memberPrice: { value: '0.00', valid: true, step: 2, error: '' },
    memberMaxTickets: { value: 0, valid: true, step: 2, error: '' },
    nonMemberPrice: { value: '0.00', valid: true, step: 2, error: '' },
    nonMemberMaxTickets: { value: 0, valid: true, step: 2, error: '' },
    memberCurrency: { value: 'USD', valid: true, step: 2, error: '' },
    nonMemberCurrency: { value: 'USD', valid: true, step: 2, error: '' }
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        tickets: {
          value: event.ticket_config.tickets || '',
          valid: true,
          step: 2,
          error: ''
        },
        plan: {
          value: event.ticket_config.is_paid == true ? 'paid' : 'free',
          valid: true,
          step: 2,
          error: ''
        },
        paymentType: {
          value: event.payment_type || '',
          valid: true,
          step: 2,
          error: ''
        },
        allowMultipleTickets: {
          value: event.ticket_config.allow_multiple_tickets || false,
          valid: true,
          step: 1,
          error: ''
        },
        processingFee: {
          value: event.ticket_config.processing_fee_percentage || 0,
          valid: true,
          step: 2,
          error: ''
        },
        memberPrice: {
          value: event.ticket_config.member_price || '0.00',
          valid: true,
          step: 2,
          error: ''
        },
        memberMaxTickets: {
          value: event.ticket_config.member_max_tickets || 0,
          valid: true,
          step: 2,
          error: ''
        },
        nonMemberPrice: {
          value: event.ticket_config.non_member_price || '0.00',
          valid: true,
          step: 2,
          error: ''
        },
        nonMemberMaxTickets: {
          value: event.ticket_config.non_member_max_tickets || 0,
          valid: true,
          step: 2,
          error: ''
        },
        memberCurrency: {
          value: event.ticket_config.member_price_currency || 'USD',
          valid: true,
          step: 2,
          error: ''
        },
        nonMemberCurrency: {
          value: event.ticket_config.non_member_price_currency || 'USD',
          valid: true,
          step: 2,
          error: ''
        }
      });
    }
  }, [event]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        value,
        valid: true,
        step: prev[key].step,
        error: ''
      }
    }));
  };

  const handleSelectChange = (key: string) => (e: any) => {
    const value = e?.target?.value || e?.value || '';
    handleInputChange(key, value);
  };

  const handleToggleChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        value,
        valid: true,
        step: prev[key].step,
        error: ''
      }
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    try {
      const eventData = {
        ticket_config: {
          is_paid: formData.plan.value === 'paid',
          allow_multiple_tickets: formData.allowMultipleTickets.value,
          ...(formData.plan.value === 'paid' && {
            member_price: formData.memberPrice.value,
            member_max_tickets: Number.parseInt(
              formData.memberMaxTickets.value
            ),
            non_member_price: formData.nonMemberPrice.value,
            non_member_max_tickets: Number.parseInt(
              formData.nonMemberMaxTickets.value
            ),
            processing_fee_percentage: String(formData.processingFee.value),
            member_price_currency: formData.memberCurrency.value,
            non_member_price_currency: formData.nonMemberCurrency.value
          })
        }
      };
      if (formData.paymentType.value) {
        eventData.payment_type = formData.paymentType.value;
      }

      editEventMutation(
        { eventId, eventData },
        {
          onSuccess: () => {
            setIsSuccess(true);
            setError(null);
            setIsLoading(false);
          },
          onError: error => {
            setError(
              'An error occurred while saving changes. Please try again.'
            );
            console.error('Error editing event:', error);
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      setError('An error occurred while saving changes. Please try again.');
      console.error('Error editing event:', error);
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <NavigationLayout
        backUrl={`/view/${eventId}`}
        title="Success"
        onBack={() => navigate(`/view/${eventId}`)}
      >
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
                  Payments Updated Successfully!
                </h3>
                <p className="text-gray-400 text-base font-normal font-['Hanken_Grotesk']">
                  Payment configuration updated successfully.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={() => window.history.back()}
                className="w-full bg-transparent border border-[#2e2c2c] hover:bg-[#2e2c2c]/20 text-white"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </NavigationLayout>
    );
  }

  return (
    <NavigationLayout
      backUrl={`/view/${eventId}`}
      title="Manage Payments"
      onBack={() => navigate(`/view/${eventId}`)}
    >
      <section className="relative">
        <div className="flex flex-col flex-1 w-full">
          <div className="w-[90%] max-w-[600px] mx-auto mb-[100px] px-[0px] pt-[2%] pb-[5%]">
            <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">
              Tickets
            </h5>
            <Select
              options={planOptions}
              placeholder="Choose your plan..."
              name="plan"
              onChange={handleSelectChange('plan')}
              isSearchable={false}
              value={formData.plan.value}
              error={formData.plan.error}
              wrapperClassName="mb-[10px]"
            />
            {formData.plan.value === 'paid' && (
              <>
                <h5 className="text-[18px] pl-[2px] mt-[16px] mb-1">
                  Payment link
                </h5>
                <Input
                  label="Payment Type"
                  type="text"
                  name="paymentType"
                  value={formData.paymentType.value}
                  onChange={e =>
                    handleInputChange('paymentType', e.target.value)
                  }
                  placeholder="Enter payment link"
                  style={{ margin: '10px 0' }}
                  error={formData.paymentType.error}
                />
                <h5 className="text-[18px] pl-[2px] mb-1">
                  Member ticket price
                </h5>
                <div className="bg-[#2E2C2C] rounded-lg cursor-pointer mt-[10px] mb-1">
                  <div className="text-white p-1">
                    <div className="flex justify-between p-2 items-center border-b-[0.25px] border-[#78788086]">
                      <div className="text-[16px]">Price</div>
                      <div className="flex items-center !bg-[#7878801F] rounded-lg">
                        <Input
                          type="text"
                          name="memberPrice"
                          value={formData.memberPrice.value}
                          onChange={e => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                              handleInputChange('memberPrice', value);
                            }
                          }}
                          onBlur={e => {
                            const value = parseFloat(e.target.value).toFixed(2);
                            handleInputChange('memberPrice', value);
                          }}
                          style={{ maxWidth: '100px' }}
                          className="text-center !bg-[#373637]"
                        />

                        <LabeledSelect
                          options={currencyOptions}
                          value={formData.memberCurrency.value}
                          onChange={e =>
                            handleInputChange('memberCurrency', e.target.value)
                          }
                          backgroundColor="#373637"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between p-2 items-center border-b-[0] border-[#78788086]">
                      <div className="text-[16px]">Max tickets</div>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          name="memberMaxTickets"
                          value={formData.memberMaxTickets.value}
                          style={{ maxWidth: '48px' }}
                          className="!bg-[#7878801F] text-center"
                          onChange={e =>
                            handleInputChange(
                              'memberMaxTickets',
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">
                  Non-member ticket price
                </h5>
                <div className="bg-[#2E2C2C] rounded-lg cursor-pointer mb-[20px]">
                  <div className="text-white p-1">
                    <div className="flex justify-between p-2 items-center border-b-[0.25px] border-[#78788086]">
                      <div className="text-[16px]">Price</div>
                      <div className="flex items-center !bg-[#7878801F] rounded-lg">
                        <Input
                          type="text"
                          name="nonMemberPrice"
                          value={formData.nonMemberPrice.value}
                          onChange={e => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                              handleInputChange('nonMemberPrice', value);
                            }
                          }}
                          onBlur={e => {
                            const value = parseFloat(e.target.value).toFixed(2);
                            handleInputChange('nonMemberPrice', value);
                          }}
                          style={{ maxWidth: '100px' }}
                          className="text-center !bg-[#373637]"
                        />

                        <LabeledSelect
                          options={currencyOptions}
                          value={formData.nonMemberCurrency.value}
                          onChange={e =>
                            handleInputChange(
                              'nonMemberCurrency',
                              e.target.value
                            )
                          }
                          backgroundColor="#373637"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between p-2 items-center border-b-[0] border-[#78788086]">
                      <div className="text-[16px]">Max tickets</div>
                      <div className="flex items-center">
                        <Input
                          type="text"
                          name="nonMemberMaxTickets"
                          value={formData.nonMemberMaxTickets.value}
                          style={{ maxWidth: '48px' }}
                          className="!bg-[#7878801F] text-center"
                          onChange={e =>
                            handleInputChange(
                              'nonMemberMaxTickets',
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Toggle
                  label="Allow purchase of multiple tickets?"
                  blockGrayLabelToggleField
                  labelPosition="left"
                  name="allowMultipleTickets"
                  value={formData.allowMultipleTickets.value}
                  onChange={value =>
                    handleToggleChange('allowMultipleTickets', value)
                  }
                  wrapperClassName="mb-[10px]"
                  error={formData.allowMultipleTickets.error}
                />
                <LabeledSelect
                  label="Processing fee"
                  options={[
                    { label: '5%', value: '5' },
                    { label: '10%', value: '10' },
                    { label: '15%', value: '15' },
                    { label: '20%', value: '20' },
                    { label: '25%', value: '25' },
                    { label: '30%', value: '30' },
                    { label: '35%', value: '35' },
                    { label: '40%', value: '40' },
                    { label: '45%', value: '45' },
                    { label: '50%', value: '50' },
                    { label: '55%', value: '55' },
                    { label: '60%', value: '60' },
                    { label: '65%', value: '65' },
                    { label: '70%', value: '70' },
                    { label: '75%', value: '75' },
                    { label: '80%', value: '80' },
                    { label: '85%', value: '85' },
                    { label: '90%', value: '90' },
                    { label: '95%', value: '95' },
                    { label: '100%', value: '100' }
                  ]}
                  value={formData.processingFee.value}
                  backgroundColor="#2e2c2c"
                  onChange={value =>
                    handleInputChange('processingFee', value === 'true')
                  }
                  blockGrayLabelToggleField
                  labelPosition="left"
                />
              </>
            )}
          </div>
          <div className="w-full z-2 fixed bottom-0 left-0 bg-[#151616]">
            <Separator noMargin />
            <div className="w-[90%] max-w-[600px] mx-auto pb-4">
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <Button
                onClick={handleSubmit}
                disabled={isLoading || isPending}
                className={`mt-[20px]`}
                isLoading={isLoading || isPending}
              >
                {isLoading || isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </NavigationLayout>
  );
}
