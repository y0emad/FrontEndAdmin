import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Popover, Spin } from "antd";
import { useEffect, useState } from "react";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
let globalNumber = 0;
let globalimg = "";
function EditProduct() {
  const [number, setNumber] = useState(0);
  const [choices, setChoices] = useState([]);
  const [requiredData, setRequiredData] = useState([]);
  const { state } = useNavigation();
  const product = useLoaderData();

  useEffect(() => {
    setNumber(product.data.requiredData.length);
    globalimg = product.data.image;
    setChoices(
      product.data.requiredData.map((field) => field.hasChoices === true)
    );
    setRequiredData(product.data.requiredData);
  }, [product.data.requiredData]);

  const handleChoicesChange = (index, value) => {
    const newValue = Boolean(value === "false" ? false : true);

    const updatedChoices = [...choices];
    updatedChoices[index] = newValue === true;
    setChoices(updatedChoices);

    const updatedRequiredData = [...requiredData];
    updatedRequiredData[index].hasChoices = newValue;
    if (newValue === false) {
      updatedRequiredData[index].choices = "";
    }
    setRequiredData(updatedRequiredData);
  };

  const addRequiredData = () => {
    setNumber(number + 1);
    setChoices([...choices, false]);
    setRequiredData([
      ...requiredData,
      { name: "", required: true, hasChoices: false, choices: "" },
    ]);
  };

  const removeRequiredData = () => {
    setNumber(number - 1);
    setChoices(choices.slice(0, -1));
    setRequiredData(requiredData.slice(0, -1));
  };

  return (
    <div>
      <section>
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className=" text-3xl font-bold text-gray-200 mb-8">
            Update a Product
          </h2>
          <Form method="put" encType="multipart/form-data">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-200"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  defaultValue={product.data.name}
                  className="bg-gray-50 border border-gray-300 text-gray-200 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-200 dark:text-gray-200"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="8"
                  required
                  defaultValue={product.data.description}
                  className="block p-2.5 w-full text-sm text-gray-200 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your description here"
                ></textarea>
              </div>
            </div>

            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-200 dark:text-white"
                htmlFor="large_size"
              >
                Update Image
              </label>
              <input
                className="block w-full text-lg text-gray-200 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="large_size"
                accept="image/*"
                name="image"
                type="file"
              />
            </div>
            {requiredData.map((field, index) => (
              <div key={index} className="my-5">
                <div className="sm:col-span-2 mb-5">
                  <label
                    htmlFor={`name-${index}`}
                    className="block mb-2 text-sm font-medium text-gray-200"
                  >
                    Name {index + 1}
                  </label>
                  <input
                    defaultValue={field.name}
                    type="text"
                    required
                    name={`name-${index}`}
                    id={`name-${index}`}
                    className="bg-gray-50 border border-gray-300 text-gray-200 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type product name"
                  />
                </div>
                <div className="sm:col-span-2 mb-5">
                  <label
                    htmlFor={`required-${index}`}
                    className="block mb-2 text-sm font-medium text-gray-200"
                  >
                    Required {index + 1}
                  </label>
                  <select
                    id={`required-${index}`}
                    name={`required-${index}`}
                    defaultValue={field.required}
                    className="text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </div>
                <div className="sm:col-span-2 mb-5">
                  <label
                    htmlFor={`hasChoices-${index}`}
                    className="block mb-2 text-sm font-medium text-gray-200"
                  >
                    Has Choices {index + 1}
                  </label>

                  <select
                    id={`hasChoices-${index}`}
                    name={`hasChoices-${index}`}
                    defaultValue={field.hasChoices}
                    onChange={(e) => handleChoicesChange(index, e.target.value)}
                    className="text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={Boolean(false)}>No</option>
                    <option value={Boolean(true)}>Yes</option>
                    {(globalNumber = number)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`choices-${index}`}
                    className="block mb-2 text-sm font-medium text-gray-200"
                  >
                    Choices {index + 1}
                    <Popover content="Must be in this format: Red,Black,Blue">
                      <ExclamationCircleOutlined className="text-[#b59439] ms-2" />
                    </Popover>
                  </label>
                  <input
                    type="text"
                    name={`choices-${index}`}
                    id={`choices-${index}`}
                    pattern="(\w+(?: \w+)*,?)+"
                    defaultValue={field.choices}
                    className="bg-gray-50 border border-gray-300 text-gray-200 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Like Red,Black,Blue"
                    {...(choices[index]
                      ? { required: true }
                      : { required: false })}
                    disabled={!field.hasChoices}
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
                "Update product"
              )}
            </button>
            <Link
              to=".."
              className="inline-flex border-2 border-[#7f6727] items-center mx-5 px-5 duration-300 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-gray-200 bg-transparent rounded-lg focus:ring-2 focus:ring-[#7f6727] dark:focus:ring-[#7f6727] hover:bg-[#7f6727]"
            >
              Cancel
            </Link>
          </Form>
          <button
            onClick={addRequiredData}
            disabled={state === "submitting"}
            className="inline-flex items-center px-5 duration-300 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-[#000915] bg-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-200 hover:bg-[#7f6727]"
          >
            Add Required Data
          </button>
          <button
            type="button"
            disabled={state === "submitting"}
            onClick={removeRequiredData}
            className="inline-flex border-2 border-[#7f6727] items-center mx-5 px-5 duration-300 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-gray-200 bg-transparent rounded-lg focus:ring-2 focus:ring-[#7f6727] dark:focus:ring-[#7f6727] hover:bg-[#7f6727]"
          >
            Remove Required Data
          </button>
        </div>
      </section>
    </div>
  );
}
const action = async ({ request, signal, params }) => {
  // const array = [];
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  let image = formData.get("image");
  const formBody = new FormData();

  if (!image) {
    image = globalimg;
  }
  formBody.set("image", image);
  formBody.set("name", name);
  formBody.set("description", description);
  for (let index = 0; index < globalNumber; index++) {
    const name = formData.get(`name-${index}`);
    const required = formData.get(`required-${index}`);
    const hasChoices = formData.get(`hasChoices-${index}`);
    const choices = formData.get(`choices-${index}`);
    const newRequired = Boolean(required === "false" ? false : true);
    const newHasChoices = Boolean(hasChoices === "false" ? false : true);
    formBody.set(`requiredData[${index}][name]`, name);

    formBody.set(`requiredData[${index}][required]`, newRequired);
    formBody.set(`requiredData[${index}][hasChoices]`, newHasChoices);
    if (newHasChoices) {
      const newChoices = choices.split(",");
      for (let i = 0; i < newChoices.length; i++) {
        formBody.set(`requiredData[${index}][choices][${i}]`, newChoices[i]);
      }
    }
    // array.push({ index, name, newRequired, newHasChoices, choices });
  }

  const res = await fetch(`http://localhost:4000/products/${params.Pro_id}`, {
    method: "put",
    body: formBody,
    headers: {
      authorization: `Bearer ${localStorage.getItem("tkn")}`,
    },
    signal,
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
  // console.log(array);
  // console.log(name, description, image);
  return redirect("/");
};
const loader = async ({ request: { signal }, params }) => {
  const product = await fetch(
    `https://printing-sys-fojo.vercel.app/products/${params.Pro_id}`,
    { signal }
  );
  return product;
};

export const EditExitProduct = {
  action,
  loader,
  element: (
    <ProtectedRoute>
      <EditProduct />
    </ProtectedRoute>
  ),
};
