import { EVENT_TYPE_KIMANI, EVENT_TYPE_MEMBER } from '@/utils/constants';

export default [{
  title: 'Event Title 2 For the Longest Name On The Application that will be two rows or three',
  type: EVENT_TYPE_MEMBER,
  description: 'Testing',
  imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg',
  place: 'Miami',
  date: 'Sun, Dec 22 - 8pm to 11pm',
  hosts: [{name: "Mateo", id: 1}],
  saved: true,
}, {
  title: 'Event Title For the Longest Name On The Application that will be two rows or three',
  type: EVENT_TYPE_KIMANI,
  description: 'Testing',
  imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg',
  place: 'Miami',
  date: 'Sun, Dec 22 - 8pm to 11pm',
  hosts: [{name: "Mateo", id: 1}, {name: "Amir", id: 2}],
}];
