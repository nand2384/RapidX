import { Route, Routes } from "react-router";
import Login from "../pages/Login";

function AllRoutes() {
  return (
    <>
        <Routes>
            <Route path='/login' element={<Login />}></Route>
        </Routes>
    </>
  )
}

export default AllRoutes