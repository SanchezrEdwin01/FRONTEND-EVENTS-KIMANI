import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/context/UserContext';
const Layout = ({ hideHeader, hideFooter, children }) => {
  const { user } = useUser();
  return (
    <div>
      {!hideHeader && <Header />}
      <main>{children}</main>
      {!hideFooter && user && <Footer />}
    </div>
  );
};

export default React.memo(Layout);
