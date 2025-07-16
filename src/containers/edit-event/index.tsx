import { wrapErrorBoundary } from '@/hooks';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Toggle from '../../components/Toggle';
import Select from '../../components/Select';
import { eventTypeOptions } from './newEventHelper';
import Button from '@/components/Button';
import ImageUpload from '@/components/ImageUpload';
import AttachFileButton from '@/components/AttachFileButton';
import CustomDatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import { useNavigate } from 'react-router-dom';
import backIcon from '@/assets/images/back.svg';
import {
  isAlphanumeric,
  maxLength,
  minLength,
  required,
  validateAll
} from '@/utils/validations';
import { useEvent } from '@/hooks/useEvents';
import { useParams } from 'react-router-dom';
import Loader from '@/components/Loader';
import ErrorScreen from '@/components/ErrorScreen';
import { useEditEvent } from '@/hooks/useEvents';
import { useUploadAttachment } from '@/hooks/useAttachments';
import { getDisplayImage } from '@/utils/utils';
import { countryOptions } from '../new-event/newEventHelper';
import styled from 'styled-components';
import TimezonePicker from '../../components/TimezonePicker';
// import AddressAutocomplete from '../../components/AddressAutocomplete';
import { countryTimezones } from '../../utils/timezones';
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
const EditEvent = ({ eventId: propEventId }) => {
  const { eventId: urlEventId } = useParams<{ eventId: string }>();
  const finalEventId = propEventId || urlEventId || '';
  const { data: event, isPending: loading, error } = useEvent(finalEventId);
  const { mutate: updateEvent, isPending } = useEditEvent();
  const uploadAttachmentMutation = useUploadAttachment();
  const navigate = useNavigate();
  const alwaysInclude = ['country','city','area','address']
  const [formData, setFormData] = useState({
    thumbnail: {
      value: null,
      valid: true,
      step: 1,
      error: '',
      changed: false
    },
    gallery: {
      value: [],
      valid: true,
      step: 1,
      error: '',
      changed: false
    },
    eventTitle: { value: '', valid: false, step: 1, error: '', changed: false },
    eventType: { value: '', valid: false, step: 1, error: '', changed: false },
    city: { value: '', valid: false, step: 1, error: '', changed: false },
    isHidden: { value: false, valid: true, step: 1, error: '', changed: false },
    area: { value: '', valid: false, step: 1, error: '', changed: false },
    address: { value: '', valid: false, step: 1, error: '', changed: false },
    description: {
      value: '',
      valid: false,
      step: 1,
      error: '',
      changed: false
    },
    allowPlusOne: {
      value: false,
      valid: true,
      step: 1,
      error: '',
      changed: false
    },
    plusOneCount: { value: 1, valid: true, step: 1, error: '', changed: false },
    requirePlusOneInfo: {
      value: false,
      valid: true,
      step: 1,
      error: '',
      changed: false
    },
    requireRsvpApproval: {
      value: false,
      valid: true,
      step: 1,
      error: '',
      changed: false
    },
    showEventToNonMembers: {
      value: false,
      valid: true,
      step: 1,
      error: '',
      changed: false
    },
    attachedFile: {
      value: null,
      valid: true,
      step: 1,
      error: '',
      changed: false
    },
    startDate: {
      value: new Date(),
      valid: true,
      step: 1,
      error: '',
      changed: false
    },
    endDate: {
      value: new Date(),
      valid: true,
      step: 1,
      error: '',
      changed: false
    },
    country: {
      value: '',
      valid: true,
      step: 1,
      error: ''
    },
    timezone: {
      value: '',
      valid: true,
      step: 1,
      error: ''
    }
  });
  const [step, setStep] = useState(1);
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData(prev => ({
        ...prev,
        thumbnail: { ...prev.thumbnail, value: event?.thumbnail || null },
        gallery: { ...prev.gallery, value: event?.gallery || null },
        eventTitle: { ...prev.eventTitle, value: event.title || '' },
        eventType: { ...prev.eventType, value: event.event_type || '' },
        city: { ...prev.city, value: event.city || '' },
        isHidden: { ...prev.isHidden, value: event.hide_address || false },
        area: { ...prev.area, value: event.area || '' },
        address: { ...prev.address, value: event.address || '' },
        description: { ...prev.description, value: event.description || '' },
        allowPlusOne: {
          ...prev.allowPlusOne,
          value: event.allow_plus_one || false
        },
        plusOneCount: {
          ...prev.plusOneCount,
          value: event.allow_plus_one_amount || 1
        },
        requirePlusOneInfo: {
          ...prev.requirePlusOneInfo,
          value: event.requires_plus_one_info || false
        },
        requireRsvpApproval: {
          ...prev.requireRsvpApproval,
          value: event.requires_rsvp_approval || false
        },
        showEventToNonMembers: {
          ...prev.showEventToNonMembers,
          value: event.show_to_non_members || false
        },
        attachedFile: {
          ...prev.attachedFile,
          value: event.attachments || null
        },
        startDate: {
          ...prev.startDate,
          value: event.start_date ? new Date(event.start_date) : new Date()
        },
        endDate: {
          ...prev.endDate,
          value: event.end_date ? new Date(event.end_date) : new Date()
        },
        country: {
          ...prev.country,
          value: event.country || ''
        },
        timezone: {
          ...prev.timezone,
          value: event.timezone || ''
        }
      }));
    }
  }, [event]);

  const handleInputChange = useCallback(
    (
      key: string,
      value: string | number | File | null | undefined | File[]
    ) => {
      let validationResult = { isValid: true, error: '' };

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
        //   validationResult = validateAll([required(value, 'Address')]);
        //   break;

        case 'description':
          validationResult = validateAll([
            isAlphanumeric(value, 'Description'),
            minLength(value, 1, 'Description')
          ]);
          break;

        // case 'eventType':
        // // case 'city':
        // // case 'country':
        //   validationResult = validateAll([
        //     required(value, key === 'eventType' ? 'Event type'),
        //     // required(value, 'Country')
        //   ]);
        //   break;

        case 'eventType':
          validationResult = validateAll([required(value, 'Event type')]);
          break;

        case 'startDate':
        case 'endDate':
          validationResult = validateAll([
            required(value, key === 'startDate' ? 'Start date' : 'End date')
          ]);
          break;

        case 'isHidden':
        case 'allowPlusOne':
        case 'requirePlusOneInfo':
        case 'requireRsvpApproval':
        case 'showEventToNonMembers':
          validationResult = { isValid: true, error: '' };
          break;

        case 'thumbnail':
        case 'gallery':
        case 'attachedFile':
        case 'host':
        case 'coHost':
        case 'sponsor1':
        case 'sponsor2':
        case 'plan':
        case 'plusOneCount':
          validationResult = { isValid: true, error: '' };
          break;

        case 'timezone':
          validationResult = validateAll([required(value, 'Timezone')]);
          break;

        default:
          validationResult = { isValid: false, error: 'Unknown field' };
      }

      setHasFormChanges(true);

      setFormData(prev => {
        if (key === 'country') {
          return {
            ...prev,
            country: {
              ...prev.country,
              value,
              valid: validationResult.isValid,
              error: validationResult.error,
              changed: true
            }
          };
        }

        return {
          ...prev,
          [key]: {
            ...prev[key],
            value,
            valid: validationResult.isValid,
            error: validationResult.error,
            changed: true
          }
        };
      });
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!Object.values(formData).some(field => field.changed)) {
      return;
    }
    let thumbnailId = null;
    const galleryIds: string[] = [];
    const attachmentIds: string[] = [];

    if (formData.thumbnail.changed && formData.thumbnail.value) {
      const thumbnailResponse = await uploadAttachmentMutation.mutateAsync(
        formData.thumbnail.value
      );
      if (thumbnailResponse?.id) {
        thumbnailId = thumbnailResponse.id;
      }
    }

    if (formData.gallery.changed && formData.gallery.value.length > 0) {
      const galleryUploads = await Promise.all(
        formData.gallery.value.map(file =>
          uploadAttachmentMutation.mutateAsync(file)
        )
      );
      galleryUploads.forEach(response => {
        if (response?.id) {
          galleryIds.push(response.id);
        }
      });
    }

    if (formData.attachedFile.changed && formData.attachedFile.value) {
      const attachmentResponse = await uploadAttachmentMutation.mutateAsync(
        formData.attachedFile.value
      );
      if (attachmentResponse?.id) {
        attachmentIds.push(attachmentResponse.id);
      }
    }

    const changedFields = Object.entries(formData).reduce(
      (acc, [key, field]) => {
        const mappings = {
          eventTitle: 'title',
          eventType: 'event_type',
          city: 'city',
          isHidden: 'hide_address',
          area: 'area',
          address: 'address',
          description: 'description',
          allowPlusOne: 'allow_plus_one',
          plusOneCount: 'allow_plus_one_amount',
          requirePlusOneInfo: 'requires_plus_one_info',
          requireRsvpApproval: 'requires_rsvp_approval',
          showEventToNonMembers: 'show_to_non_members',
          attachedFile: 'attachments',
          startDate: 'start_date',
          endDate: 'end_date',
          gallery: 'gallery',
          thumbnail: 'thumbnail',
          country: 'country',
          timezone: 'timezone'
        };

        const apiField = mappings[key];

        if (!apiField) return acc;

        if (alwaysInclude.includes(key)) {
          acc[apiField] = field.value || '';
          return acc;
        }

        if (apiField && field.changed) {
          if (key === 'startDate' || key === 'endDate') {
            acc[apiField] = field.value.toISOString();
          } else if (key === 'thumbnail') {
            acc[apiField] = thumbnailId;
          } else if (key === 'gallery') {
            acc[apiField] = galleryIds;
          } else if (key === 'attachedFile') {
            acc[apiField] = attachmentIds;
          } else if (key === 'timezone') {
            acc[apiField] = field.value;
          } else {
            acc[apiField] = field.value;
          }
        }
        return acc;
      },
      {}
    );

    try {
      await updateEvent({ eventId: finalEventId, eventData: changedFields });

      setFormData(prev => {
        const resetFields = {};
        Object.keys(prev).forEach(key => {
          resetFields[key] = {
            ...prev[key],
            changed: false
          };
        });
        return resetFields;
      });

      setHasFormChanges(false);
      setSaveStatus(true);

      setTimeout(() => {
        setSaveStatus(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  }, [formData, finalEventId, uploadAttachmentMutation, updateEvent]);

  const hasValidationErrors = useCallback(formData => {
    return Object.values(formData).some(field => {
      return (
        (field.changed && !field.valid) ||
        (field.error && field.error !== '') ||
        (field.value === '' &&
          [
            'eventTitle',
            'eventType',
            // 'city',
            // 'area',
            // 'address',
            // 'country',
            'timezone'
          ].includes(field.name))
      );
    });
  }, []);
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

  if (loading) {
    return (
      <Layout hideHeader={false} hideFooter={true}>
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <ErrorScreen
        title="Error loading event"
        message={error?.message || 'Event not found'}
        showHomeButton={true}
      />
    );
  }

  return (
    <Layout hideFooter hideHeader={false}>
      <section className="relative">
        <div className="w-[90%] max-w-[600px] mx-auto mb-[100px] px-[0px] pt-[2%] pb-[5%]">
          {step === 1 && (
            <div className="step-wrapper">
              <div className="relative">
                <BackButton onClick={() => navigate(`/view/${finalEventId}`)}>
                  <img src={backIcon} alt="Back to event details" />
                </BackButton>
                <ImageUpload
                  name="thumbnail"
                  onImageSelect={file => handleInputChange('thumbnail', file)}
                  onGalleryChange={files => handleInputChange('gallery', files)}
                  defaultValue={
                    event?.thumbnail?.length > 0
                      ? getDisplayImage(event.thumbnail)
                      : undefined
                  }
                  defaultGallery={
                    event?.gallery?.length > 0
                      ? event?.gallery?.map(image => ({
                          preview: getDisplayImage(image),
                          name: image
                        }))
                      : undefined
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
                onChange={e => handleInputChange('eventType', e.target.value)}
                isSearchable={false}
                value={formData.eventType.value}
                error={formData.eventType.error}
              />
              <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">
                Event details
              </h5>
              <div className="bg-[#2E2C2C] rounded-lg cursor-pointer mt-[10px] mb-[20px]">
                <div className="text-white">
                  <div className="flex justify-between p-3 items-center border-b-[0.25px] border-[#78788086]">
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
                  <div className="flex justify-between p-3 items-center">
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
                  <div className="flex justify-between p-3 items-center border-t-[0.25px] border-[#78788086]">
                    <div className="text-[16px]">Timezone*</div>
                    <div
                      className="flex items-center gap-2"
                      style={{ width: '60%', minWidth: '200px' }}
                    >
                      <TimezonePicker
                        value={formData.timezone.value}
                        onChange={timezone =>
                          handleInputChange('timezone', timezone)
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
                wrapperClassName="mb-[10px]"
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
                <Select
                  options={filteredCities}
                  placeholder="City"
                  name="city"
                  onChange={e => handleInputChange('city', e.target.value)}
                  isSearchable
                  isClearable
                  value={formData.city.value}
                  error={formData.city.error}
                />
              )}
              <Toggle
                label="Hide address?"
                value={formData.isHidden.value}
                withContent={false}
                onChange={value => handleInputChange('isHidden', value)}
                labelPosition="right"
                wrapperClassName="mt-[10px] mb-[20px]"
                error={formData.isHidden.error}
              />
              <Input
                label="Area"
                type="text"
                name="area"
                value={formData.area.value}
                onChange={e => handleInputChange('area', e.target.value)}
                style={{ margin: '20px 0 10px' }}
                error={formData.area.error}
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
                onChange={value => handleInputChange('allowPlusOne', value)}
                labelPosition="left"
                name="requirePlusOneInfo"
                showNumberInput={true}
                numberValue={formData.plusOneCount.value}
                onNumberChange={value =>
                  handleInputChange('plusOneCount', value)
                }
                minNumber={1}
                maxNumber={5}
                wrapperClassName="mb-[10px]"
                error={formData.requirePlusOneInfo.error}
              />
              <Toggle
                label="Require RSVP approval by host?"
                blockGrayLabelToggleField
                labelPosition="left"
                name="requireRsvpApproval"
                value={formData.requireRsvpApproval.value}
                onChange={value =>
                  handleInputChange('requireRsvpApproval', value)
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
                  handleInputChange('showEventToNonMembers', value)
                }
                wrapperClassName="mt-[10px] mb-[10px]"
                error={formData.showEventToNonMembers.error}
              />
              <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">
                Attachments
              </h5>
              <AttachFileButton
                onFileSelect={file => handleInputChange('attachedFile', file)}
                accept=".pdf,.doc,.docx,.txt"
                maxSize={5}
                wrapperClassName="mb-3"
              />

              {formData.attachedFile.value && (
                <div className="mb-4 flex items-center justify-between text-sm break-all text-gray-600">
                  <span>
                    Selected file:{' '}
                    {formData?.attachedFile?.value?.name || 'Attachment 1'}
                  </span>
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
                onClick={handleSubmit}
                backgroundColor={saveStatus ? '#008000' : '#EAEEDD'}
                textColor={saveStatus ? '#fff' : '#222222'}
                disabled={
                  (!hasFormChanges && !saveStatus) ||
                  isPending ||
                  hasValidationErrors(formData)
                }
              >
                {isPending
                  ? 'Saving...'
                  : saveStatus
                    ? 'Saved!'
                    : hasValidationErrors(formData)
                      ? 'Please fix validation errors'
                      : 'Save event'}
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};
export default wrapErrorBoundary(EditEvent);
