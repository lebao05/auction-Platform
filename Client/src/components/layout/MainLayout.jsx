import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function MainLayout() {
  return (
    <>
      <Header />
      <Outlet /> {/* The child route content will render here */}
    </>
  );
}
