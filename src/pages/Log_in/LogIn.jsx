import { useNavigate } from "react-router-dom";
import LOGIN from "./login.module.css";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ThreeCircles } from "react-loader-spinner";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../Context/authentication";
import { jwtDecode } from "jwt-decode";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
export function LogIn() {
  const [errorMeg, setErorrMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const navigate = useNavigate();
  const { setToken } = useContext(authContext);
  useEffect(() => {
    document.title = "Helwan Printing Press | Log In";
  }, []);
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  async function sendingData(values) {
    setIsLoading(true);
    try {
      let { data } = await axios.post(
        "http://localhost:4000/auth/login",
        values
      );
      // console.log(data);
      //http://localhost:4000/auth/login
      // https://printing-sys-fojo.vercel.app/auth/register
      const res = jwtDecode(data.token);
      console.log(res.role);
      if (res.role === "admin") {
        localStorage.setItem("tkn", data.token);
        setToken(data.token);
        setSuccessMsg(t("Login.Loginsuccessfully"));
        setTimeout(function () {
          navigate("/");
        }, 3000);
      }
      if (res.role === "user") {
        setErorrMsg(t("Login.YOUNOTAUTH"));
      }
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      setErorrMsg(error.response.data.message);
    }
    setIsLoading(false);
  }

  let validationSchema = Yup.object({});
  let formikObj = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validate: function () {
      setErorrMsg(null);
    },
    onSubmit: sendingData,
  });
  return (
    <div className="">
      <div className={LOGIN.section}>
        {errorMeg ? (
          <div
            className={
              LOGIN.alert +
              " text-red-200 shadow-inner rounded p-3 bg-red-300 mt-2 text-center"
            }
          >
            {t("Login.InvalidEmailOrPassword")}
          </div>
        ) : (
          ""
        )}
        {successMsg ? (
          <div
            className={
              LOGIN.alert +
              " text-red-200 shadow-inner rounded p-3 bg-green-300 mt-2 text-center"
            }
          >
            {t("Login.Loginsuccessfully")}
          </div>
        ) : (
          ""
        )}
        <h2 className={LOGIN.header}>{t("Login.Login")}</h2>
        <form onSubmit={formikObj.handleSubmit}>
          <input
            type="email"
            onChange={formikObj.handleChange}
            onBlur={formikObj.handleBlur}
            value={formikObj.values.email}
            name="email"
            className={
              LOGIN.input +
              " mt-5 border w-full text-base ps-8 py-2 mx-2 focus:outline-5 focus:ring-3 focus:border-white-600 "
            }
            placeholder={t("Login.Email")}
          />
          <i
            className="fa-solid fa-envelope relative ltr:left-[10px] px-1 rtl:right-[10px] "
            style={{ color: "#7f6727", bottom: "33px" }}
          ></i>
          {formikObj.errors.email && formikObj.touched.email ? (
            <div
              className={
                LOGIN.alert +
                " text-red-200 shadow-inner rounded p-3 bg-red-300 "
              }
            >
              {formikObj.errors.email}
            </div>
          ) : (
            ""
          )}

          <input
            type="password"
            onChange={formikObj.handleChange}
            onBlur={formikObj.handleBlur}
            value={formikObj.values.password}
            name="password"
            className={
              LOGIN.input +
              " mt-5 border w-full text-base ps-8 py-2 mx-2 focus:outline-5 focus:ring-3 focus:border-white-600 "
            }
            placeholder={t("Login.Password")}
          />
          <i
            className="fa-solid fa-lock relative ltr:left-[10px] px-1 rtl:right-[10px] "
            style={{ color: "#7f6727", bottom: "33px" }}
          ></i>
          {formikObj.errors.password && formikObj.touched.password ? (
            <div
              className={
                LOGIN.alert +
                " text-red-200 shadow-inner rounded p-3 bg-red-300  "
              }
            >
              {formikObj.errors.password}
            </div>
          ) : (
            ""
          )}

          <div className={LOGIN.containerbtns}>
            <button
              className={LOGIN.signupbtn}
              type="submit"
              disabled={
                formikObj.isValid === false || formikObj.dirty === false
              }
            >
              {isLoading ? (
                <ThreeCircles
                  visible={true}
                  height="30"
                  width="60"
                  color="#fff"
                  ariaLabel="three-circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                t("Login.Login")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
