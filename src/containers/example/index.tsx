import React from 'react';
import { wrapErrorBoundary } from '@/hooks/index';
import eventMock from '@/__mocks__/eventMock';
import CustomSelect from '@/components/CustomSelect';
import { Button, Title, Heading, Slider, Card } from '@marcoscristofalo/kimani-framework';
const Example = () => {
  return (
    <>
      Example title:
      <Title>Events</Title>
      <br />
      Example add event:
      <Button className="text-white">Add Event</Button>
      <br />
      Example heading:
      <Heading text="Kimani Events" />
      <br />
      Example Event:
      <Card card={eventMock} />
      <br />
      Example Vertical Event:
      <Card
        card={{ ...eventMock, type: 'Musical', tickets: 'Tickets Left: 5' }}
        vertical
      />
      <br />
      Example Slider:
      <Slider cards={[{ ...eventMock }, { ...eventMock }, { ...eventMock }]} />
      <br />
      Example Custom Selector:
      <CustomSelect
        defaultValue="In your city"
        options={[
          { label: 'All Cities' },
          { label: 'New York' },
          { label: 'California' },
          { label: 'Miami' },
          { label: 'Orlando' }
        ]}
        cb={o => {
          console.log(o);
        }}
        arrowDown
        showOptions
      />
    </>
  );
};

export default wrapErrorBoundary(Example);
