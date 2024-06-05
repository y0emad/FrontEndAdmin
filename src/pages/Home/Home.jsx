import { useTranslation } from "react-i18next";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  ReadOutlined,
  UpSquareOutlined,
} from "@ant-design/icons";
import { Alert, Card, Popover } from "antd";
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
  useEffect(() => {
    document.title = "Helwan Printing Press";
  }, []);
  const handleDelete = async (proId) => {
    // console.log(proId);
    try {
      const res = await fetch(`http://localhost:4000/products/${proId}`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
        signal: new AbortController().signal,
      });
      if (res.ok) {
        const data = await res.json();
        setAlert(
          <Alert
            message={t("Home.Productdelete")}
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
  const handleShow = async (proId) => {
    // console.log(proId);
    try {
      const res = await fetch(`http://localhost:4000/products/show/${proId}`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
        signal: new AbortController().signal,
      });
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        setAlert(
          <Alert
            message={t("Home.Productshow")}
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
  const handleHide = async (proId) => {
    // console.log(proId);
    try {
      const res = await fetch(`http://localhost:4000/products/hide/${proId}`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
        signal: new AbortController().signal,
      });
      if (res.ok) {
        const data = await res.json();
        setAlert(
          <Alert
            message={t("Home.ProductHide")}
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
    <div className=" relative ">
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

      <div className="  text-gray-200 ">
        <h2 className="fontBold text-2xl  m-10 mb-15">
          {t("Home.all_products")}
        </h2>
        <div className=" flex justify-evenly  flex-wrap mr-5 ml-5 gap-10 ">
          {all_products.message === "No Products found" ||
          all_products.message === "No products found for the given query." ? (
            <h1 className=" text-2xl font-medium">{t("Home.Nofound")}</h1>
          ) : (
            all_products.data.map((product) => (
              <div key={product._id}>
                <Card
                  key={product._id}
                  style={{
                    width: 300,
                  }}
                  cover={
                    <>
                      <img
                        alt={`${product.name}`}
                        src={`${product.image}`}
                        className={`w-full h-64 ${
                          product.deleted ? "brightness-50 relative" : ""
                        }`}
                      />
                      {product.deleted && (
                        <div className=" content-center absolute top-[-1px] left-auto text-center text-xl font-medium text-gray-200 !w-[300.2px] h-[60px] rounded-t-lg bg-gradient-to-b from-[#000915] to-[#0009158b]">
                          {t("Home.TheProdHidd")}
                        </div>
                      )}
                    </>
                  }
                  actions={[
                    <Popover content={t("Home.View")}>
                      <button
                        onClick={() => showModal(product)}
                        className=" hover:!text-[#000915] text-2xl "
                      >
                        <ReadOutlined
                          key="view"
                          className=" hover:!text-[#000915]"
                        />
                      </button>
                    </Popover>,
                    <Popover content={t("Home.Edit")}>
                      <Link
                        to={`/EditProduct/${product._id}`}
                        className=" hover:!text-[#000915] text-2xl mt-1"
                      >
                        <EditOutlined key="edit" />
                      </Link>
                    </Popover>,
                    <Popover content={t("Home.Delete")}>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className=" hover:!text-red-500 text-2xl"
                      >
                        {" "}
                        <DeleteOutlined key="Delete" />
                      </button>
                    </Popover>,
                    product.deleted ? (
                      <Popover content={t("Home.Show")}>
                        <button
                          onClick={() => handleShow(product._id)}
                          className=" hover:!text-[#000915] text-2xl"
                        >
                          {" "}
                          <EyeOutlined key="Show" />
                        </button>
                      </Popover>
                    ) : (
                      <Popover content={t("Home.Hide")}>
                        <button
                          onClick={() => handleHide(product._id)}
                          className=" hover:!text-red-500 text-2xl"
                        >
                          {" "}
                          <EyeInvisibleOutlined key="disable" />
                        </button>
                      </Popover>
                    ),
                  ]}
                >
                  <Meta title={product.name} className="!text-[#000915]" />
                </Card>
              </div>
            ))
          )}
        </div>
        {alert}
      </div>
      {all_products.message === "No Products found" ||
      all_products.message === "No products found for the given query."
        ? null
        : selectedProduct && (
            <ProductModal
              open={modalOpen}
              handleOk={handleOk}
              handleCancel={handleCancel}
              product={selectedProduct}
              t={t}
            />
          )}
      <Popover content="Chats">
        <Link
          to="/AdminChats"
          className=" fixed bottom-10 w-fit h-fit rounded-full text-gray-200 left-10 bg-[#000915] "
        >
          {" "}
          <CommentOutlined className=" text-4xl hover:text-[#7f6727]" />
        </Link>
      </Popover>
    </div>
  );
}

const loader = async ({ request: { signal, url } }) => {
  const searchParams = new URL(url).searchParams;
  let query = searchParams.get("query") || "";

  if (query) {
    let all_products = await fetch(
      `http://localhost:4000/products/search/${query}`,
      {
        signal: signal,
        headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
      }
    );

    return all_products;
  }

  const all_products = await fetch(
    "http://localhost:4000/products/GetAllProducts",
    {
      signal: signal,
      headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
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
