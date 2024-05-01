import { Alert, Modal, Spin } from "antd";
import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import useLocalStorage from "../hooks/useLocalStorage";
import { Form } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
export default function ModalWait(order) {
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const [totalCost, setTotalCost] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const showModal = (key) => {
    return key === "Details" ? setIsModalOpen(true) : setIsStatusOpen(true);
  };
  const handleOk = (key) => {
    return key === "Details" ? setIsModalOpen(false) : setIsStatusOpen(false);
  };
  const handleCancel = (key) => {
    return key === "Details" ? setIsModalOpen(false) : setIsStatusOpen(false);
  };
  const handleChangePay = (e) => {
    setPaymentCode(e.target.value);
  };
  const handleChangeTot = (e) => {
    setTotalCost(e.target.value);
  };

  const handleAccept = (product_id) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(`http://localhost:4000/orders/${product_id}/accept`, {
      signal,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI5ODFjNWQ5NTNiYTEwODE2Y2U2MzAiLCJ1c2VybmFtZSI6InlvdXNlZiIsImVtYWlsIjoieS5lbWFkODVAeWFob28uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE0NTE5MzgyLCJleHAiOjE3MTQ2MDU3ODJ9.Xi4T-M0TtyVYQoiZlN4f9YR-_N9jEC1vtqxejLNlWbk`,
      },
      body: JSON.stringify({ totalCost: totalCost, paymentCode: paymentCode }),
      method: "put",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        setMsg(data.message);
        setError(null);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
        } else {
          setError(error.message);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      abortController.abort();
    };
  };
  const handleDeny = (product_id) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(`http://localhost:4000/orders/${product_id}/deny`, {
      signal,
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI5ODFjNWQ5NTNiYTEwODE2Y2U2MzAiLCJ1c2VybmFtZSI6InlvdXNlZiIsImVtYWlsIjoieS5lbWFkODVAeWFob28uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE0NTE5MzgyLCJleHAiOjE3MTQ2MDU3ODJ9.Xi4T-M0TtyVYQoiZlN4f9YR-_N9jEC1vtqxejLNlWbk`,
      },
      method: "delete",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        setMsg(data.message);
        setError(null);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
        } else {
          setError(error.message);
        }
      })
      .finally(() => {
        setLoading(false);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });

    return () => {
      abortController.abort();
    };
  };

  return (
    <>
      {msg ? (
        <Alert
          message={msg}
          type="success"
          showIcon
          className=" fixed top-[9%]   translate-x-1/2 right-1/2  "
        />
      ) : error ? (
        <Alert
          message={error.message}
          type="error"
          showIcon
          className=" fixed top-[9%]   translate-x-1/2 right-1/2  "
        />
      ) : null}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-[550px]:gap-7 border-t border-[#7f6727] py-6">
        <div className="flex items-center  flex-col   min-[550px]:flex-row gap-3 min-[550px]:gap-6 w-full justify-center lg:justify-start lg:max-w-xl lg:mx-auto">
          <div className="pro-data  max-w-sm w-auto  ">
            <h5 className="font-semibold text-xl  leading-8 text-gray-200 max-[550px]:text-center">
              {order.product.product_name}
            </h5>
          </div>
        </div>
        <div className="flex items-center justify-evenly flex-col min-[550px]:flex-row w-full max-xl:max-w-xl max-xl:mx-auto gap-2">
          <h6 className="font-manrope font-bold text-2xl  leading-9 text-gray-200 w-full max-w-[176px] text-center">
            <button
              onClick={() => showModal("Details")}
              className="cursor-pointer relative group overflow-hidden border-2 px-8 py-2 border-gray-200"
            >
              <span className="font-bold text-[#000915] text-xl relative z-10 group-hover:text-gray-200 duration-500">
                {t("ModalMyPro.Details")}
              </span>
              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 group-hover:-translate-x-full h-full"></span>
              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 group-hover:translate-x-full h-full"></span>

              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
              <span className="absolute delay-300 top-0 left-0 w-full bg-gray-200 duration-500 group-hover:translate-y-full h-full"></span>
            </button>
          </h6>
          <Modal
            title={t("ModalMyPro.Details")}
            open={isModalOpen}
            onOk={() => handleOk("Details")}
            key="Details"
            footer={null}
            onCancel={() => handleCancel("Details")}
          >
            <div className="flex flex-wrap gap-5 mt-8  items-center">
              <div className=" w-full flex flex-wrap gap-2 items-center ">
                {" "}
                <h1 className="text-2xl font-medium text-[#ad8d36]">
                  {t("ModalMyPro.Name")} :
                </h1>{" "}
                <h1 className=" text-xl text-gray-200 min-w-[80px]  max-w-[72%]">
                  {order.product.product_name}
                </h1>
              </div>
              <div className=" w-full flex flex-wrap gap-2 items-center ">
                {" "}
                <h1 className="text-2xl font-medium text-[#ad8d36]">
                  OrderId :
                </h1>{" "}
                <h1 className=" text-xl text-gray-200 min-w-[80px]  max-w-[72%]">
                  {order._id}
                </h1>
              </div>
              <div className=" w-full flex flex-wrap gap-2 items-center">
                {" "}
                <h1 className="text-2xl font-medium text-[#ad8d36]">
                  {t("ModalMyPro.Quantity")} :
                </h1>{" "}
                <h1 className=" text-xl text-gray-200">
                  {order.product.quantity}
                </h1>
              </div>

              <div className=" w-full flex flex-wrap gap-2 items-start ">
                {" "}
                <h1 className="text-2xl font-medium text-[#ad8d36]">
                  {t("ModalMyPro.File_Name")} :
                </h1>{" "}
                <h1 className=" text-xl text-gray-200 min-w-[80px]   max-w-[72%]">
                  {order.product.file}
                </h1>
              </div>
              <div className="w-full flex flex-wrap gap-2 items-center mt-5">
                <h1 className="text-2xl font-medium text-gray-200 w-full mb-5">
                  {t("Home.RequiredData")}
                </h1>{" "}
                {order.product.data.map((item) => (
                  <div key={item._id} className=" space-y-3">
                    <div className="w-full flex flex-wrap gap-2 items-center">
                      <h1 className="text-2xl font-medium text-[#ad8d36]">
                        {t("Home.Name")} :
                      </h1>{" "}
                      <h1 className="text-xl text-gray-200 min-w-[80px]  max-w-[72%]">
                        {item.field_name}
                      </h1>
                      <h1 className="text-2xl font-medium text-[#ad8d36]">
                        Value :
                      </h1>{" "}
                      <h1 className="text-xl text-gray-200">{item.value}</h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>

          <h6 className="text-gray-200 font-manrope  font-bold text-2xl leading-9 w-full max-w-[176px] text-center">
            <button
              onClick={() => showModal("Status")}
              className="cursor-pointer relative group overflow-hidden border-2 px-8 py-2 border-green-500"
            >
              <span className="font-bold text-[#000915] text-xl relative z-10 group-hover:text-gray-200 duration-500">
                Accept
              </span>
              <span className="absolute top-0 left-0 w-full bg-green-500 duration-500 group-hover:-translate-x-full h-full"></span>
              <span className="absolute top-0 left-0 w-full bg-green-500 duration-500 group-hover:translate-x-full h-full"></span>

              <span className="absolute top-0 left-0 w-full  bg-green-500 duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
              <span className="absolute delay-300 top-0 left-0 w-full bg-green-500 duration-500 group-hover:translate-y-full h-full"></span>
            </button>
          </h6>
          <h6 className="text-gray-200 font-manrope  font-bold text-lg leading-9 w-full max-w-[176px] text-center">
            <div className="max-w-32 bg-transparent items-center justify-center flex border-2 border-red-500 shadow-lg hover:bg-red-500 text-red-500 hover:text-white duration-300 cursor-pointer active:scale-[0.98]">
              <button
                disabled={loading}
                onClick={() => handleDeny(order._id)}
                className="px-5 py-2"
              >
                Reject
              </button>
            </div>
          </h6>

          <Modal
            title="Accept"
            open={isStatusOpen}
            onOk={() => handleOk("Accept")}
            key="Accept"
            footer={null}
            onCancel={() => handleCancel("Accept")}
          >
            {" "}
            <Form>
              <div className="grid gap-6 mb-6 mt-10 grid-cols-1">
                <div>
                  <label
                    htmlFor="totalCost"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Total Cost
                  </label>
                  <input
                    onChange={handleChangeTot}
                    value={totalCost}
                    type="text"
                    id="totalCost"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Total Cost"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="paymentCode"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Payment Code
                  </label>
                  <input
                    value={paymentCode}
                    onChange={handleChangePay}
                    type="text"
                    id="paymentCode"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Payment Code"
                    required
                  />
                </div>
                <div className="gap-5 flex">
                  <button
                    disabled={loading}
                    onClick={() => handleAccept(order._id)}
                    className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-200 bg-[#7f6727] hover:bg-gray-200 duration-300 hover:text-[#000915] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7f6727]"
                  >
                    {loading ? (
                      <Spin
                        size="large"
                        indicator={
                          <LoadingOutlined
                            style={{
                              fontSize: 24,
                              color: "#e5e7eb",
                            }}
                            spin
                          />
                        }
                      />
                    ) : (
                      "Accept"
                    )}
                  </button>

                  <button
                    onClick={() => handleCancel("Accept")}
                    className="py-2 px-4 shadow-sm text-sm font-medium rounded-md text-gray-200 bg-transparent hover:bg-[#7f6727] border-[#7f6727] duration-300 border-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
      ;
    </>
  );
}

// const loader = async ({ request: { signal } }) => {
//   const ordersWait = await fetch(
//     `http://localhost:4000/orders/${}/accept`,
//     {
//       signal,
//     }
//   ).then((res) => res.json());
//   return ordersWait;
// };
