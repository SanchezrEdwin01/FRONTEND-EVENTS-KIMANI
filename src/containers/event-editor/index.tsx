// src/containers/event-editor/index.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NavigationLayout from '@/components/NavigationLayout';
import TabbedNavigation from '@/components/TabbedNavigation';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';
import Button from '@/components/Button';
import CustomDatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import TimezonePicker from '@/components/TimezonePicker';
import ImageUpload from '@/components/ImageUpload';
import { getDisplayImage } from '@/utils/utils';
import { eventTypeOptions } from '@/containers/new-event/newEventHelper';
import { countryOptions } from '@/containers/new-event/newEventHelper';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvent, useEditEvent} from '@/hooks/useEvents';
import { useUploadAttachment } from '@/hooks/useAttachments';
import Loader from '@/components/Loader';
import Layout from '@/components/Layout';

type Field<T = any> = {
  value: T;
  valid: boolean;
  error?: string;
  changed?: boolean;
};

const TABS = ['Details', 'Settings'] as const;
type TabId = typeof TABS[number];

const EventEditor: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const { data: event, isPending: loading, error } = useEvent(eventId!);
  const { mutateAsync: updateEvent, isPending: saving } = useEditEvent();
  // si tu upload vive en otro hook: useUploadAttachment de '@/hooks/useAttachments'
  const uploadAttachment = useUploadAttachment?.() ?? { mutateAsync: async () => null };

  const [activeTab, setActiveTab] = useState<TabId>('Details');

  const [form, setForm] = useState({
    title: { value: '', valid: true } as Field<string>,
    event_type: { value: '', valid: true } as Field<string>,
    start_date: { value: new Date(), valid: true } as Field<Date>,
    end_date: { value: new Date(), valid: true } as Field<Date>,
    timezone: { value: '', valid: true } as Field<string>,
    country: { value: '', valid: true } as Field<string>,
    city: { value: '', valid: true } as Field<string>,
    area: { value: '', valid: true } as Field<string>,
    address: { value: '', valid: true } as Field<string>,
    description: { value: '', valid: true } as Field<string>,
    allow_plus_one: { value: false, valid: true } as Field<boolean>,
    allow_plus_one_amount: { value: 1, valid: true } as Field<number>,
    requires_rsvp_approval: { value: false, valid: true } as Field<boolean>,
    show_to_non_members: { value: false, valid: true } as Field<boolean>,
    hide_address: { value: false, valid: true } as Field<boolean>,
    thumbnail: { value: null as File | null, valid: true } as Field<File | null>,
    gallery: { value: [] as File[], valid: true } as Field<File[]>,
  });

  useEffect(() => {
    if (!event) return;
    setForm((prev) => ({
      ...prev,
      title: { ...prev.title, value: event.title ?? '' },
      event_type: { ...prev.event_type, value: event.event_type ?? '' },
      start_date: { ...prev.start_date, value: event.start_date ? new Date(event.start_date) : new Date() },
      end_date: { ...prev.end_date, value: event.end_date ? new Date(event.end_date) : new Date() },
      timezone: { ...prev.timezone, value: event.timezone ?? '' },
      country: { ...prev.country, value: event.country ?? '' },
      city: { ...prev.city, value: event.city ?? '' },
      area: { ...prev.area, value: event.area ?? '' },
      address: { ...prev.address, value: event.address ?? '' },
      description: { ...prev.description, value: event.description ?? '' },
      allow_plus_one: { ...prev.allow_plus_one, value: !!event.allow_plus_one },
      allow_plus_one_amount: { ...prev.allow_plus_one_amount, value: event.allow_plus_one_amount ?? 1 },
      requires_rsvp_approval: { ...prev.requires_rsvp_approval, value: !!event.requires_rsvp_approval },
      show_to_non_members: { ...prev.show_to_non_members, value: !!event.show_to_non_members },
      hide_address: { ...prev.hide_address, value: !!event.hide_address },
      // thumbnail & gallery solo previews por defecto
    }));
  }, [event]);

  const filteredCities = useMemo(() => {
    if (!form.country.value) return [];
    const c = countryOptions.find((c) => c.country === form.country.value);
    return c
      ? c.cities
          .map((ct: any) => ({ label: ct.city, value: ct.city }))
          .sort((a: any, b: any) => a.label.localeCompare(b.label))
      : [];
  }, [form.country.value]);

  const setField = useCallback(<K extends keyof typeof form>(key: K, val: (typeof form)[K]['value']) => {
    setForm((p) => ({ ...p, [key]: { ...p[key], value: val, changed: true } as any }));
  }, []);

  const save = useCallback(async () => {
    if (!eventId) return;

    const payload: any = {};

    // subir imágenes si cambiaron
    let thumbId: string | null = null;
    if (form.thumbnail.changed && form.thumbnail.value) {
      const up = await uploadAttachment.mutateAsync(form.thumbnail.value as any);
      if (up?.id) thumbId = up.id;
    }
    const galleryIds: string[] = [];
    if (form.gallery.changed && form.gallery.value.length) {
      for (const file of form.gallery.value) {
        const up = await uploadAttachment.mutateAsync(file as any);
        if (up?.id) galleryIds.push(up.id);
      }
    }

    // mapear campos si cambiaron
    const map: Record<string, string> = {
      title: 'title',
      event_type: 'event_type',
      start_date: 'start_date',
      end_date: 'end_date',
      timezone: 'timezone',
      country: 'country',
      city: 'city',
      area: 'area',
      address: 'address',
      description: 'description',
      allow_plus_one: 'allow_plus_one',
      allow_plus_one_amount: 'allow_plus_one_amount',
      requires_rsvp_approval: 'requires_rsvp_approval',
      show_to_non_members: 'show_to_non_members',
      hide_address: 'hide_address',
    };

    (Object.keys(map) as (keyof typeof form)[]).forEach((k) => {
      if ((form[k] as any).changed) {
        const apiK = map[k as string];
        const v = (form[k] as any).value;
        payload[apiK] = v instanceof Date ? v.toISOString() : v;
      }
    });

    if (form.thumbnail.changed) payload.thumbnail = thumbId;
    if (form.gallery.changed) payload.gallery = galleryIds;

    await updateEvent({ eventId, eventData: payload });
    navigate(`/view/${eventId}`);
  }, [eventId, form, updateEvent, navigate, uploadAttachment]);

  const tabs = useMemo(
    () =>
      TABS.map((t) => ({
        title: t,
        onClick: () => setActiveTab(t),
      })),
    []
  );

  if (loading) {
    return (
      <Layout hideHeader={false} hideFooter>
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout hideHeader={false} hideFooter>
        <div className="p-6">
          <p className="text-red-400">Error loading event.</p>
        </div>
      </Layout>
    );
  }

  return (
    <NavigationLayout title="Edit Event" backUrl={`/view/${eventId}`}>
      <div className="px-4 pb-20 max-w-[720px] w-full mx-auto">
        <TabbedNavigation tabs={tabs as any} active={activeTab} />

        {/* --- DETAILS TAB --- */}
        {activeTab === 'Details' && (
          <div className="mt-4">
            <div className="mb-4">
              <ImageUpload
                name="thumbnail"
                defaultValue={
                  event?.thumbnail?.length > 0
                    ? getDisplayImage(event.thumbnail)
                    : undefined
                }
                onImageSelect={(file) => setField('thumbnail', file as any)}
                onGalleryChange={(files) => setField('gallery', files as any)}
                defaultGallery={
                  event?.gallery?.length
                    ? event.gallery.map((g: string) => ({ preview: getDisplayImage(g), name: g }))
                    : undefined
                }
              />
            </div>

            <Input
              label="Event Title*"
              name="eventTitle"
              value={form.title.value}
              onChange={(e) => setField('title', e.target.value)}
              className="mb-3"
            />

            <Select
              options={eventTypeOptions}
              placeholder="Event type*"
              name="eventType"
              value={form.event_type.value}
              onChange={(e) => setField('event_type', e.target.value)}
              isSearchable={false}
            />

            <h5 className="text-[18px] pl-[2px] mt-4 mb-3 text-white">Event details</h5>

            <div className="bg-[#2E2C2C] rounded-lg mt-[10px] mb-[20px]">
              <div className="text-white">
                <div className="flex justify-between p-3 items-center border-b-[0.25px] border-[#78788086]">
                  <div className="text-[16px]">Start*</div>
                  <div className="flex items-center">
                    <CustomDatePicker
                      value={form.start_date.value}
                      onChange={(date) => setField('start_date', date)}
                      isStartDate
                      endDate={form.end_date.value}
                      onEndDateChange={(d) => setField('end_date', d)}
                    />
                    <span className="mr-[8px]">at</span>
                    <TimePicker
                      value={form.start_date.value}
                      onChange={(date) => {
                        const d = new Date(form.start_date.value);
                        d.setHours(date.getHours());
                        const mins = date.getMinutes();
                        d.setMinutes(mins < 30 ? 0 : 30);
                        d.setSeconds(0);
                        setField('start_date', d);
                      }}
                      isStartTime
                    />
                  </div>
                </div>

                <div className="flex justify-between p-3 items-center">
                  <div className="text-[16px]">End*</div>
                  <div className="flex items-center">
                    <CustomDatePicker
                      value={form.end_date.value}
                      onChange={(date) => setField('end_date', date)}
                      startDate={form.start_date.value}
                      onStartDateChange={(d) => setField('start_date', d)}
                    />
                    <span className="mr-[8px]">at</span>
                    <TimePicker
                      value={form.end_date.value}
                      onChange={(date) => {
                        const d = new Date(form.end_date.value);
                        d.setHours(date.getHours());
                        const mins = date.getMinutes();
                        d.setMinutes(mins < 30 ? 0 : 30);
                        d.setSeconds(0);
                        setField('end_date', d);
                      }}
                      startTime={form.start_date.value}
                    />
                  </div>
                </div>

                <div className="flex justify-between p-3 items-center border-t-[0.25px] border-[#78788086]">
                  <div className="text-[16px]">Timezone*</div>
                  <div className="flex items-center gap-2" style={{ width: '60%', minWidth: '200px' }}>
                    <TimezonePicker
                      value={form.timezone.value}
                      onChange={(tz) => setField('timezone', tz)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Input
              label="Address (optional)"
              name="address"
              value={form.address.value}
              onChange={(e) => setField('address', e.target.value)}
              className="mb-3"
            />

            <Select
              wrapperClassName="mb-[10px]"
              options={countryOptions.map((c) => ({ label: c.country, value: c.country }))}
              placeholder="Country"
              name="country"
              onChange={(e) => setField('country', e.target.value)}
              isSearchable
              isClearable
              value={form.country.value}
            />

            {form.country.value && (
              <Select
                options={filteredCities}
                placeholder="City"
                name="city"
                onChange={(e) => setField('city', e.target.value)}
                isSearchable
                isClearable
                value={form.city.value}
              />
            )}

            <Input
              label="Area"
              name="area"
              value={form.area.value}
              onChange={(e) => setField('area', e.target.value)}
              className="mt-3"
            />

            <Input
              label="Description"
              type="textarea"
              name="description"
              value={form.description.value}
              onChange={(e) => setField('description', e.target.value)}
              className="mt-3"
            />
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'Settings' && (
          <div className="mt-4">
            <Toggle
              label="Hide address?"
              value={form.hide_address.value}
              onChange={(v) => setField('hide_address', v)}
              labelPosition="right"
              wrapperClassName="mt-[10px] mb-[20px]"
            />

            <Toggle
              label="Allow +1?"
              description="Choose how many guests one person is allowed to bring"
              value={form.allow_plus_one.value}
              blockGrayLabelToggleField
              onChange={(v) => setField('allow_plus_one', v)}
              labelPosition="left"
              name="allowPlusOne"
              showNumberInput
              numberValue={form.allow_plus_one_amount.value}
              onNumberChange={(n) => setField('allow_plus_one_amount', n)}
              minNumber={1}
              maxNumber={5}
              wrapperClassName="mb-[10px]"
            />

            <Toggle
              label="Require RSVP approval by host?"
              blockGrayLabelToggleField
              labelPosition="left"
              name="requireRsvpApproval"
              value={form.requires_rsvp_approval.value}
              onChange={(v) => setField('requires_rsvp_approval', v)}
              wrapperClassName="mt-[10px] mb-[10px]"
            />

            <Toggle
              label="Show event to non-members?"
              blockGrayLabelToggleField
              labelPosition="left"
              name="showEventToNonMembers"
              value={form.show_to_non_members.value}
              onChange={(v) => setField('show_to_non_members', v)}
              wrapperClassName="mt-[10px] mb-[10px]"
            />
          </div>
        )}

        <div className="mt-6">
          <Button
            onClick={save}
            disabled={saving}
            backgroundColor="#EAEEDD"
            textColor="#222222"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>
    </NavigationLayout>
  );
};

export default EventEditor;
