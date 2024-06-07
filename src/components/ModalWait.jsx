import { Alert, DatePicker, Modal, Spin } from "antd";
import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import useLocalStorage from "../hooks/useLocalStorage";
import { Form, Link } from "react-router-dom";
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
  const [dateString, setDateString] = useState("");
  const showModal = (key) => {
    return key === "Details" ? setIsModalOpen(true) : setIsStatusOpen(true);
  };
  const handleOk = (key) => {
    return key === "Details" ? setIsModalOpen(false) : setIsStatusOpen(false);
  };
  const handleCancel = (key) => {
    return key === "Details" ? setIsModalOpen(false) : setIsStatusOpen(false);
  };
  const onChange = (date, dateString) => {
    setDateString(dateString);
    // console.log(dateString);
  };
  const handleChangePay = (e) => {
    setPaymentCode(e.target.value);
  };
  const handleChangeTot = (e) => {
    setTotalCost(e.target.value);
  };

  const handleAccept = (product_id) => {
    if (totalCost === "" || paymentCode === "" || dateString === "") {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);

    if (totalCost !== "") {
      fetch(`http://localhost:4000/orders/${product_id}/accept`, {
        signal,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
        body: JSON.stringify({
          totalCost: totalCost,
          paymentCode: paymentCode,
          deliveryTime: dateString,
        }),
        method: "put",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
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

          window.location.reload();
        });
    }

    return () => {
      abortController.abort();
    };
  };

  const handleDeny = (product_id) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);
    fetch(`http://localhost:4000/orders/${product_id}/deny`, {
      signal,
      headers: {
        authorization: `Bearer ${localStorage.getItem("tkn")}`,
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

        window.location.reload();
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
          className=" fixed top-[9%]  z-50  translate-x-1/2 right-1/2  "
        />
      ) : error ? (
        <Alert
          message={error.message}
          type="error"
          showIcon
          className=" fixed top-[9%]  z-50  translate-x-1/2 right-1/2  "
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
                {t("OrderStatus.Details")}
              </span>
              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 group-hover:-translate-x-full h-full"></span>
              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 group-hover:translate-x-full h-full"></span>

              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
              <span className="absolute delay-300 top-0 left-0 w-full bg-gray-200 duration-500 group-hover:translate-y-full h-full"></span>
            </button>
          </h6>
          <Modal
            title={t("OrderStatus.Details")}
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
                  {t("OrderStatus.Name")} :
                </h1>{" "}
                <h1 className=" text-xl text-gray-200 min-w-[80px]  max-w-[72%]">
                  {order.product.product_name}
                </h1>
              </div>
              <div className=" w-full flex flex-wrap gap-2 items-center ">
                {" "}
                <h1 className="text-2xl font-medium text-[#ad8d36]">
                  {t("OrderStatus.OrderId")}
                </h1>{" "}
                <h1 className=" text-xl text-gray-200 min-w-[80px]  max-w-[72%]">
                  {order._id}
                </h1>
              </div>
              <div className=" w-full flex flex-wrap gap-2 items-center">
                {" "}
                <h1 className="text-2xl font-medium text-[#ad8d36]">
                  {t("OrderStatus.Quantity")} :
                </h1>{" "}
                <h1 className=" text-xl text-gray-200">
                  {order.product.quantity}
                </h1>
              </div>
              {order.product.notes && (
                <div className=" w-full flex flex-wrap gap-2 items-center">
                  {" "}
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    {t("OrderStatus.Notes")}
                  </h1>{" "}
                  <h1 className=" text-xl text-gray-200">
                    {order.product.notes}
                  </h1>
                </div>
              )}

              <div className=" w-full flex flex-wrap gap-2 items-center ">
                {" "}
                <h1 className="text-2xl font-medium text-[#ad8d36]">
                  {t("OrderStatus.File_Name")} :
                </h1>{" "}
                <h1 className=" text-xl text-gray-200 min-w-[80px]   max-w-[72%]">
                  <Link to={order.product.file}> {order.product.file}</Link>
                </h1>
              </div>
              <div className="w-full flex flex-wrap gap-2 items-center mt-5">
                <h1 className="text-2xl font-medium text-gray-200 w-full mb-5">
                  {t("Home.RequiredData")}
                </h1>{" "}
                {order.product.data.map((item) => (
                  <div key={item._id} className=" space-y-3">
                    <div className="w-full flex flex-wrap gap-2 items-center">
                      <h1 className="text-2xl font-medium text-[#ad8d36]  min-w-[80px]   max-w-[72%]">
                        {item.field_name} :
                      </h1>{" "}
                      <h1 className="text-xl text-gray-200 min-w-[80px]  max-w-[72%]">
                        {item.value}
                      </h1>
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
                {t("OrderStatus.Accept")}
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
                  t("OrderStatus.Deny")
                )}
              </button>
            </div>
          </h6>

          <Modal
            title={t("OrderStatus.Accept")}
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
                    {t("OrderStatus.TotalCost")}
                  </label>
                  <input
                    required
                    onChange={handleChangeTot}
                    value={totalCost}
                    type="text"
                    id="totalCost"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={t("OrderStatus.TotalCost")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="paymentCode"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("OrderStatus.PaymentCode")}
                  </label>
                  <input
                    required
                    value={paymentCode}
                    onChange={handleChangePay}
                    type="text"
                    id="paymentCode"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={t("OrderStatus.PaymentCode")}
                  />
                </div>
                <div>
                  {" "}
                  <label
                    htmlFor="deliveryTime"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("OrderStatus.DeliveryTime")}
                  </label>
                  <DatePicker
                    required
                    className="border focus-within:!bg-gray-700 hover:bg-gray-700 focus:bg-gray-700  active:bg-gray-700 text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600  !text-gray-200  hover:border-gray-600 focus:border-gray-600 active:border-gray-600 placeholder-shown:text-gray-200 placeholder:text-gray-200"
                    onChange={onChange}
                    placeholder={null}
                    format={{
                      format: "YYYY-MM-DD",
                      type: "mask",
                    }}
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
                      t("OrderStatus.Accept")
                    )}
                  </button>

                  <button
                    onClick={() => handleCancel("Accept")}
                    className="py-2 px-4 shadow-sm text-sm font-medium rounded-md text-gray-200 bg-transparent hover:bg-[#7f6727] border-[#7f6727] duration-300 border-2"
                  >
                    {t("OrderStatus.Cancel")}
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
