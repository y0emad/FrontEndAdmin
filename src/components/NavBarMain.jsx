import "../index.css";
import "../styles.css";
import logo from "../images/logo.png";
import { Select } from "antd";
import useLocalStorage from "../hooks/useLocalStorage";
import { Link, useNavigate } from "react-router-dom";
import {
  GlobalOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  LogoutOutlined,
  PlusSquareOutlined,
  ClockCircleOutlined,
  IssuesCloseOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { authContext } from "../Context/authentication";

export function NavBarMain() {
  const [t, i18n] = useTranslation("global");
  const [toggleMob, setToggleMob] = useState(true);
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const NavFunc = useNavigate();
  const { token, setToken } = useContext(authContext);
  useEffect(() => {
    i18n.changeLanguage(lang);
    const htmlDir = document.documentElement.getAttribute("dir");
    lang === "ar"
      ? document.documentElement.setAttribute("dir", "rtl")
      : document.documentElement.setAttribute("dir", "ltr");
  }, [lang]);

  const handleChangeLang = (value) => {
    setLang(() => value);
    i18n.changeLanguage(value);
  };
  const handleToggle = () => {
    const navlinks = document?.querySelector(".nav-links");
    setToggleMob((e) => !e);
    navlinks?.classList.toggle("top-[100%]");
  };
  function logOut() {
    localStorage.removeItem("tkn");
    setToken(null);
    setTimeout(() => {
      NavFunc("/LogIn");
    }, 2000);
  }
  return (
    <nav
      className={
        "grid grid-cols-3 h-16 bg-[#000915] z-50 items-center mx-auto fixed top-0 w-full"
      }
    >
      <div className="nav-links me-auto lg:m-3 lg:static  lg:min-h-fit lg:items-center absolute bg-[#000915] min-h-[25vh] bottom-[240%] grid  left-0 lg:w-auto lg:py-0  w-full  text-gray-200 fontMed ">
        <ul className="flex lg:flex-row flex-col lg:justify-start  justify-center items-end gap-5 mr-5 ml-5   lg:items-center ">
          {token ? <>
            <li>
              <Link
                to="/AddNewProduct"
                className="flex justify-center gap-2 text-nowrap hover:text-[#7f6727]"
              >
                {t("header.AddNewProduct")} <PlusSquareOutlined />
              </Link>
            </li>
            <li>
              <Link
                to="/OrdersStatus"
                className="flex justify-center gap-2 text-nowrap hover:text-[#7f6727]"
              >
                {t("header.Order'sStatus")}
                <ClockCircleOutlined />
              </Link>
            </li>
            <li>
              <Link
                to="/WaitingPage"
                className="flex justify-center gap-2 text-nowrap hover:text-[#7f6727]"
              >
                {t("header.TheWaitingList")}
                <IssuesCloseOutlined />
              </Link>
            </li>
            <li>
              <span
                onClick={logOut}
                className="flex  gap-2 justify-center text-nowrap  items-center  md:hidden hover:text-[#7f6727] cursor-pointer"
              >
                <span>{t("header.Log_out")}</span>
                <LogoutOutlined />
              </span>
            </li>
          </> : <>
            <>
              <li>
                <Link
                  to="/LogIn"
                  className="flex  gap-2 justify-center text-nowrap  items-center  md:hidden hover:text-[#7f6727]"
                >
                  <span>{t("header.Log_in")}</span>
                  <LoginOutlined />
                </Link>
              </li>
            </>
          </>}

        </ul>
      </div>
      <div
        className=" text-gray-200 flex justify-center text-2xl me-auto m-3 lg:hidden cursor-pointer"
        onClick={handleToggle}
      >
        {toggleMob ? <UnorderedListOutlined /> : <CloseOutlined />}
      </div>
      <div className="flex justify-center  items-center w-[100%] ">
        <Link to={"/"}>
          <img src={logo} alt="logo" className=" w-11" />
        </Link>
      </div>
      <div className=" grid lg:grid-cols-2  grid-cols-1 h-33 m-3  text-gray-200 ms-auto  gap-5  items-center justify-center">
        <Select
          suffixIcon={
            <GlobalOutlined className=" text-gray-200 pointer-events: none " />
          }
          className="ms-auto"
          defaultValue={lang}
          style={{ width: 120 }}
          onChange={handleChangeLang}
          options={[
            {
              value: "ar",
              label: "العربيه",
            },
            {
              value: "en",
              label: "English",
            },
          ]}
        />
        {token ? (
          <>
            <span
              onClick={logOut}
              className="md:flex  gap-2 justify-center  hover:text-[#7f6727] text-nowrap  items-center fontMed hidden cursor-pointer"
            >
              <span>{t("header.Log_out")}</span>
              <LogoutOutlined />
            </span>
          </>
        ) : (
          <>
            <Link
              to="/LogIn"
              className="md:flex  gap-2 justify-center  hover:text-[#7f6727] text-nowrap  items-center fontMed hidden"
            >
              <span>{t("header.Log_in")}</span>
              <LoginOutlined />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
