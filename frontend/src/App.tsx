
import LoginPage from "./pages/public/Auth/Login/Login"
import RegisterPage from "./pages/public/Auth/Register/Register"
import HomePage from "./pages/public/Home/Home"
import SponsorDashboard from "./sponsor/Dashboard/SponsorDashboard"


function App() {
  return (
    <>
    <HomePage />
    <LoginPage />
 <RegisterPage />
 <SponsorDashboard/>
    </>
  )
}

export default App