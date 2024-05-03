import { useTranslation } from "react-i18next";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import {
  DeleteOutlined,
  EditOutlined,
  ReadOutlined,
  UpSquareOutlined,
} from "@ant-design/icons";
import { Alert, Card } from "antd";
import "../../index.css";
import "./home.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import ProductModal from "../../components/ProductModal";
const { Meta } = Card;

function Home() {
  const all_products = useLoaderData();
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alert, setAlert] = useState(null);

  const showModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleOk = () => {
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const handleDelete = async (proId) => {
    console.log(proId);
    try {
      const res = await fetch(
        `http://localhost:4000/products/Delete/${proId}`,
        {
          method: "put",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tkn")}`,
          },
          signal: new AbortController().signal,
        }
      );
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        setAlert(
          <Alert
            message={data.message}
            type="success"
            showIcon
            className=" fixed top-[9%]   translate-x-1/2 right-1/2  "
          />
        );

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.log("Error:", error);

      setAlert(
        <Alert
          message={error.message}
          type="error"
          showIcon
          className=" fixed top-[9%]   translate-x-1/2 right-1/2  "
        />
      );
    }
  };

  return (
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
      />

      <div className=" text-gray-200 ">
        <h2 className="fontBold text-2xl  m-10 mb-15">
          {t("Home.all_products")}
        </h2>
        <div className=" flex justify-evenly  flex-wrap mr-5 ml-5 gap-10 ">
          {all_products.data.map((product) => (
            <div key={product._id}>
              <Card
                key={product._id}
                style={{
                  width: 300,
                }}
                cover={
                  <img
                    alt={`${product.name}`}
                    src={`${product.image}`}
                    className="w-full h-64"
                  />
                }
                actions={[
                  <button
                    onClick={() => showModal(product)}
                    className=" hover:!text-[#000915] text-2xl "
                  >
                    <ReadOutlined
                      key="view"
                      className=" hover:!text-[#000915]"
                    />
                  </button>,

                  <Link
                    to={`/EditProduct/${product._id}`}
                    className=" hover:!text-[#000915] text-2xl"
                  >
                    <EditOutlined key="edit" />
                  </Link>,
                  <button
                    onClick={() => handleDelete(product._id)}
                    className=" hover:!text-red-500 text-2xl"
                  >
                    {" "}
                    <DeleteOutlined key="Delete" />
                  </button>,
                ]}
              >
                <Meta title={product.name} className="!text-[#000915]" />
              </Card>
            </div>
          ))}
        </div>
        {alert}
      </div>
      {selectedProduct && (
        <ProductModal
          open={modalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          product={selectedProduct}
          t={t}
        />
      )}
    </div>
  );
}

const loader = async ({ request: { signal } }) => {
  const all_products = await fetch(
    "https://printing-sys-fojo.vercel.app/products",
    {
      signal,
    }
  );

  return all_products;
};

export const HomeFunc = {
  element: (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  ),
  loader,
};
