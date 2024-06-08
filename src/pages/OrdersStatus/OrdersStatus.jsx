import { useTranslation } from "react-i18next";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import ModalOrder from "../../components/ModalOrder";
import { useLoaderData } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { Pagination } from "antd";
import ScrollToTop from "react-scroll-to-top";
import { UpSquareOutlined } from "@ant-design/icons";

function OrdersStatus() {
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const allOrderAccept = useLoaderData();
  const [page, setPage] = useLocalStorage("page", 1);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  useEffect(() => {
    document.title = "Helwan Printing Press | Orders Status ";
  }, []);
  const handleChange = (page) => {
    setPage(page);
    window.location.reload();
  };
  return (
    <div>
      <ScrollToTop
        smooth
        top={400}
        style={{
          bottom: "16px",
          backgroundColor: "#000915",
          width: "fit-content",
          height: "fit-content",
        }}
        component={
          <UpSquareOutlined className=" text-gray-200 text-2xl  hover:text-[#7f6727]" />
        }
      />{" "}
      {allOrderAccept.message === "No accepted orders found." ? (
        <h1 className="title font-manrope font-bold text-4xl  text-center pt-10 text-gray-200">
          {t("OrderStatus.Noacceptedfound")}
        </h1>
      ) : (
        <>
          <section className="py-24 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
              <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-gray-200">
                {t("OrderStatus.Order'sStatus")}
              </h2>
              <div className="hidden lg:grid grid-cols-2 py-6">
                <div className="font-normal text-xl leading-8 text-gray-200">
                  {t("OrderStatus.ProductName")}
                </div>
              </div>

              {allOrderAccept.data
                .slice()
                .reverse()
                .map((order) => (
                  <ModalOrder {...order} key={order._id} />
                ))}
            </div>
            <Pagination
              className="custom-pagination mt-8 text-gray-200 text-center"
              defaultCurrent={allOrderAccept.currentPage}
              defaultPageSize={10}
              total={allOrderAccept.totalOrders}
              hideOnSinglePage={true}
              onChange={(page) => {
                handleChange(page);
              }}
            />
          </section>
        </>
      )}
    </div>
  );
}

const loader = async ({ request: { signal } }) => {
  const page = localStorage.getItem("page");

  const allOrderAccept = await fetch(
    `http://localhost:4000/orders/acceptedOrders?page=${page}`,
    {
      signal,
      headers: {
        authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    }
  ).then((res) => res.json());
  return allOrderAccept;
};

export const OrdersStatusFunc = {
  loader,
  element: (
    <ProtectedRoute>
      <OrdersStatus />
    </ProtectedRoute>
  ),
};
