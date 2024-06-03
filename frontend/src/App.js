import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import Loader from './components/Loader/Loader';
import {
  useGetTopProductsQuery,
  useGetLatestProductsQuery,
  useGetMostPurchasedProductsQuery,
} from './slices/productsApiSlice';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const { isLoading: topProductLoading, refetch } = useGetTopProductsQuery();
  const { isLoading: latestProductLoading } = useGetLatestProductsQuery();
  const { isLoading: mostPurchasedProductLoading } =
    useGetMostPurchasedProductsQuery();

  useEffect(() => {
    if (
      !topProductLoading &&
      !latestProductLoading &&
      !mostPurchasedProductLoading
    ) {
      setLoading(false);
      refetch();
    }
  }, [
    topProductLoading,
    latestProductLoading,
    mostPurchasedProductLoading,
    refetch,
  ]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Header />
          <main className=''>
            <Outlet />
          </main>
          {/* <Footer /> */}
          <ToastContainer
            position='bottom-right'
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
          />
        </div>
      )}
    </>
  );
};

export default App;
