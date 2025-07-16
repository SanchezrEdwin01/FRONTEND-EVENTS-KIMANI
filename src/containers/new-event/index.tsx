import { wrapErrorBoundary } from '@/hooks';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Toggle from '../../components/Toggle';
import Select from '../../components/Select';
import LabeledSelect from '../../components/LabeledSelect';
import {
  eventTypeOptions,
  planOptions,
  currencyOptions,
  countryOptions
} from './newEventHelper';
import Button from '@/components/Button';
import { ChevronLeft } from 'styled-icons/boxicons-regular';
import ImageUpload from '@/components/ImageUpload';
import AttachFileButton from '@/components/AttachFileButton';
import {
  isAlphanumeric,
  maxLength,
  minLength,
  required,
  validateAll,
  ValidationResult
} from '@/utils/validations';
import { useCreateEvent } from '@/hooks/useEvents';
import { useUploadAttachment } from '@/hooks/useAttachments';
import SuccessStep from './steps/SuccessStep';
import { useQueryClient } from '@tanstack/react-query';
import { useServerMembers } from '@/hooks/useServerMembers';
import {
  createMemberList,
  saveFormatDate,
  roundDateToNearestHalfHour
} from '@/utils/utils';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import backIcon from '@/assets/images/back.svg';
import TimePicker from '@/components/TimePicker';
import CustomDatePicker from '@/components/DatePicker';
import TimezonePicker from '../../components/TimezonePicker';
// import AddressAutocomplete from '../../components/AddressAutocomplete';
import CustomDropdown from '../../components/CustomDropdown';
import { CreateEventPayload } from '@/types';
import { countryTimezones } from '../../utils/timezones';

interface FormField<T> {
  value: T;
  valid: boolean;
  step: number;
  error: string;
}

interface FormData {
  eventImage: FormField<File | null>;
  eventTitle: FormField<string>;
  eventType: FormField<string>;
  city: FormField<string>;
  isHidden: FormField<boolean>;
  area: FormField<string>;
  address: FormField<string>;
  description: FormField<string>;
  allowPlusOne: FormField<boolean>;
  plusOneCount: FormField<number>;
  requirePlusOneInfo: FormField<boolean>;
  requireRsvpApproval: FormField<boolean>;
  showEventToNonMembers: FormField<boolean>;
  attachedFile: FormField<File | null>;
  startDate: FormField<Date>;
  endDate: FormField<Date>;
  timezone: FormField<string>;
  host: FormField<string>;
  coHost: FormField<string>;
  sponsor1: FormField<string>;
  sponsor2: FormField<string>;
  tickets: FormField<string>;
  plan: FormField<string>;
  paymentType: FormField<string>;
  currency: FormField<string>;
  galleryImages: FormField<File[]>;
  country: FormField<string>;
  allowMultipleTickets: FormField<boolean>;
  processingFee: FormField<number>;
  memberPrice: FormField<string>;
  memberMaxTickets: FormField<number>;
  nonMemberPrice: FormField<string>;
  nonMemberMaxTickets: FormField<number>;
  memberCurrency: FormField<string>;
  nonMemberCurrency: FormField<string>;
}

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  font-family: var(--font-inter);
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: rgb(247, 247, 242);
  z-index: 3;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s ease;
  border: none;
  border-radius: 8px;
`;

const NewEvent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: createEventMutation, isPending } = useCreateEvent();
  const uploadAttachmentMutation = useUploadAttachment();
  const { data: memberList } = useServerMembers(true);

  const [formData, setFormData] = useState<FormData>({
    eventImage: { value: null, valid: true, step: 1, error: '' },
    eventTitle: { value: '', valid: false, step: 1, error: '' },
    eventType: { value: '', valid: false, step: 1, error: '' },
    city: { value: '', valid: true, step: 1, error: '' },
    isHidden: { value: false, valid: true, step: 1, error: '' },
    area: { value: '', valid: true, step: 1, error: '' },
    address: { value: '', valid: true, step: 1, error: '' },
    description: { value: '', valid: true, step: 1, error: '' },
    allowPlusOne: { value: false, valid: true, step: 1, error: '' },
    plusOneCount: { value: 1, valid: true, step: 1, error: '' },
    requirePlusOneInfo: { value: false, valid: true, step: 1, error: '' },
    requireRsvpApproval: { value: false, valid: true, step: 1, error: '' },
    showEventToNonMembers: { value: false, valid: true, step: 1, error: '' },
    attachedFile: { value: null, valid: true, step: 1, error: '' },
    startDate: {
      value: roundDateToNearestHalfHour(new Date()),
      valid: true,
      step: 1,
      error: ''
    },
    endDate: {
      value: roundDateToNearestHalfHour(new Date()),
      valid: true,
      step: 1,
      error: ''
    },
    timezone: { value: '', valid: true, step: 1, error: '' },
    host: { value: '', valid: true, step: 2, error: '' },
    coHost: { value: '', valid: true, step: 2, error: '' },
    sponsor1: { value: '', valid: true, step: 2, error: '' },
    sponsor2: { value: '', valid: true, step: 2, error: '' },
    tickets: { value: '', valid: true, step: 2, error: '' },
    plan: { value: 'free', valid: true, step: 2, error: '' },
    paymentType: { value: '', valid: true, step: 2, error: '' },
    currency: { value: 'USD', valid: true, step: 2, error: '' },
    galleryImages: { value: [], valid: true, step: 1, error: '' },
    country: { value: '', valid: true, step: 1, error: '' },
    allowMultipleTickets: { value: false, valid: true, step: 1, error: '' },
    processingFee: { value: 0, valid: true, step: 2, error: '' },
    memberPrice: { value: '0.00', valid: true, step: 2, error: '' },
    memberMaxTickets: { value: 0, valid: true, step: 2, error: '' },
    nonMemberPrice: { value: '0.00', valid: true, step: 2, error: '' },
    nonMemberMaxTickets: { value: 0, valid: true, step: 2, error: '' },
    memberCurrency: { value: 'USD', valid: true, step: 2, error: '' },
    nonMemberCurrency: { value: 'USD', valid: true, step: 2, error: '' }
  });

  const [allFieldsValidStep1, setAllFieldsValidStep1] = useState(false);
  const [allFieldsValidStep2, setAllFieldsValidStep2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEvent, setNewEvent] = useState(null);

  useEffect(() => {
    const requiredFieldsStep1 = [
      'eventTitle',
      'eventType',
      // 'country',
      // 'city',
      // 'area',
      // 'address',
      'startDate',
      'endDate',
      'timezone'
    ];

    const isAllValidStep1 = requiredFieldsStep1.every(field => {
      const fieldData = formData[field];
      if (!fieldData) return false;

      if (field === 'startDate' || field === 'endDate') {
        return true;
      }

      if (field === 'eventType' || field === 'city' || field === 'country') {
        return !!fieldData.value;
      }

      return fieldData.valid && fieldData.value;
    });

    const requiredFieldsStep2 = ['host'];

    const isAllValidStep2 = requiredFieldsStep2.every(field => {
      const fieldData = formData[field];
      return fieldData && !!fieldData.value;
    });

    setAllFieldsValidStep1(isAllValidStep1);
    setAllFieldsValidStep2(isAllValidStep2);
  }, [formData]);
  const [step, setStep] = useState(1);

  const handleInputChange = useCallback(
    (key: string, value: string | number | File | null | undefined) => {
      let validationResult: ValidationResult = { isValid: true };
      if (typeof value === 'string') {
        switch (key) {
          case 'eventTitle':
            validationResult = validateAll([
              required(value, 'Event title'),
              isAlphanumeric(value, 'Event title'),
              maxLength(value, 50, 'Event title')
            ]);
            break;

          // case 'address':
          // case 'area':
          // case 'city':
          // case 'country':
          //   break;

          case 'description':
            if (value) {
              validationResult = validateAll([
                minLength(value, 10, 'Description')
              ]);
            }
            break;

          case 'eventType':
          case 'host':
            validationResult = validateAll([
              required(value, key === 'eventType' ? 'Event type' : 'Host')
            ]);
            break;
        }
      }

      setFormData(prev => {
        if (key === 'country') {
          return {
            ...prev,
            country: {
              value: value as string,
              valid: validationResult?.isValid || false,
              step: prev.country.step,
              error: validationResult?.error || ''
            }
          };
        }

        return {
          ...prev,
          [key]: {
            value,
            valid: validationResult.isValid,
            step: prev[key].step,
            error: validationResult.error || ''
          }
        };
      });
    },
    []
  );

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      let thumbnailId: string = null;
      const galleryIds: string[] = [];
      const attachmentIds: string[] = [];

      if (formData.eventImage.value) {
        const imageResponse = await uploadAttachmentMutation.mutateAsync(
          formData.eventImage.value
        );
        if (imageResponse?.id) {
          thumbnailId = imageResponse.id;
        }
      }

      if (formData.galleryImages.value.length > 0) {
        const galleryUploads = await Promise.all(
          formData.galleryImages.value.map(file =>
            uploadAttachmentMutation.mutateAsync(file)
          )
        );
        await Promise.all(
          galleryUploads.map(response => {
            if (response?.id) {
              galleryIds.push(response.id);
            }
          })
        );
      }

      if (formData.attachedFile.value) {
        const attachmentResponse = await uploadAttachmentMutation.mutateAsync(
          formData.attachedFile.value
        );
        if (attachmentResponse?.id) {
          attachmentIds.push(attachmentResponse.id);
        }
      }

      const eventData: CreateEventPayload = {
        title: formData.eventTitle.value,
        event_type: 'MembersEvent',
        start_date: saveFormatDate(formData.startDate.value),
        end_date: saveFormatDate(formData.endDate.value),
        ...(formData.city.value      && { city: formData.city.value }),
        ...(formData.country.value   && { country: formData.country.value }),
        ...(formData.area.value      && { area: formData.area.value }),
        ...(formData.address.value   && { address: formData.address.value }),
        gallery: galleryIds,
        thumbnail: thumbnailId,
        hosts: [],
        sponsors: [],
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
        },
        timezone: formData.timezone.value
      };

      if (formData.isHidden.value) eventData.hide_address = true;
      if (formData.allowPlusOne.value) {
        eventData.allow_plus_one = true;
        eventData.allow_plus_one_amount = formData.plusOneCount.value;
      }
      if (formData.requirePlusOneInfo.value)
        eventData.requires_plus_one_info = true;
      if (formData.requireRsvpApproval.value)
        eventData.requires_rsvp_approval = true;
      if (formData.showEventToNonMembers.value)
        eventData.show_to_non_members = true;

      const hosts = [formData.host.value, formData.coHost.value].filter(
        Boolean
      );
      if (hosts.length > 0) eventData.hosts = hosts;

      const sponsors = [
        formData.sponsor1.value,
        formData.sponsor2.value
      ].filter(Boolean);
      if (sponsors.length > 0) eventData.sponsors = sponsors;

      if (galleryIds.length > 0) eventData.gallery = galleryIds;
      if (attachmentIds.length > 0) eventData.attachments = attachmentIds;

      if (formData.description.value) {
        eventData.description = formData.description.value;
      }
      if (formData.paymentType.value) {
        eventData.payment_type = formData.paymentType.value;
      }

      createEventMutation(eventData, {
        onSuccess: response => {
          if (response && response?._id) {
            queryClient.setQueryData(
              ['events'],
              (oldData: Event[] | undefined) => {
                return oldData ? [...oldData, response] : [response];
              }
            );
            setNewEvent(response);
          }
        },
        onError: error => {
          console.error('Error creating event:', error);
        }
      });
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (newEvent) {
      setStep(3);
    }
  }, [newEvent]);

  const hostOptions = useMemo(
    () =>
      createMemberList(memberList).map(member => ({
        label: member.username,
        value: member._id
      })),
    [memberList]
  );

  const { filteredCities } = useMemo(() => {
    if (!formData.country.value) {
      return {
        filteredCities: []
      };
    }

    const selectedCountry = countryOptions.find(
      country => country.country === formData.country.value
    );

    if (!selectedCountry) {
      return {
        filteredCities: []
      };
    }

    const cities = selectedCountry.cities
      .map(city => ({
        label: city.city,
        value: city.city
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return {
      filteredCities: cities
    };
  }, [formData.country.value, countryOptions]);

  return (
    <Layout hideHeader={false} hideFooter>
      <section className="relative">
        <div className="w-[90%] max-w-[600px] mx-auto mb-[100px] px-[0px] pt-[2%] pb-[5%]">
          {step === 1 && (
            <div className="step-wrapper">
              <div className="relative">
                <BackButton onClick={() => navigate('/')}>
                  <img src={backIcon} alt="Back to home" />
                </BackButton>
                <ImageUpload
                  name="eventImage"
                  onImageSelect={file => handleInputChange('eventImage', file)}
                  onGalleryChange={files =>
                    handleInputChange('galleryImages', files)
                  }
                  defaultValue={
                    formData.eventImage.value
                      ? URL.createObjectURL(formData.eventImage.value)
                      : undefined
                  }
                  defaultGallery={
                    formData?.galleryImages?.value &&
                    formData.galleryImages.value?.length > 0 &&
                    formData.galleryImages.value?.map(image => ({
                      preview: URL.createObjectURL(image),
                      name: image.name
                    }))
                  }
                />
              </div>

              <Input
                label="Event Title*"
                type="text"
                name="eventTitle"
                value={formData.eventTitle.value}
                onChange={e => handleInputChange('eventTitle', e.target.value)}
                style={{ margin: '20px 0 10px' }}
                className="text-[20px] mb-[5px]"
                error={formData.eventTitle.error}
              />
              <Select
                options={eventTypeOptions}
                placeholder="Event type*"
                name="eventType"
                onClear
                onChange={e => handleInputChange('eventType', e.target.value)}
                isSearchable={false}
                value={formData.eventType.value}
                error={formData.eventType.error}
              />
              <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">
                Event details
              </h5>
              <div className="bg-[#2E2C2C] rounded-lg cursor-pointer mt-[10px] mb-[20px]">
                <div className="text-white p-1">
                  <div className="flex justify-between p-2 items-center border-b-[0.25px] border-[#78788086]">
                    <div className="text-[16px]">Start*</div>
                    <div className="flex items-center">
                      <CustomDatePicker
                        value={formData.startDate.value}
                        onChange={date => handleInputChange('startDate', date)}
                        isStartDate={true}
                        endDate={formData.endDate.value}
                        onEndDateChange={date =>
                          handleInputChange('endDate', date)
                        }
                      />
                      <span className="mr-[8px]">at</span>
                      <TimePicker
                        value={formData.startDate.value}
                        onChange={date => {
                          const newDate = new Date(formData.startDate.value);
                          newDate.setHours(date.getHours());

                          const currentMinutes = date.getMinutes();
                          const roundedMinutes = currentMinutes < 30 ? 0 : 30;
                          newDate.setMinutes(roundedMinutes);

                          newDate.setSeconds(0);

                          handleInputChange('startDate', newDate);
                        }}
                        isStartTime={true}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between p-2 items-center border-b-[0.25px] border-[#78788086]">
                    <div className="text-[16px]">End*</div>
                    <div className="flex items-center">
                      <CustomDatePicker
                        value={formData.endDate.value}
                        onChange={date => handleInputChange('endDate', date)}
                        startDate={formData.startDate.value}
                        onStartDateChange={date =>
                          handleInputChange('startDate', date)
                        }
                      />
                      <span className="mr-[8px]">at</span>
                      <TimePicker
                        value={formData.endDate.value}
                        onChange={date => {
                          const newDate = new Date(formData.endDate.value);
                          newDate.setHours(date.getHours());

                          const currentMinutes = date.getMinutes();
                          const roundedMinutes = currentMinutes < 30 ? 0 : 30;
                          newDate.setMinutes(roundedMinutes);

                          newDate.setSeconds(0);

                          handleInputChange('endDate', newDate);
                        }}
                        startTime={formData.startDate.value}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between p-2 items-center">
                    <div className="text-[16px]">Timezone*</div>
                    <div
                      className="flex items-center gap-2"
                      style={{ width: '60%', minWidth: '100px' }}
                    >
                      <TimezonePicker
                        value={formData.timezone.value}
                        onChange={timezone =>
                          handleInputChange('timezone', timezone)
                        }
                        startDate={formData.startDate.value}
                        endDate={formData.endDate.value}
                        onStartDateChange={date =>
                          handleInputChange('startDate', date)
                        }
                        onEndDateChange={date =>
                          handleInputChange('endDate', date)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Input
                label="Address (optional)"
                name="address"
                value={formData.address.value}
                onChange={e => handleInputChange('address', e.target.value)}
                error={formData.address.error}
              />
              <Select
                options={countryOptions.map(country => ({
                  label: country.country,
                  value: country.country
                }))}
                placeholder="Country"
                name="country"
                onChange={e => {
                  handleInputChange('country', e.target.value);
                }}
                isSearchable
                isClearable
                value={formData.country.value}
                error={formData.country.error}
              />
              {formData.country.value && (
                <CustomDropdown
                  wrapperClassName="mt-[10px] mb-[10px]"
                  options={filteredCities}
                  placeholder={'City'}
                  name="city"
                  onChange={value => handleInputChange('city', value)}
                  value={formData.city.value}
                  error={formData.city.error}
                  isDisabled={!formData.country.value}
                />
              )}
              <Input
                label="Area"
                type="text"
                name="area"
                value={formData.area.value}
                onChange={e => handleInputChange('area', e.target.value)}
                style={{ margin: '20px 0 10px' }}
                error={formData.area.error}
              />

              <Toggle
                label="Hide address?"
                value={formData.isHidden.value}
                onChange={value => handleToggleChange('isHidden', value)}
                labelPosition="right"
                wrapperClassName="mt-[10px] mb-[20px]"
                error={formData.isHidden.error}
                name="isHidden"
                withContent={false}
              />
              <Input
                label="Description"
                type="textarea"
                name="description"
                value={formData.description.value}
                onChange={e => handleInputChange('description', e.target.value)}
                style={{ margin: '10px 0' }}
                error={formData.description.error}
              />
              <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">
                Settings
              </h5>
              <Toggle
                label="Allow +1?"
                description="Choose how many guests one person is allowed to bring"
                value={formData.allowPlusOne.value}
                blockGrayLabelToggleField
                onChange={value => handleToggleChange('allowPlusOne', value)}
                labelPosition="left"
                name="allowPlusOne"
                showNumberInput={true}
                numberValue={formData.plusOneCount.value}
                onNumberChange={value =>
                  handleInputChange('plusOneCount', value)
                }
                minNumber={1}
                maxNumber={5}
                wrapperClassName="mb-[10px]"
                error={formData.allowPlusOne.error}
              />
              <Toggle
                label="Require +1's Full information?"
                blockGrayLabelToggleField
                labelPosition="left"
                name="requirePlusOneInfo"
                value={formData.requirePlusOneInfo.value}
                onChange={value =>
                  handleToggleChange('requirePlusOneInfo', value)
                }
                wrapperClassName="mt-[10px] mb-[10px]"
                error={formData.requirePlusOneInfo.error}
                checked={formData.requirePlusOneInfo.value}
              />
              <Toggle
                label="Require RSVP approval by host?"
                blockGrayLabelToggleField
                labelPosition="left"
                name="requireRsvpApproval"
                value={formData.requireRsvpApproval.value}
                onChange={value =>
                  handleToggleChange('requireRsvpApproval', value)
                }
                wrapperClassName="mt-[10px] mb-[10px]"
                error={formData.requireRsvpApproval.error}
              />
              <Toggle
                label="Show event to non-members?"
                blockGrayLabelToggleField
                labelPosition="left"
                name="showEventToNonMembers"
                value={formData.showEventToNonMembers.value}
                onChange={value =>
                  handleToggleChange('showEventToNonMembers', value)
                }
                wrapperClassName="mt-[10px] mb-[10px]"
                error={formData.showEventToNonMembers.error}
              />
              <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">
                Attachments
              </h5>
              <AttachFileButton
                wrapperClassName="mb-3"
                onFileSelect={file => handleInputChange('attachedFile', file)}
                accept=".pdf,.doc,.docx,.txt"
                maxSize={5}
              />

              {formData.attachedFile.value && (
                <div className="mb-4 flex items-center justify-between text-sm break-all text-gray-600">
                  <span>Selected file: {formData.attachedFile.value.name}</span>
                  <button
                    onClick={() => handleInputChange('attachedFile', null)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              )}

              <Button
                disabled={!allFieldsValidStep1}
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="step-wrapper flex flex-col">
              <div className="flex justify-between items-center">
                <Button
                  className="flex items-center"
                  backgroundColor="transparent"
                  textColor="#EAEEDD"
                  fontSize="14px"
                  fontWeight={400}
                  lineHeight="1.2"
                  padding="6px 12px 6px 0"
                  width="auto"
                  onClick={() => setStep(1)}
                >
                  <ChevronLeft size={32} />
                  Back
                </Button>
                <Button
                  className="flex items-center"
                  backgroundColor="transparent"
                  textColor="#EAEEDD"
                  fontSize="14px"
                  fontWeight={400}
                  lineHeight="1.2"
                  padding="6px 0 6px 12px"
                  width="auto"
                  onClick={handleSubmit}
                >
                  Add later
                </Button>
              </div>
              <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">
                Manager
              </h5>
              <Select
                wrapperClassName="mb-[10px]"
                options={hostOptions}
                placeholder={'Host*'}
                name="host"
                onChange={e => handleInputChange('host', e.target.value)}
                value={formData.host.value}
                error={formData.host.error}
                isSearchable
                isClearable
              />
              <Select
                wrapperClassName="mb-[10px]"
                options={hostOptions}
                placeholder="Co-host*"
                name="coHost"
                onChange={e => {
                  handleInputChange('coHost', e.target.value);
                }}
                isSearchable
                isClearable
                value={formData.coHost.value}
                error={formData.coHost.error}
              />
              <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">
                Sponsor
              </h5>
              <Select
                wrapperClassName="mb-[10px]"
                options={hostOptions}
                placeholder="Sponsor 1*"
                name="sponsor1"
                onChange={e => {
                  handleInputChange('sponsor1', e.target.value);
                }}
                isSearchable
                isClearable
                value={formData.sponsor1.value}
                error={formData.sponsor1.error}
              />
              <Select
                wrapperClassName="mb-[10px]"
                options={hostOptions}
                placeholder="Sponsor 2*"
                name="sponsor2"
                onChange={e => {
                  handleInputChange('sponsor2', e.target.value);
                }}
                isSearchable
                isClearable
                value={formData.sponsor2.value}
                error={formData.sponsor2.error}
              />
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
                              const value = parseFloat(e.target.value).toFixed(
                                2
                              );
                              handleInputChange('memberPrice', value);
                            }}
                            style={{ maxWidth: '100px' }}
                            className="text-center !bg-[#373637]"
                          />

                          <LabeledSelect
                            options={currencyOptions}
                            value={formData.memberCurrency.value}
                            onChange={e =>
                              handleInputChange(
                                'memberCurrency',
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
                              const value = parseFloat(e.target.value).toFixed(
                                2
                              );
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
                    adjustHeight={true}
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
              <Button
                onClick={handleSubmit}
                disabled={!allFieldsValidStep1 || isLoading || isPending}
                className={`mt-[20px]`}
                isLoading={isLoading || isPending}
              >
                {isLoading || isPending ? 'Creating...' : 'Create event'}
              </Button>
            </div>
          )}

          {step === 3 && newEvent && <SuccessStep event={newEvent} />}
        </div>
      </section>
    </Layout>
  );
};
export default wrapErrorBoundary(NewEvent);
