import * as React from 'react';
import NavigationLayout from '@/components/NavigationLayout';
import Separator from '@/components/Separator';
import Button from '@/components/Button';
import { useMemo, useCallback } from 'react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useParams } from 'react-router-dom';
import { useEventGuests } from '@/hooks/useEventGuests';
import { useEvent } from '@/hooks/useEvents';
import { formatDate, generateFileURL } from '@/utils/utils';
export default function ApprovedGuests() {
  const { eventId } = useParams();
  const { data: event } = useEvent(eventId);
  const { data: guests } = useEventGuests(eventId);

  const approvedGuests = useMemo(
    () => guests?.filter(guest => guest?.status === 'Approved') || [],
    [guests]
  );

  const handlePrint = useCallback(() => {
    const printContent = `
      <html>
        <head>
          <title>Guest List - ${event.title}</title>
          <style>
            @media print {
              body { 
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              th { 
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              h1 { 
                text-align: center;
                margin-bottom: 20px;
              }
              @page {
                margin: 0.5cm;
              }
            }
            body { 
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left;
            }
            th { 
              background-color: #f2f2f2;
            }
            h1 { 
              text-align: center;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Approved Guests - ${event.title}</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Requested At</th>
                <th>Is Plus One</th>
                <th>Plus One Of</th>
              </tr>
            </thead>
            <tbody>
              ${approvedGuests
                .map(guest => {
                  const plusOneOf = guest?.plus_one_of
                    ? guests?.find(g => g._id === guest?.plus_one_of)
                    : null;
                  return `
                <tr>
                  <td>${guest?.name || '-'}</td>
                  <td>${guest?.email || '-'}</td>
                  <td>${guest?.phone || '-'}</td>
                  <td>${formatDate(guest?.created_at, true) || '-'}</td>
                  <td>${guest?.is_plus_one ? 'Yes' : 'No'}</td>
                  <td>${plusOneOf?.name || '-'}</td>
                </tr>
              `;
                })
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.contentWindow.document.write(printContent);
    iframe.contentWindow.document.close();

    iframe.onload = () => {
      try {
        iframe.contentWindow.print();
      } catch (error) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      } finally {
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }
    };
  }, [approvedGuests, event]);

  return (
    <NavigationLayout backUrl={`/view/${eventId}`} title="Approved guests">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex-1 overflow-hidden p-4 mt-[30px]">
          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
            {approvedGuests && approvedGuests?.length > 0 ? (
              approvedGuests?.map(guest => {
                const guestAvatar =
                  (guest?.avatar && generateFileURL(guest.avatar)) || null;
                return (
                  <div className="w-full p-2 bg-[#2e2c2c] rounded-[10px] border-[#dfdfec] inline-flex justify-start items-center gap-3">
                    {guestAvatar && (
                      <ImageWithFallback
                        data-placeholder="Off"
                        data-size="xs"
                        data-style="Circle"
                        className="w-6 h-6 rounded-[100px]"
                        src={guestAvatar}
                        alt={guest.name}
                        fallbackSrc={'https://placehold.co/24x24'}
                      />
                    )}
                    <div className="flex-1 justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                      {guest.name}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full p-2 inline-flex justify-start items-center gap-3">
                No approved guests
              </div>
            )}
          </div>
        </div>
        <div className="w-full z-2 fixed bottom-0 left-0 bg-[#151616]">
          <Separator noMargin />
          <div className="w-[90%] max-w-[600px] mx-auto pb-4">
            <Button onClick={handlePrint} disabled={!approvedGuests?.length}>
              Print guest list
            </Button>
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
}
