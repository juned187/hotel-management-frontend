import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import BookingPage from "@/components/booking/booking";
import PaymentPage from "@/components/payment/payment";


export default function Home() {
    return(
        <>
        <Navbar/>
        <BookingPage/>
        
        <Footer/>
        </>
    )
}