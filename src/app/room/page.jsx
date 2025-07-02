'use client';
import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import RoomsPage from "@/components/room/room";
import RoomsPage2 from "@/components/room/room2";

export default function RoomPage() {
  return (
    <>
      <Navbar/>
      <RoomsPage/>
      <RoomsPage2/>
      <Footer/>
    </>
  );
}