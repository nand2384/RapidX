import { Route, Routes } from "react-router";
import Login from "../pages/Login";
import BusinessReg from "../pages/BusinessReg";

function AllRoutes() {
  return (
    <>
        <Routes>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/business-register' element={<BusinessReg />}></Route>
        </Routes>
    </>
  )
}

export default AllRoutes