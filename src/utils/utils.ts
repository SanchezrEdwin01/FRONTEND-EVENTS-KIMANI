import { AUTUMN_API_URL } from "./constants";
export type FileArgs = [
    options?: {
        max_side?: number;
        size?: number;
        width?: number;
        height?: number;
    },
    allowAnimation?: boolean,
    fallback?: string,
];

export const generateFileURL = (
        attachment?: {
            tag: string;
            _id: string;
            content_type?: string;
            metadata?: any;
        },
        ...args: FileArgs
    ) => {
        const [options, allowAnimation, fallback] = args;

        const autumn_url = AUTUMN_API_URL;
        if (!attachment) return fallback;

        const { tag, _id, content_type, metadata } = attachment;

        
        if (metadata?.type === "Image") {
            if (
                Math.min(metadata.width, metadata.height) <= 0 ||
                (content_type === "image/gif" &&
                    Math.max(metadata.width, metadata.height) >= 1024)
            )
                return fallback;
        }

        let query = "";
        if (options) {
            if (!allowAnimation || content_type !== "image/gif") {
                query =
                    "?" +
                    Object.keys(options)
                        .map((k) => `${k}=${options[k as keyof FileArgs[0]]}`)
                        .join("&");
            }
        }

        return `${autumn_url}/${tag}/${_id}${query}`;
}

export const formatDate = (dateString, withoutTimeStamp = false, endDateString = null) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const startTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    const endDate = endDateString ? new Date(endDateString) : roundDateToNearestHalfHour(new Date());
    const endTime = endDate ? endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }) : '';
    return !withoutTimeStamp ? `${formattedDate} - ${startTime} to ${endTime}` : `${formattedDate}`;
};

export const getGalleryUrls = (gallery) => {
    return gallery.map((image) => {
        return gallery?.length > 0
      ? image.startsWith('http')
        ? image
        : generateFileURL({
            _id: image,
            tag: 'events'
        })
        : null
    })
}

export const getDisplayImage = (image, options ={}) => {
    return image && image?.length > 0 && image?.startsWith('http')
        ? image
        : generateFileURL({
            _id: image,
            tag: 'events'
        }, options)
}
export const createMemberList = (memberList: { users: any[] } | undefined) => {
  return memberList?.users && memberList?.users?.length
    ? memberList?.users
        ?.filter(member => member?.username)
        .sort((a, b) => a.username.localeCompare(b.username))
    : [];
};

export const getAllImages = (thumbnail, gallery) => {
    const images = [];

    
    if (thumbnail) {
      images.push(thumbnail);
    }

    
    if (gallery?.length > 0) {
      images.push(...gallery);
    }

    return images;
  };


  export const saveFormatDate = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); 
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  export const roundDateToNearestHalfHour = (date: Date): Date => {
    const roundedDate = new Date(date);
    const currentMinutes = roundedDate.getMinutes();
    const roundedMinutes = currentMinutes < 30 ? 0 : 30;
    roundedDate.setMinutes(roundedMinutes);
    roundedDate.setSeconds(0);
    return roundedDate;
  };

export const getUrlParameter = (name: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};