import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import AuthPage from "@/components/login/login";
import UnifiedAuthPage from "@/components/login/login";

export default function Home (){
    return (
        <>
        <Navbar/>
        <AuthPage/>
        <Footer/>
        </>
    )
}