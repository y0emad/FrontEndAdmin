import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Alert, Popover, Spin } from "antd";
import { useEffect, useState } from "react";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLocalStorage from "../../hooks/useLocalStorage";
let globalNumber = 0;

function AddNewProduct() {
  const [number, setNumber] = useState(0);
  const [choices, setChoices] = useState([]);
  const [requiredData, setRequiredData] = useState([]);
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  const { state } = useNavigation();
  const errorAlert = useActionData();
  const handleChoicesChange = (index) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = !updatedChoices[index];
    setChoices(updatedChoices);
  };

  const addRequiredData = () => {
    setNumber(number + 1);
    setChoices([...choices, false]);
    setRequiredData([
      ...requiredData,
      { name: "", required: "true", hasChoices: "false", choices: "" },
    ]);
  };
  const removeRequiredData = () => {
    setNumber(number - 1);
    setChoices(choices.slice(0, -1));
    setRequiredData(requiredData.slice(0, -1));
  };
  useEffect(() => {
    document.title = "Helwan Printing Press | Add New Product";
  }, []);

  return (
    <div>
      {errorAlert?.ValidationError && (
        <Alert
          message="Error"
          description={errorAlert.ValidationError}
          type="error"
          className="fixed top-[9%]   translate-x-1/2 right-1/2  "
          showIcon
        />
      )}
      <section>
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className=" text-3xl font-bold text-gray-200 mb-8">
            {t("EditProduct.AddNewProduct")}
          </h2>

          <Form method="post" encType="multipart/form-data">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-200"
                >
                  {t("EditProduct.ProductName")}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-200 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={t("EditProduct.ProductName")}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-200 dark:text-gray-200"
                >
                  {t("EditProduct.Description")}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="8"
                  required
                  className="block p-2.5 w-full text-sm text-gray-200 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={t("EditProduct.Ydeschere")}
                ></textarea>
              </div>
            </div>

            <div>
              <label
                className="block mt-4  mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="image"
              >
                {t("EditProduct.Image")}
              </label>
              <input
                id="image"
                name="image"
                required
                type="file"
                accept="image/*"
                className="w-full text-gray-500 font-medium text-base bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4  file:bg-gray-800 file:hover:bg-gray-700 file:text-gray-200 rounded"
              />
            </div>

            {Array.from({ length: number }, (_, i) => (
              <div key={i} className="my-5">
                <div className="sm:col-span-2 mb-5">
                  <label
                    htmlFor={`name-${i}`}
                    className="block mb-2 text-sm font-medium text-gray-200"
                  >
                    {t("EditProduct.Name")} {i + 1}
                  </label>
                  <input
                    type="text"
                    name={`name-${i}`}
                    id={`name-${i}`}
                    className="bg-gray-50 border border-gray-300 text-gray-200 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("EditProduct.Name")}
                    required
                  />
                </div>
                <div className="sm:col-span-2 mb-5">
                  <label
                    htmlFor={`required-${i}`}
                    className="block mb-2 text-sm font-medium text-gray-200"
                  >
                    {t("EditProduct.Required")} {i + 1}
                  </label>
                  <select
                    id={`required-${i}`}
                    name={`required-${i}`}
                    defaultValue="true"
                    required
                    className="text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={"false"}>{t("EditProduct.No")}</option>
                    <option value={"true"}>{t("EditProduct.Yes")}</option>
                  </select>
                </div>
                <div className="sm:col-span-2 mb-5">
                  <label
                    htmlFor={`hasChoices-${i}`}
                    className="block mb-2 text-sm font-medium text-gray-200"
                  >
                    {t("EditProduct.HasChoices")} {i + 1}
                  </label>
                  <select
                    id={`hasChoices-${i}`}
                    name={`hasChoices-${i}`}
                    onChange={() => handleChoicesChange(i)}
                    required
                    className="text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={"false"}>{t("EditProduct.No")}</option>
                    <option value={"true"}>{t("EditProduct.Yes")}</option>
                    {(globalNumber = number)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`choices-${i}`}
                    className="block mb-2 text-sm font-medium text-gray-200"
                  >
                    {t("EditProduct.Choices")} {i + 1}{" "}
                    <Popover content={t("EditProduct.format")}>
                      <ExclamationCircleOutlined className="text-[#b59439] ms-2" />
                    </Popover>
                  </label>
                  <input
                    type="text"
                    pattern="(\w+(?: \w+)*,?)+"
                    name={`choices-${i}`}
                    id={`choices-${i}`}
                    className="bg-gray-50 border border-gray-300 text-gray-200 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("EditProduct.Like")}
                    required={choices[i]}
                    disabled={!choices[i]}
                  />
                </div>
              </div>
            ))}
            <button
              disabled={state === "submitting"}
              className="inline-flex items-center px-5 duration-300 py-2.5 mt-4 sm:mt-10 text-sm font-medium text-center text-[#000915] bg-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-200 hover:bg-[#7f6727]"
            >
              {state === "submitting" ? (
                <Spin
                  size="large"
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 24,
                        color: "#000915",
                      }}
                      spin
                    />
                  }
                />
              ) : (
                t("EditProduct.AddNewProduct")
              )}
            </button>
            <Link
              to=".."
              className="inline-flex border-2 border-[#7f6727] items-center mx-5 px-5 duration-300 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-gray-200 bg-transparent rounded-lg focus:ring-2 focus:ring-[#7f6727] dark:focus:ring-[#7f6727] hover:bg-[#7f6727]"
            >
              {t("EditProduct.Cancel")}
            </Link>
          </Form>

          <button
            onClick={addRequiredData}
            disabled={state === "submitting"}
            className="inline-flex items-center px-5 duration-300 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-[#000915] bg-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-200 hover:bg-[#7f6727]"
          >
            {t("EditProduct.AddRequired")}
          </button>
          <button
            type="button"
            disabled={state === "submitting"}
            onClick={removeRequiredData}
            className="inline-flex border-2 border-[#7f6727] items-center mx-5 px-5 duration-300 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-gray-200 bg-transparent rounded-lg focus:ring-2 focus:ring-[#7f6727] dark:focus:ring-[#7f6727] hover:bg-[#7f6727]"
          >
            {t("EditProduct.RemoveRequired")}
          </button>
        </div>
      </section>
    </div>
  );
}

const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const image = formData.get("image");
  const formBody = new FormData();
  formBody.set("image", image);
  formBody.set("name", name);
  formBody.set("description", description);

  for (let index = 0; index < globalNumber; index++) {
    const name = formData.get(`name-${index}`);
    const required = formData.get(`required-${index}`);
    const hasChoices = formData.get(`hasChoices-${index}`);
    const choices = formData.get(`choices-${index}`);
    formBody.set(`requiredData[${index}][name]`, name);
    const newReq = Boolean(required === "false" ? false : true);
    const newHasChoices = Boolean(hasChoices === "false" ? false : true);
    formBody.set(`requiredData[${index}][required]`, newReq);
    formBody.set(`requiredData[${index}][hasChoices]`, newHasChoices);
    if (newHasChoices) {
      const newChoices = choices.split(",");
      for (let i = 0; i < newChoices.length; i++) {
        formBody.set(`requiredData[${index}][choices][${i}]`, newChoices[i]);
      }
    }
  }

  const res = await fetch("http://localhost:4000/products/create", {
    method: "POST",
    signal: request.signal,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("tkn")}`,
    },
    body: formBody,
  });

  if (res.ok) {
    return redirect("/");
  } else {
    const error = await res.json();
    return error;
  }
};
export const AddProduct = {
  action,
  element: (
    <ProtectedRoute>
      <AddNewProduct />
    </ProtectedRoute>
  ),
};
