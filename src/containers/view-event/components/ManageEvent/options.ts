import { PencilSquareIcon, TicketIcon, TrashIcon, UserCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline';

interface ActionParams {
  event: any;
  navigate: any;
}

interface MenuOption {
  icon: React.ElementType;
  text: string;
  action?: (params?: ActionParams) => void;
  variant?: 'danger' | 'default' | 'lessGap' | 'lessWidth';
  disabled?: boolean;
  isModal?: boolean;
  wrapperClassName?: string;
  buttonClassName?: string;
}

export const menuOptions: MenuOption[] = [
  {
    icon: PencilSquareIcon,
    text: 'Edit Event',
    wrapperClassName: 'w-[100px] h-20 px-1 py-0.5 bg-[#2e2c2c] rounded-[10px] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[3px]',
    action: ({event, navigate}) => {
      navigate(`/edit/${event._id}`);
    },
    disabled: false 
  },
  {
    icon: TicketIcon,
      text: 'Manage payments',
    wrapperClassName: 'w-[100px] h-20 px-1 py-0.5 bg-[#2e2c2c] rounded-[10px] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[3px]',
    action: ({event, navigate}) => {
      navigate(`/manage-payments/${event._id}`);
    },
    disabled: false,
  },
  {
    icon: ListBulletIcon,
    text: 'Pending requests',
    wrapperClassName: 'w-[100px] h-20 px-1 py-0.5 bg-[#2e2c2c] rounded-[10px] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[3px]',
    buttonClassName: "w-20 relative text-center justify-start text-white text-xs font-bold font-['Hanken_Grotesk']",
    action: ({event, navigate}) => {
      navigate(`/pending-requests/${event._id}`);
    },
    disabled: false
  },
  {
    icon: ListBulletIcon,
      text: 'Approved guests',
    wrapperClassName: 'w-[100px] h-20 px-1 py-0.5 bg-[#2e2c2c] rounded-[10px] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[3px]',
    buttonClassName: "w-20 relative text-center justify-start text-white text-xs font-bold font-['Hanken_Grotesk']",
    action: ({event, navigate}) => {
      navigate(`/approved-guests/${event._id}`);
    },
  },
  {
    icon: UserCircleIcon,
      text: 'Manage hosts',
    wrapperClassName: "w-[100px] h-20 px-[49px] py-0.5 bg-[#2e2c2c] rounded-[10px] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[18px]",
    buttonClassName: "w-[76px] relative justify-start text-white text-xs font-bold font-['Hanken_Grotesk']",
    action: ({event, navigate}) => {
      navigate(`/manage-hosts/${event._id}`);
    },
  },
  {
    icon: TrashIcon,
    text: 'Cancel event',
      wrapperClassName: "w-[100px] h-20 px-1 py-0.5 bg-[#2e2c2c] rounded-[10px] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[18px]",
    buttonClassName: "relative justify-start text-[#ce5959] text-xs font-bold font-['Hanken_Grotesk']",
    variant: 'danger',
    isModal: true 
  }
]; 