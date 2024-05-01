import { useTranslation } from "react-i18next";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEffect } from "react";
import ModalOrder from "../../components/ModalOrder";
import { useLoaderData } from "react-router-dom";
function OrdersStatus() {
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const allOrderAccept = useLoaderData();
  // console.log(allOrderAccept);
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  return (
    <div>
      {" "}
      <section className="py-24 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
          <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-gray-200">
            Order's Status
          </h2>
          <div className="hidden lg:grid grid-cols-2 py-6">
            <div className="font-normal text-xl leading-8 text-gray-200">
              Product Name
            </div>
          </div>
          {allOrderAccept.data.map((order) => (
            <ModalOrder {...order} key={order._id} />
          ))}
        </div>
      </section>
    </div>
  );
}

const loader = async ({ request: { signal } }) => {
  const allOrderAccept = await fetch(
    "http://localhost:4000/orders/acceptedOrders",
    {
      signal,
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI5ODFjNWQ5NTNiYTEwODE2Y2U2MzAiLCJ1c2VybmFtZSI6InlvdXNlZiIsImVtYWlsIjoieS5lbWFkODVAeWFob28uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE0NTE5MzgyLCJleHAiOjE3MTQ2MDU3ODJ9.Xi4T-M0TtyVYQoiZlN4f9YR-_N9jEC1vtqxejLNlWbk`,
      },
    }
  ).then((res) => res.json());
  return allOrderAccept;
};

export const OrdersStatusFunc = {
  loader,
  element: <OrdersStatus />,
};
