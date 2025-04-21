import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';
const NavigationLayout = ({ title, backUrl, children, onBack }) => {
  const navigate = useNavigate();

  const handleBack = React.useCallback(() => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  }, [onBack, backUrl, navigate]);

  return (
    <div className="navigation-layout bg-[#151616] flex flex-col flex-1 w-full h-screen">
      <header className="min-h-[98px]">
        <div className="contents">
          <div
            className="flex gap-2 cursor-pointer absolute"
            onClick={handleBack}
          >
            <div
              data-enabled="True"
              className="flex justify-start items-center gap-1"
            >
              <div className="ml-1 relative justify-start text-[#f7f7f2] text-[17px] leading-snug">
                <svg
                  width="12"
                  height="20"
                  viewBox="0 0 12 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.303223 10.0068C0.308757 9.81315 0.347493 9.63607 0.419434 9.47559C0.491374 9.3151 0.602051 9.16016 0.751465 9.01074L9.06885 0.958984C9.3068 0.721029 9.6001 0.602051 9.94873 0.602051C10.1812 0.602051 10.3914 0.657389 10.5796 0.768066C10.7733 0.878743 10.9255 1.02816 11.0361 1.21631C11.1523 1.40446 11.2104 1.61475 11.2104 1.84717C11.2104 2.19027 11.0804 2.49186 10.8203 2.75195L3.2998 9.99854L10.8203 17.2534C11.0804 17.519 11.2104 17.8206 11.2104 18.1582C11.2104 18.3962 11.1523 18.6092 11.0361 18.7974C10.9255 18.9855 10.7733 19.1349 10.5796 19.2456C10.3914 19.3618 10.1812 19.4199 9.94873 19.4199C9.6001 19.4199 9.3068 19.2982 9.06885 19.0547L0.751465 11.0029C0.596517 10.8535 0.483073 10.6986 0.411133 10.5381C0.339193 10.3721 0.303223 10.195 0.303223 10.0068Z"
                    fill="#F7F7F2"
                  />
                </svg>
              </div>
              <div className="ml-2 relative justify-start text-[#f7f7f2] text-lg font-normal font-['Hanken_Grotesk'] leading-snug">
                Back
              </div>
            </div>
          </div>
          <div className="relative text-center justify-start text-white text-lg font-semibold font-['Hanken_Grotesk'] leading-snug mx-auto">
            {title}
          </div>
        </div>
      </header>
      <main className="flex flex-col flex-1 h-full overflow-scroll">
        {children}
      </main>
    </div>
  );
};

export default React.memo(NavigationLayout);
