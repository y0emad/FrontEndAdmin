import { useTranslation } from "react-i18next";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEffect } from "react";
import ModalWait from "../../components/ModalWait";
import { useLoaderData } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import { UpSquareOutlined } from "@ant-design/icons";
function WaitingPage() {
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const ordersWait = useLoaderData();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  return ordersWait.message === "No orders found." ? (
    <h2 className="title font-manrope  mt-9 font-bold text-4xl leading-10 mb-8 text-center text-gray-200">
      {ordersWait.message}
    </h2>
  ) : (
    <div>
      <ScrollToTop
        smooth
        top={400}
        style={{
          bottom: "16px",
          backgroundColor: "#000915",
          width: "21px",
          height: "21px",
        }}
        component={
          <UpSquareOutlined className=" text-gray-200 text-2xl  hover:text-[#7f6727]" />
        }
      />{" "}
      <section className="py-24 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
          <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-gray-200">
            Waiting List
          </h2>
          <div className="hidden lg:grid grid-cols-2 py-6">
            <div className="font-normal text-xl leading-8 text-gray-200">
              Product Name
            </div>
            <p className="font-normal text-xl leading-8 text-gray-200 justify-evenly flex items-center  ">
              <span className="w-full max-w-[176px] text-center ms-[195px]">
                Response
              </span>
            </p>
          </div>
          {ordersWait.data.map((order) => (
            <ModalWait {...order} key={order._id} />
          ))}
        </div>
      </section>
    </div>
  );
}

const loader = async ({ request }) => {
  const ordersWait = await fetch(
    "https://printing-sys-fojo.vercel.app/orders",
    {
      method: "GET",
      signal: request.signal,
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI5ODFjNWQ5NTNiYTEwODE2Y2U2MzAiLCJ1c2VybmFtZSI6InlvdXNlZiIsImVtYWlsIjoieS5lbWFkODVAeWFob28uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE0NTE5MzgyLCJleHAiOjE3MTQ2MDU3ODJ9.Xi4T-M0TtyVYQoiZlN4f9YR-_N9jEC1vtqxejLNlWbk`,
      },
    }
  ).then((res) => res.json());
  // console.log(ordersWait);
  return ordersWait;
};

export const WaitingPageFunc = { loader, element: <WaitingPage /> };
