import { Modal } from "antd";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import useLocalStorage from "../hooks/useLocalStorage";
import { Form } from "react-router-dom";
export default function ModalWait({ num }) {
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const showModal = (key) => {
    return key === "Details" ? setIsModalOpen(true) : setIsStatusOpen(true);
  };
  const handleOk = (key) => {
    return key === "Details" ? setIsModalOpen(false) : setIsStatusOpen(false);
  };
  const handleCancel = (key) => {
    return key === "Details" ? setIsModalOpen(false) : setIsStatusOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-[550px]:gap-7 border-t border-[#7f6727] py-6">
        <div className="flex items-center  flex-col   min-[550px]:flex-row gap-3 min-[550px]:gap-6 w-full justify-center lg:justify-start lg:max-w-xl lg:mx-auto">
          <div className="pro-data  max-w-sm w-auto  ">
            <h5 className="font-semibold text-xl  leading-8 text-gray-200 max-[550px]:text-center">
              Latest N-5 Perfuam
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
                <h1 className=" text-xl text-gray-200 min-w-[80px] max-w-[367px]">
                  Perfume Bottle
                </h1>
              </div>
              <div className=" w-full flex flex-wrap gap-2 items-center">
                {" "}
                <h1 className="text-2xl font-medium text-[#ad8d36]">
                  {t("ModalMyPro.Quantity")} :
                </h1>{" "}
                <h1 className=" text-xl text-gray-200">7</h1>
              </div>

              <div className=" w-full flex flex-wrap gap-2 items-center ">
                {" "}
                <h1 className="text-2xl font-medium text-[#ad8d36]">
                  {t("ModalMyPro.File_Name")} :
                </h1>{" "}
                <h1 className=" text-xl text-gray-200 min-w-[80px] max-w-[367px]">
                  fdssssssssssssssssDFDSffffffffdsaaaa
                </h1>
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
            <div class="max-w-32 bg-transparent items-center justify-center flex border-2 border-red-500 shadow-lg hover:bg-red-500 text-red-500 hover:text-white duration-300 cursor-pointer active:scale-[0.98]">
              <button class="px-5 py-2">Reject</button>
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
              <div class="grid gap-6 mb-6 mt-10 grid-cols-1">
                <div>
                  <label
                    htmlFor="totalCost"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Total Cost
                  </label>
                  <input
                    type="text"
                    name="totalCost"
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
                    type="text"
                    name="paymentCode"
                    id="paymentCode"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Payment Code"
                    required
                  />
                </div>
                <div className=" gap-5 flex ">
                  <button className="  py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-200 bg-[#7f6727] hover:bg-gray-200 duration-300 hover:text-[#000915] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7f6727]">
                    Accept
                  </button>
                  <button
                    onClick={() => handleCancel("Accept")}
                    className=" py-2 px-4 shadow-sm text-sm font-medium rounded-md text-gray-200 bg-transparent hover:bg-[#7f6727] border-[#7f6727] duration-300 border-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
}
