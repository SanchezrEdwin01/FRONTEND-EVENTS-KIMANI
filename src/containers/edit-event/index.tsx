import { wrapErrorBoundary } from '@/hooks';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Toggle from '@/components/Toggle';
import Select from '@/components/Select';
import { eventTypeOptions } from './newEventHelper';
import Button from '@/components/Button';
import ImageUpload from '@/components/ImageUpload';
import AttachFileButton from '@/components/AttachFileButton';
import CustomDatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import { useNavigate, useParams } from 'react-router-dom';
import backIcon from '@/assets/images/back.svg';
import {
  isAlphanumeric,
  maxLength,
  minLength,
  required,
  validateAll
} from '@/utils/validations';
import { useEvent, useEditEvent } from '@/hooks/useEvents';
import Loader from '@/components/Loader';
import ErrorScreen from '@/components/ErrorScreen';
import { useUploadAttachment } from '@/hooks/useAttachments';
import { getDisplayImage } from '@/utils/utils';
import { countryOptions } from '@/containers/new-event/newEventHelper';
import styled from 'styled-components';
import TimezonePicker from '@/components/TimezonePicker';

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

type FieldState<T = any> = {
  value: T;
  valid: boolean;
  step: number;
  error: string;
  changed?: boolean;
};

const EditEvent = ({ eventId: propEventId }: { eventId?: string }) => {
  const { eventId: urlEventId } = useParams<{ eventId: string }>();
  const finalEventId = propEventId || urlEventId || '';

  const navigate = useNavigate();

  // Guard temprano por si no hay eventId
  if (!finalEventId) {
    return (
      <ErrorScreen
        title="Invalid event"
        message="Event ID is missing."
        showHomeButton
      />
    );
  }

  const { data: event, isPending: loading, error } = useEvent(finalEventId);
  const { mutate: updateEvent, isPending } = useEditEvent();
  const uploadAttachmentMutation = useUploadAttachment();

  const alwaysInclude = ['country', 'city', 'area', 'address'];

  const [formData, setFormData] = useState<Record<string, FieldState>>({
    thumbnail: { value: null, valid: true, step: 1, error: '', changed: false },
    gallery: { value: [], valid: true, step: 1, error: '', changed: false },
    eventTitle: { value: '', valid: false, step: 1, error: '', changed: false },
    eventType: { value: '', valid: false, step: 1, error: '', changed: false },
    city: { value: '', valid: true, step: 1, error: '', changed: false },
    isHidden: { value: false, valid: true, step: 1, error: '', changed: false },
    area: { value: '', valid: true, step: 1, error: '', changed: false },
    address: { value: '', valid: true, step: 1, error: '', changed: false },
    description: { value: '', valid: true, step: 1, error: '', changed: false },
    allowPlusOne: { value: false, valid: true, step: 1, error: '', changed: false },
    plusOneCount: { value: 1, valid: true, step: 1, error: '', changed: false },
    requirePlusOneInfo: { value: false, valid: true, step: 1, error: '', changed: false },
    requireRsvpApproval: { value: false, valid: true, step: 1, error: '', changed: false },
    showEventToNonMembers: { value: false, valid: true, step: 1, error: '', changed: false },
    attachedFile: { value: null, valid: true, step: 1, error: '', changed: false },
    startDate: { value: new Date(), valid: true, step: 1, error: '', changed: false },
    endDate: { value: new Date(), valid: true, step: 1, error: '', changed: false },
    country: { value: '', valid: true, step: 1, error: '' },
    timezone: { value: '', valid: true, step: 1, error: '' }
  });

  const [step] = useState(1);
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: { ...prev.thumbnail, value: event?.thumbnail || null },
        gallery: { ...prev.gallery, value: event?.gallery || [] },
        eventTitle: { ...prev.eventTitle, value: event.title || '', valid: !!event.title },
        eventType: { ...prev.eventType, value: event.event_type || '', valid: !!event.event_type },
        city: { ...prev.city, value: event.city || '' },
        isHidden: { ...prev.isHidden, value: !!event.hide_address },
        area: { ...prev.area, value: event.area || '' },
        address: { ...prev.address, value: event.address || '' },
        description: { ...prev.description, value: event.description || '' },
        allowPlusOne: { ...prev.allowPlusOne, value: !!event.allow_plus_one },
        plusOneCount: { ...prev.plusOneCount, value: event.allow_plus_one_amount ?? 1 },
        requirePlusOneInfo: { ...prev.requirePlusOneInfo, value: !!event.requires_plus_one_info },
        requireRsvpApproval: { ...prev.requireRsvpApproval, value: !!event.requires_rsvp_approval },
        showEventToNonMembers: { ...prev.showEventToNonMembers, value: !!event.show_to_non_members },
        attachedFile: { ...prev.attachedFile, value: null },
        startDate: { ...prev.startDate, value: event.start_date ? new Date(event.start_date) : new Date() },
        endDate: { ...prev.endDate, value: event.end_date ? new Date(event.end_date) : new Date() },
        country: { ...prev.country, value: event.country || '' },
        timezone: { ...prev.timezone, value: event.timezone || '' }
      }));
    }
  }, [event]);

  const handleInputChange = useCallback((
    key: string,
    value: string | number | File | null | undefined | File[] | Date | boolean
  ) => {
    let validationResult = { isValid: true, error: '' };

    switch (key) {
      case 'eventTitle':
        validationResult = validateAll([
          required(value, 'Event title'),
          isAlphanumeric(value, 'Event title'),
          maxLength(value, 50, 'Event title'),
        ]);
        break;
      case 'description':
        validationResult = validateAll([
          isAlphanumeric(value, 'Description'),
          minLength(value, 1, 'Description'),
        ]);
        break;
      case 'eventType':
        validationResult = validateAll([required(value, 'Event type')]);
        break;
      case 'startDate':
      case 'endDate':
        validationResult = validateAll([required(value, key === 'startDate' ? 'Start date' : 'End date')]);
        break;
      case 'timezone':
        validationResult = validateAll([required(value, 'Timezone')]);
        break;
      // opcionales
      default:
        validationResult = { isValid: true, error: '' };
    }

    setHasFormChanges(true);
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
        valid: validationResult.isValid,
        error: validationResult.error,
        changed: true,
      },
    }));
  }, []);

  const hasValidationErrors = useCallback((data: Record<string, FieldState>) => {
    const requiredKeys = ['eventTitle', 'eventType', 'startDate', 'endDate', 'timezone'];
    for (const k of requiredKeys) {
      const f = data[k];
      if (!f) continue;
      if (!f.valid || !!f.error || f.value === '' || f.value === null || f.value === undefined) {
        return true;
      }
    }
    return false;
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!Object.values(formData).some((f) => f.changed)) return;

    let thumbnailId: string | null = null;
    const galleryIds: string[] = [];
    const attachmentIds: string[] = [];

    if (formData.thumbnail.changed && formData.thumbnail.value) {
      const file = formData.thumbnail.value as File;
      const thumbnailResponse = await uploadAttachmentMutation.mutateAsync(file);
      if (thumbnailResponse?.id) thumbnailId = thumbnailResponse.id;
    }

    if (formData.gallery.changed && Array.isArray(formData.gallery.value) && formData.gallery.value.length > 0) {
      const galleryUploads = await Promise.all(
        (formData.gallery.value as File[]).map((file) => uploadAttachmentMutation.mutateAsync(file))
      );
      galleryUploads.forEach((response) => {
        if (response?.id) galleryIds.push(response.id);
      });
    }

    if (formData.attachedFile.changed && formData.attachedFile.value) {
      const file = formData.attachedFile.value as File;
      const attachmentResponse = await uploadAttachmentMutation.mutateAsync(file);
      if (attachmentResponse?.id) attachmentIds.push(attachmentResponse.id);
    }

    const mappings: Record<string, string> = {
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
      timezone: 'timezone',
    };

    const changedFields = Object.entries(formData).reduce((acc, [key, field]) => {
      const apiField = mappings[key];
      if (!apiField) return acc;

      if (alwaysInclude.includes(key)) {
        acc[apiField] = field.value || '';
        return acc;
      }

      if (field.changed) {
        if (key === 'startDate' || key === 'endDate') {
          acc[apiField] = (field.value as Date).toISOString();
        } else if (key === 'thumbnail') {
          acc[apiField] = thumbnailId;
        } else if (key === 'gallery') {
          acc[apiField] = galleryIds;
        } else if (key === 'attachedFile') {
          acc[apiField] = attachmentIds;
        } else {
          acc[apiField] = field.value;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    try {
      await updateEvent({ eventId: finalEventId, eventData: changedFields });

      setFormData((prev) => {
        const reset: Record<string, FieldState> = {};
        Object.keys(prev).forEach((k) => {
          reset[k] = { ...prev[k], changed: false };
        });
        return reset;
      });

      setHasFormChanges(false);
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 3000);
      // navigate(`/view/${finalEventId}`);
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  }, [formData, finalEventId, uploadAttachmentMutation, updateEvent]);

  // ✅ Memo estable para ciudades por país (se usa más abajo SIN hooks condicionales)
  const { filteredCities } = useMemo(() => {
    if (!formData.country.value) return { filteredCities: [] as {label:string; value:string}[] };

    const selectedCountry = countryOptions.find(
      (c) => c.country === formData.country.value
    );
    if (!selectedCountry) return { filteredCities: [] as {label:string; value:string}[] };

    const cities = selectedCountry.cities
      .map((city) => ({ label: city.city, value: city.city }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return { filteredCities: cities };
  }, [formData.country.value]);

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

  // helpers seguros para default images
  const thumbnailDefault =
    event?.thumbnail
      ? (Array.isArray(event.thumbnail) ? getDisplayImage(event.thumbnail[0]) : getDisplayImage(event.thumbnail))
      : undefined;

  const galleryDefault =
    Array.isArray(event?.gallery) && event.gallery.length > 0
      ? event.gallery.map((img: string) => ({
          preview: getDisplayImage(img),
          name: img,
        }))
      : undefined;

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
                  defaultValue={thumbnailDefault}
                  defaultGallery={galleryDefault}
                />
              </div>

              <Input
                label="Event Title*"
                type="text"
                name="eventTitle"
                value={formData.eventTitle.value as string}
                onChange={(e) => handleInputChange('eventTitle', e.target.value)}
                style={{ margin: '20px 0 10px' }}
                className="text-[20px] mb-[5px]"
                error={formData.eventTitle.error}
              />

              <Select
                options={eventTypeOptions}
                placeholder="Event type*"
                name="eventType"
                onChange={(e) => handleInputChange('eventType', e.target.value)}
                isSearchable={false}
                value={formData.eventType.value as string}
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
                        value={formData.startDate.value as Date}
                        onChange={(date) => handleInputChange('startDate', date)}
                        isStartDate={true}
                        endDate={formData.endDate.value as Date}
                        onEndDateChange={(date) => handleInputChange('endDate', date)}
                      />
                      <span className="mr-[8px]">at</span>
                      <TimePicker
                        value={formData.startDate.value as Date}
                        onChange={(date) => {
                          const newDate = new Date(formData.startDate.value as Date);
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
                        value={formData.endDate.value as Date}
                        onChange={(date) => handleInputChange('endDate', date)}
                        startDate={formData.startDate.value as Date}
                        onStartDateChange={(date) => handleInputChange('startDate', date)}
                      />
                      <span className="mr-[8px]">at</span>
                      <TimePicker
                        value={formData.endDate.value as Date}
                        onChange={(date) => {
                          const newDate = new Date(formData.endDate.value as Date);
                          newDate.setHours(date.getHours());
                          const currentMinutes = date.getMinutes();
                          const roundedMinutes = currentMinutes < 30 ? 0 : 30;
                          newDate.setMinutes(roundedMinutes);
                          newDate.setSeconds(0);
                          handleInputChange('endDate', newDate);
                        }}
                        startTime={formData.startDate.value as Date}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between p-3 items-center border-t-[0.25px] border-[#78788086]">
                    <div className="text-[16px]">Timezone*</div>
                    <div className="flex items-center gap-2" style={{ width: '60%', minWidth: '200px' }}>
                      <TimezonePicker
                        value={(formData.timezone.value as string) || ''}
                        onChange={(tz) => handleInputChange('timezone', tz)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Input
                label="Address (optional)"
                name="address"
                value={(formData.address.value as string) || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                error={formData.address.error}
                className="pb-[10px] mb-[10px]"
              />

              <Select
                wrapperClassName="mb-[10px]"
                options={countryOptions.map((country) => ({
                  label: country.country,
                  value: country.country,
                }))}
                placeholder="Country"
                name="country"
                onChange={(e) => handleInputChange('country', e.target.value)}
                isSearchable
                isClearable
                value={(formData.country.value as string) || ''}
                error={formData.country.error}
              />

              {/* ✅ SIN hooks condicionales */}
              {formData.country.value && (
                <Select
                  options={filteredCities}
                  placeholder="City"
                  name="city"
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  isSearchable
                  isClearable
                  value={(formData.city.value as string) || ''}
                  error={formData.city.error}
                />
              )}

              <Toggle
                label="Hide address?"
                value={!!formData.isHidden.value}
                withContent={false}
                onChange={(value) => handleInputChange('isHidden', value)}
                labelPosition="right"
                wrapperClassName="mt-[10px] mb-[20px]"
                error={formData.isHidden.error}
              />

              <Input
                label="Area"
                type="text"
                name="area"
                value={(formData.area.value as string) || ''}
                onChange={(e) => handleInputChange('area', e.target.value)}
                style={{ margin: '20px 0 10px' }}
                error={formData.area.error}
              />

              <Input
                label="Description"
                type="textarea"
                name="description"
                value={(formData.description.value as string) || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                style={{ margin: '10px 0' }}
                error={formData.description.error}
              />

              <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">Settings</h5>

              <Toggle
                label="Allow +1?"
                description="Choose how many guests one person is allowed to bring"
                value={!!formData.allowPlusOne.value}
                blockGrayLabelToggleField
                onChange={(value) => handleInputChange('allowPlusOne', value)}
                labelPosition="left"
                name="requirePlusOneInfo"
                showNumberInput={true}
                numberValue={(formData.plusOneCount.value as number) ?? 1}
                onNumberChange={(value) => handleInputChange('plusOneCount', value)}
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
                value={!!formData.requireRsvpApproval.value}
                onChange={(value) => handleInputChange('requireRsvpApproval', value)}
                wrapperClassName="mt-[10px] mb-[10px]"
                error={formData.requireRsvpApproval.error}
              />

              <Toggle
                label="Show event to non-members?"
                blockGrayLabelToggleField
                labelPosition="left"
                name="showEventToNonMembers"
                value={!!formData.showEventToNonMembers.value}
                onChange={(value) => handleInputChange('showEventToNonMembers', value)}
                wrapperClassName="mt-[10px] mb-[10px]"
                error={formData.showEventToNonMembers.error}
              />

              <h5 className="text-[18px] pl-[2px] mt-[16px] mb-[15px]">Attachments</h5>

              <AttachFileButton
                onFileSelect={(file) => handleInputChange('attachedFile', file)}
                accept=".pdf,.doc,.docx,.txt"
                maxSize={5}
                wrapperClassName="mb-3"
              />

              {formData.attachedFile.value && (
                <div className="mb-4 flex items-center justify-between text-sm break-all text-gray-600">
                  <span>
                    Selected file:{' '}
                    {(formData?.attachedFile?.value as File)?.name || 'Attachment 1'}
                  </span>
                  <button
                    onClick={() => handleInputChange('attachedFile', null)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Remove attachment"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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