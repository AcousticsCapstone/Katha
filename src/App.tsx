import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAccount from "./pages/MyAccount";
import Play from "./pages/Play";
import Learn from "./pages/Learn";
import Code from "./pages/Code";
import TeachersCorner from "./pages/TeachersCorner";
import Assessment from "./pages/Assessment";
import ConnectionTest from "./pages/ConnectionTest";
import ProtectedRoute from "./pages/ProtectedRoute";
import { UserTypeSelection } from "./components/user-type-selection";
import ChangePassword from "./pages/ChangePass";
import { StudentLogin } from "./components/student-login";
import CreateAssessment from "./pages/CreateAssessment";
import { AuthProvider } from "./utils/AuthContext";
import { AdminPageComponent } from "./components/admin-page";
import CheckedQuizzesPage from "./pages/StudentsQuizzes";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          {/* <ResponsiveHeader /> */}
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/connection-test" element={<ConnectionTest />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route
                path="/user-type-selection"
                element={<UserTypeSelection />}
              />
              <Route element={<ProtectedRoute />}>
              <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/play" element={<Play />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/teacher-corner" element={<TeachersCorner />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route
                  path="/create-assessment"
                  element={<CreateAssessment />}
                />
                <Route path="/checked-quizzes" element={<CheckedQuizzesPage />} />
                <Route path="/admin" element={<AdminPageComponent />} />
                
                <Route path="/code" element={<Code />} />
              </Route>
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
