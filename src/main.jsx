//for banner////
// main.jsx বা যেখানে global css ইম্পোর্ট করো
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'aos/dist/aos.css'
import 'swiper/css/effect-fade'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";

import { router } from './routes/router.jsx';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthProvider.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>

      {/* Devtools অবশ্যই QueryClientProvider এর ভেতরে হবে */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
