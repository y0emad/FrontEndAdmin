import { createBrowserRouter } from "react-router-dom";
import { HomeFunc } from "./pages/Home/Home";
import { LayoutMain } from "./layouts/LayoutMain";
import { LayoutError } from "./layouts/LayoutError";
import { LogIn } from "./pages/Log_in/LogIn";
import { AddProduct } from "./pages/AddNewProduct/AddNewProduct";
import { OrdersStatus } from "./pages/OrdersStatus/OrdersStatus";
import { EditExitProduct } from "./pages/EditProduct/EditProduct";
import { WaitingPage } from "./pages/WaitingList/WaitingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutMain />,
    errorElement: <LayoutError />,
    children: [
      {
        index: true,
        ...HomeFunc,
      },
      { path: "/LogIn", element: <LogIn /> },
      { path: "/AddNewProduct", ...AddProduct },
      {
        path: "/EditProduct/:Pro_id",
        ...EditExitProduct,
      },
      { path: "/OrdersStatus", element: <OrdersStatus /> },
      { path: "/WaitingPage", element: <WaitingPage /> },
    ],
  },
]);