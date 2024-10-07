import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './assets/pages/landingPage'
import { Dashboard } from './assets/pages/dashboard'
import AppDetail from './assets/pages/landingPage/appDetail'
import { Applications } from './assets/pages/dashboard/applications'
import { ApplicationsAdd } from './assets/pages/dashboard/applicationsAdd'
import { ApplicationsEdit } from './assets/pages/dashboard/applicationsEdit'
import { Login } from './assets/pages/auth/login'
import { Register } from './assets/pages/auth/register'
import { MFAEnable } from './assets/pages/auth/mfaEnable'
import { MFAOTP } from './assets/pages/auth/mfaOTP'
// import { ResetPassword } from './assets/pages/auth/resetPassword'
import { Users } from './assets/pages/dashboard/users'
import { UserAdd } from './assets/pages/dashboard/usersAdd'
import { UserEdit } from './assets/pages/dashboard/usersEdit'
import AuthLayout from './assets/layouts/authenticated'
import NotFoundPage from './assets/pages/system/404'
import DefaultLayout from './assets/layouts/default'


function App() {

    return (
    <>
        <Routes>
        <Route path="/*" element={<DefaultLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mfaEnable" element={<MFAEnable />} />
        <Route path="/mfaOTP" element={<MFAOTP />} />
        
        {/* <Route path="/applications/detail/:id" element={<AppDetail />} /> */}
        <Route path="/dashboard/*" element={<AuthLayout />} />
        <Route path="/*" element={<Navigate to="/" replace />} />
        {/* <Route path="/dashboard/applications/" element={<Applications />} />
        <Route path="/dashboard/applications/add" element={<ApplicationsAdd />} />
        <Route path="/dashboard/applications/edit/:id" element={<ApplicationsEdit />} />

        <Route path="/dashboard/users/" element={<Users />} />
        <Route path="/dashboard/users/add" element={<UserAdd />} />
        <Route path="/dashboard/users/edit/:id" element={<UserEdit />} /> */}
        </Routes>
    </>
    )
}

export default App
