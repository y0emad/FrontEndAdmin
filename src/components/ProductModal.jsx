import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ProductModal = ({ open, handleOk, handleCancel, product, t }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(`https://printing-sys-fojo.vercel.app/products/${product._id}`, {
      signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.data);
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
  }, [product._id]);

  return (
    <Modal
      title={t("ModalMyPro.Details")}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
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
      ) : error ? (
        <div className="text-red-500 ">Error: {error}</div>
      ) : (
        <div className="flex flex-wrap gap-5 mt-8 items-center">
          <div className="w-full flex flex-wrap gap-2 items-start">
            <h1 className="text-2xl font-medium text-[#ad8d36] ">
              {t("Home.Name")} :
            </h1>{" "}
            <h1 className="text-xl text-gray-200 min-w-[80px] max-w-[367px]">
              {products.name}
            </h1>
          </div>
          <div className="w-full flex flex-wrap gap-2 items-start">
            <h1 className="text-2xl font-medium text-[#ad8d36]">
              {t("Home.Description")} :
            </h1>{" "}
            <h1 className="text-xl text-gray-200 min-w-[80px] max-w-[367px]">
              {products.description}
            </h1>
          </div>
          <div className="w-full flex flex-wrap gap-2 items-start  ">
            <h1 className="text-2xl font-medium text-[#ad8d36]">
              {t("Home.Image")} :
            </h1>{" "}
            <h1 className="text-xl text-gray-200 min-w-[80px]   max-w-[367px]">
              <Link to={products.image}>{products.image}</Link>
            </h1>
          </div>
          <div className="w-full flex flex-wrap gap-2 items-center">
            <h1 className="text-2xl font-medium text-gray-200 w-full mb-5">
              {t("Home.RequiredData")}
            </h1>{" "}
            {products.requiredData?.map((data) => (
              <div key={data._id} className=" space-y-3">
                <div className="w-full flex flex-wrap gap-2 items-start">
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    {t("Home.Name")} :
                  </h1>{" "}
                  <h1 className="text-xl text-gray-200 min-w-[80px] max-w-[367px]">
                    {data.name}
                  </h1>
                </div>
                <div className="w-full flex flex-wrap gap-2 items-center">
                  <h1 className="text-2xl font-medium text-[#ad8d36]">
                    {t("Home.Required")} :
                  </h1>{" "}
                  <h1 className="text-xl text-gray-200">
                    {data.required ? t("Home.stYes") : t("Home.stNo")}
                  </h1>
                </div>
                {data.hasChoices && (
                  <div className="w-full flex flex-wrap gap-2 items-start">
                    <h1 className="text-2xl font-medium  text-[#ad8d36]">
                      {t("Home.Choices")} :
                    </h1>{" "}
                    <h1 className="text-xl text-gray-200 min-w-[80px] max-w-[367px]">
                      {data.choices.join(" - ")}
                    </h1>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductModal;
