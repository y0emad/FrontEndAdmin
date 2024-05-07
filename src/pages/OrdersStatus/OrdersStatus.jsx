import { useTranslation } from "react-i18next";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEffect } from "react";
import ModalOrder from "../../components/ModalOrder";
import { useLoaderData } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
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
      {allOrderAccept.message === "No accepted orders found." ? (
        <h1 className="title font-manrope font-bold text-4xl  text-center pt-10 text-gray-200">
          {allOrderAccept.message}
        </h1>
      ) : (
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
      )}
    </div>
  );
}

const loader = async ({ request: { signal } }) => {
  const allOrderAccept = await fetch(
    "http://localhost:4000/orders/acceptedOrders",
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
