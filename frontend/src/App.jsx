import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setReservationStep, setReservationData } from './store/slices/reservationSlice';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Event from "./pages/Event";
import Profile from "./pages/Profile";
import Reservation_firstStep from "./components/Reservation/Reservation_firstStep";
import Reservation_secondStep from "./components/Reservation/Reservation_secondStep";
import Navbar from "./pages/Navbar";
import ReservationConfirmed from "./components/Reservation/Resevation_lastSteps";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import UserDashboard from "./pages/User_reservation_dashboard";
import AdminDashboard from "./components/Admin/Admin_dashboard";
import ManageTables from "./components/Admin/ManageTables";
import ManageMenu from "./components/Admin/ManageMenu";
import AllReservations from "./components/Admin/AllReservations";
import Settings from "./components/Admin/Settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import axios from "axios";

function ReservationWrapper() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { step, data } = useSelector(state => state.reservation);

  useEffect(() => {
    // Reset to step 1 when navigating to reservation route
    if (location.pathname === '/reservation') {
      dispatch(setReservationStep(1));
    }
  }, [location.pathname, dispatch]);

  const handleReservationNext = (newData) => {
    if (newData) {
      dispatch(setReservationData(newData));
    }
    dispatch(setReservationStep(step + 1));
  };

  const handleReservationBack = () => {
    dispatch(setReservationStep(step - 1));
  };

  const renderReservationStep = () => {
    switch (step) {
      case 1:
        return <Reservation_firstStep onNext={handleReservationNext} reservationData={data} />;
      case 2:
        return <Reservation_secondStep onBack={handleReservationBack} onNext={handleReservationNext} reservationData={data} />;
      case 3:
        return <ReservationConfirmed reservationData={data} />;
      default:
        return <Reservation_firstStep onNext={handleReservationNext} reservationData={data} />;
    }
  };

  return renderReservationStep();
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

   useEffect(() => {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL ||
      "https://cafe-reservation-api-gateway-main-entry.onrender.com";

    axios.get(`${API_BASE_URL}/api/wakeup`).catch(() => {});

    console.log("calling backend apis for the cold start ");
  }, []);


  return (
    <Router>
      <Navbar />
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/events" element={<Event />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/reservation" element={<ReservationWrapper />} />
          <Route path="/user-dashboard" element={<ProtectedRoute requiredRole="USER"><UserDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/manage-tables" element={<ProtectedRoute requiredRole="ADMIN"><ManageTables /></ProtectedRoute>} />
          <Route path="/admin/manage-menu" element={<ProtectedRoute requiredRole="ADMIN"><ManageMenu /></ProtectedRoute>} />
          <Route path="/admin/all-reservations" element={<ProtectedRoute requiredRole="ADMIN"><AllReservations /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="ADMIN"><Settings /></ProtectedRoute>} />
        </Routes>

    </Router>

    // <Nav />
  );
}

export default App;
