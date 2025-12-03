import BookPage from "@/components/booking/booking-page";
import { Suspense } from "react";
import Loading from "../_lib/utils/loading";

const ServiceBookingPage = () => {

  return (
    <Suspense fallback={<Loading />}>
      <BookPage />
    </Suspense>
  );
}

export default ServiceBookingPage;