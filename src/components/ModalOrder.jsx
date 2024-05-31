import { Alert, Modal, Spin } from "antd";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import useLocalStorage from "../hooks/useLocalStorage";
import { Form, Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { use } from "i18next";
export default function ModalOrder(order) {
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const [status, setStatus] = useState(order.status);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  // console.log(order);
  useEffect(() => {
    setStatus(order.status);
    // window.location.reload();
  }, []);
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDetailsUser, setIsDetailsUser] = useState(false);
  const [msg, setMsg] = useState("");

  const showModal = (key) => {
    return key === "Details"
      ? setIsModalOpen(true)
      : key === "Status"
      ? setIsStatusOpen(true)
      : setIsDetailsUser(true);
  };
  const handleOk = (key) => {
    return key === "Details"
      ? setIsModalOpen(false)
      : key === "Status"
      ? setIsStatusOpen(false)
      : setIsDetailsUser(false);
  };
  const handleCancel = (key) => {
    return key === "Details"
      ? setIsModalOpen(false)
      : key === "Status"
      ? setIsStatusOpen(false)
      : setIsDetailsUser(false);
  };
  // console.log(message);
  const handleSub = (prodId) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    if (message && message.length > 0) {
      fetch(`http://localhost:4000/orders/${prodId}/sendMessage`, {
        signal,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
        body: JSON.stringify({ message }),
        method: "post",
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
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        })
        .finally(() => setLoading(false));
    }

    fetch(`http://localhost:4000/orders/${prodId}/status`, {
      signal,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
      body: JSON.stringify({ status }),
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
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      abortController.abort();
    };
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(`http://localhost:4000/orders/${order._id}`, {
      signal,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },

      method: "get",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        // setMsg(data.message);
        // console.log("data user", data);
        setError(null);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      })
      .finally(() => setLoading(false));
  }, [order.id]);
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
              className="cursor-pointer relative group overflow-hidden border-2 px-4 py-2 border-gray-200"
            >
              <span className="font-bold text-[#000915] text-xl relative z-10 group-hover:text-gray-200 duration-500">
                Order's Details
              </span>
              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 group-hover:-translate-x-full h-full"></span>
              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 group-hover:translate-x-full h-full"></span>

              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
              <span className="absolute delay-300 top-0 left-0 w-full bg-gray-200 duration-500 group-hover:translate-y-full h-full"></span>
            </button>
          </h6>
          <Modal
            title="Order's Details"
            open={isModalOpen}
            onOk={() => handleOk("Details")}
            key="Details"
            footer={null}
            onCancel={() => handleCancel("Details")}
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
              <div className="flex flex-wrap gap-5 mt-8  items-center">
                <div className=" w-full flex flex-wrap gap-2 items-center ">
                  {" "}
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    Order Id:
                  </h1>{" "}
                  <h1 className=" text-xl text-gray-200 ">{order._id}</h1>
                </div>

                <div className=" w-full flex flex-wrap gap-2 items-start ">
                  {" "}
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    {t("ModalMyPro.Name")} :
                  </h1>{" "}
                  <h1 className=" text-xl text-gray-200  min-w-[80px]   max-w-[72%]">
                    {order.product.product_name}
                  </h1>
                </div>
                <div className=" w-full flex flex-wrap gap-2 items-center">
                  {" "}
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    {t("ModalMyPro.Quantity")} :
                  </h1>{" "}
                  <h1 className=" text-xl text-gray-200">
                    {" "}
                    {order.product.quantity}
                  </h1>
                </div>
                {order.product.notes && (
                  <div className=" w-full flex flex-wrap gap-2 items-center">
                    {" "}
                    <h1 className="text-2xl font-medium text-[#ad8d36]">
                      Notes :
                    </h1>{" "}
                    <h1 className=" text-xl text-gray-200">
                      {" "}
                      {order.product.notes}
                    </h1>
                  </div>
                )}

                <div className=" w-full flex flex-wrap gap-2 items-start ">
                  {" "}
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    {t("ModalMyPro.File_Name")} :
                  </h1>{" "}
                  <h1 className=" text-xl text-gray-200  min-w-[80px]   max-w-[72%]">
                    <Link to={order.product.file}>{order.product.file}</Link>
                  </h1>
                </div>
                {order.product.data.map((item) => (
                  <div key={item._id} className=" space-y-3">
                    <div className="w-full flex flex-wrap gap-2 items-center">
                      <h1 className="text-2xl font-medium text-[#ad8d36]">
                        {item.field_name} :
                      </h1>{" "}
                      <h1 className="text-xl text-gray-200">{item.value}</h1>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal>

          <h6 className="font-manrope font-bold text-2xl  leading-9 text-gray-200 w-full max-w-[176px] text-center">
            <button
              onClick={() => showModal("DetailsUser")}
              className="cursor-pointer relative group overflow-hidden border-2 px-4 py-2 border-gray-200"
            >
              <span className="font-bold text-[#000915] text-xl relative z-10 group-hover:text-gray-200 duration-500">
                User's Details
              </span>
              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 group-hover:-translate-x-full h-full"></span>
              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 group-hover:translate-x-full h-full"></span>

              <span className="absolute top-0 left-0 w-full bg-gray-200 duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
              <span className="absolute delay-300 top-0 left-0 w-full bg-gray-200 duration-500 group-hover:translate-y-full h-full"></span>
            </button>
          </h6>
          <Modal
            title="User's Details"
            open={isDetailsUser}
            onOk={() => handleOk("DetailsUser")}
            key="DetailsUser"
            footer={null}
            onCancel={() => handleCancel("DetailsUser")}
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
              <div className="flex flex-wrap gap-5 mt-8  items-center">
                <div className=" w-full flex flex-wrap gap-2 items-center ">
                  {" "}
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    User Id:
                  </h1>{" "}
                  <h1 className=" text-xl text-gray-200 min-w-[80px] max-w-[367px]">
                    {userData.data?.user_id._id}
                  </h1>
                </div>

                <div className=" w-full flex flex-wrap gap-2 items-center ">
                  {" "}
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    User Name :
                  </h1>{" "}
                  <h1 className=" text-xl text-gray-200 min-w-[80px] max-w-[367px]">
                    {userData.data?.user_id.username}
                  </h1>
                </div>
                <div className=" w-full flex flex-wrap gap-2 items-center">
                  {" "}
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    Email :
                  </h1>{" "}
                  <h1 className=" text-xl text-gray-200">
                    {" "}
                    {userData.data?.user_id.email}
                  </h1>
                </div>

                <div className=" w-full flex flex-wrap gap-2 items-center ">
                  {" "}
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    PhoneNumber :
                  </h1>{" "}
                  <h1 className=" text-xl text-gray-200 min-w-[80px] max-w-[367px]">
                    {userData.data?.user_id.phoneNumber}
                  </h1>
                </div>
              </div>
            )}
          </Modal>

          <h6 className="text-gray-200 font-manrope  font-bold text-2xl leading-9 w-full max-w-[176px] text-center">
            <button
              onClick={() => showModal("Status")}
              className="cursor-pointer relative group overflow-hidden border-2 px-8 py-2 border-[#ad8d36]"
            >
              <span className="font-bold text-[#000915] text-xl relative z-10 group-hover:text-gray-200 duration-500">
                Status
              </span>
              <span className="absolute top-0 left-0 w-full bg-[#ad8d36] duration-500 group-hover:-translate-x-full h-full"></span>
              <span className="absolute top-0 left-0 w-full bg-[#ad8d36] duration-500 group-hover:translate-x-full h-full"></span>

              <span className="absolute top-0 left-0 w-full  bg-[#ad8d36] duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
              <span className="absolute delay-300 top-0 left-0 w-full bg-[#ad8d36] duration-500 group-hover:translate-y-full h-full"></span>
            </button>
          </h6>

          <Modal
            title="Status Of Order"
            open={isStatusOpen}
            onOk={() => handleOk("Status")}
            key="Status"
            footer={null}
            onCancel={() => handleCancel("Status")}
          >
            {" "}
            <Form onSubmit={(e) => window.location.reload(e)}>
              <div className="grid gap-6  mb-6 mt-10 grid-cols-1">
                <div>
                  {" "}
                  <label
                    htmlFor="status"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                  >
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    id="status"
                    className=" border   text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200 focus:ring-[#ad8d36] focus:border-[#ad8d36]"
                  >
                    <option value={-1}>1) None</option>
                    <option value={0}>
                      2) You paid the bill for the book now will be printed
                    </option>
                    <option value={1}>
                      3) Printed of the book is finished
                    </option>
                    <option value={2}>
                      4) Covered of the book is finished
                    </option>
                    <option value={3}>5) The book is ready</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Message To User
                  </label>
                  <input
                    type="text"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Message"
                  />
                </div>
                <div className=" gap-5 flex ">
                  <button
                    onClick={() => handleSub(order._id)}
                    className="  py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-200 bg-[#7f6727] hover:bg-gray-200 duration-300 hover:text-[#000915] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7f6727]"
                  >
                    Submit
                  </button>
                  {/* <button
                    onClick={() => handleCancel("Status")}
                    className=" py-2 px-4 shadow-sm text-sm font-medium rounded-md text-gray-200 bg-transparent hover:bg-[#7f6727] border-[#7f6727] duration-300 border-2"
                  >
                    Cancel
                  </button> */}
                </div>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
}
