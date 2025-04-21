import * as React from 'react';
import ImageWithFallback from '@/components/ImageWithFallback';
import Separator from '@/components/Separator';
import Button from '@/components/Button';
import { useCallback, useEffect, useState } from 'react';
import SearchInputField from '@/components/SearchInputField';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { generateFileURL } from '@/utils/utils';
export default function Listing({
  handleSendInvite,
  members,
  selectedMembers,
  setSelectedMembers
}: {
  handleSendInvite: () => void;
  members: any[];
  selectedMembers: any[];
  setSelectedMembers: (members: any[]) => void;
}) {
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);

  const toggleMembers = useCallback((member: any) => {
    setSelectedMembers(prev =>
      prev.some(m => m._id === member._id)
        ? prev.filter(m => m._id !== member._id)
        : [...prev, member]
    );
  }, []);

  const handleSearchMembers = useCallback(
    (value: string) => {
      setFilteredMembers(
        members.filter(member =>
          member?.username?.toLowerCase().includes(value.toLowerCase())
        )
      );
    },
    [members]
  );

  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  const areAllFilteredMembersSelected = useCallback(() => {
    return filteredMembers.every(member =>
      selectedMembers.some(selected => selected._id === member._id)
    );
  }, [filteredMembers, selectedMembers]);

  const handleSelectAll = useCallback(() => {
    if (areAllFilteredMembersSelected()) {
      setSelectedMembers(
        selectedMembers.filter(
          selected =>
            !filteredMembers.some(filtered => filtered._id === selected._id)
        )
      );
    } else {
      const newSelected = [...selectedMembers];
      filteredMembers.forEach(member => {
        if (!selectedMembers.some(selected => selected._id === member._id)) {
          newSelected.push(member);
        }
      });
      setSelectedMembers(newSelected);
    }
  }, [filteredMembers, selectedMembers, setSelectedMembers]);

  return (
    <>
      <div className="flex-1 overflow-hidden p-4">
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto  pb-[80px]">
          <SearchInputField
            placeholder="Search for new guests"
            onChange={handleSearchMembers}
            onReset={() => setFilteredMembers(members)}
            className="mb-2"
          />
          <div
            className="flex items-center justify-between px-2 py-1 bg-[#2e2c2c] rounded-lg border-[#dfdfec]"
            onClick={handleSelectAll}
          >
            <div className="flex-1 justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
              Select All
            </div>
            <div className="ml-3 flex items-center justify-center cursor-pointer">
              {areAllFilteredMembersSelected() ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M16 2.6665C8.63999 2.6665 2.66666 8.63984 2.66666 15.9998C2.66666 23.3598 8.63999 29.3332 16 29.3332C23.36 29.3332 29.3333 23.3598 29.3333 15.9998C29.3333 8.63984 23.36 2.6665 16 2.6665ZM12.3867 21.7198L7.59999 16.9332C7.07999 16.4132 7.07999 15.5732 7.59999 15.0532C8.11999 14.5332 8.95999 14.5332 9.47999 15.0532L13.3333 18.8932L22.5067 9.71984C23.0267 9.19984 23.8667 9.19984 24.3867 9.71984C24.9067 10.2398 24.9067 11.0798 24.3867 11.5998L14.2667 21.7198C13.76 22.2398 12.9067 22.2398 12.3867 21.7198Z"
                    fill="white"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M16 2.6665C8.62666 2.6665 2.66666 8.6265 2.66666 15.9998C2.66666 23.3732 8.62666 29.3332 16 29.3332C23.3733 29.3332 29.3333 23.3732 29.3333 15.9998C29.3333 8.6265 23.3733 2.6665 16 2.6665ZM16 26.6665C10.1067 26.6665 5.33332 21.8932 5.33332 15.9998C5.33332 10.1065 10.1067 5.33317 16 5.33317C21.8933 5.33317 26.6667 10.1065 26.6667 15.9998C26.6667 21.8932 21.8933 26.6665 16 26.6665Z"
                    fill="white"
                  />
                </svg>
              )}
            </div>
          </div>
          {filteredMembers?.map((member, index) => {
            const memberAvatar =
              (member?.avatar && generateFileURL(member.avatar)) || null;
            return (
              <div
                key={member._id || index}
                className="flex items-center justify-between"
              >
                <div
                  onClick={() => toggleMembers(member)}
                  className="w-full px-2 py-1 bg-[#2e2c2c] rounded-lg border-[#dfdfec] inline-flex justify-start items-center gap-2 cursor-pointer"
                >
                  <ImageWithFallback
                    data-placeholder="Off"
                    data-size="xs"
                    data-style="Circle"
                    className="w-6 h-6 rounded-[100px]"
                    src={memberAvatar}
                    alt={member.username}
                  />
                  <div className="flex-1 justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                    {member.username}
                  </div>
                </div>
                <div className="ml-3 flex items-center justify-center">
                  {selectedMembers.some(m => m._id === member._id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M16 2.6665C8.63999 2.6665 2.66666 8.63984 2.66666 15.9998C2.66666 23.3598 8.63999 29.3332 16 29.3332C23.36 29.3332 29.3333 23.3598 29.3333 15.9998C29.3333 8.63984 23.36 2.6665 16 2.6665ZM12.3867 21.7198L7.59999 16.9332C7.07999 16.4132 7.07999 15.5732 7.59999 15.0532C8.11999 14.5332 8.95999 14.5332 9.47999 15.0532L13.3333 18.8932L22.5067 9.71984C23.0267 9.19984 23.8667 9.19984 24.3867 9.71984C24.9067 10.2398 24.9067 11.0798 24.3867 11.5998L14.2667 21.7198C13.76 22.2398 12.9067 22.2398 12.3867 21.7198Z"
                        fill="white"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M16 2.6665C8.62666 2.6665 2.66666 8.6265 2.66666 15.9998C2.66666 23.3732 8.62666 29.3332 16 29.3332C23.3733 29.3332 29.3333 23.3732 29.3333 15.9998C29.3333 8.6265 23.3733 2.6665 16 2.6665ZM16 26.6665C10.1067 26.6665 5.33332 21.8932 5.33332 15.9998C5.33332 10.1065 10.1067 5.33317 16 5.33317C21.8933 5.33317 26.6667 10.1065 26.6667 15.9998C26.6667 21.8932 21.8933 26.6665 16 26.6665Z"
                        fill="white"
                      />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full z-2 fixed bottom-0 left-0 bg-[#151616]">
        <Separator noMargin />
        <div className="w-[90%] max-w-[600px] mx-auto pb-4">
          <Button
            disabled={selectedMembers.length === 0}
            onClick={handleSendInvite}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
