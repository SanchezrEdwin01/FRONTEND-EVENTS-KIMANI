import * as React from 'react';
import NavigationLayout from '@/components/NavigationLayout';
import { Event } from '@/types/event';
import { useMemo, useState } from 'react';
import Listing from './steps/Listing';
import SendInvite from './steps/SendInvite';
import { useServerMembers } from '@/hooks/useServerMembers';
import { createMemberList } from '@/utils/utils';
import { useParams } from 'react-router-dom';
export default function InviteGuests({ event }: { event: Event }) {
  const { eventId } = useParams();
  const [step, setStep] = useState<'listing' | 'send_invite'>('listing');
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const { data: memberList } = useServerMembers(true);
  const members = useMemo(() => createMemberList(memberList), [memberList]);
  return (
    <NavigationLayout
      backUrl={`/view/${eventId}`}
      title={step === 'send_invite' ? 'Send invite' : 'Invite guests'}
      onBack={step === 'send_invite' ? () => setStep('listing') : null}
    >
      <div className="flex flex-col flex-1 w-full">
        {step === 'listing' && (
          <Listing
            handleSendInvite={() => setStep('send_invite')}
            members={members}
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
          />
        )}
        {step === 'send_invite' && (
          <SendInvite
            members={selectedMembers}
            onSuccess={() => {
              setStep('listing');
              setSelectedMembers([]);
            }}
          />
        )}
      </div>
    </NavigationLayout>
  );
}
