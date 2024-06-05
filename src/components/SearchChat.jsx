import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Form, useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
const debounce = (fn, ms = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
export function SearchChat() {
  const query = useRef(null);
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const handleSearch = debounce((event) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("queryChat", event.target.value);
    navigate(`?${newSearchParams}`, { replace: true });
  });
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    query.current.focus();
    query.current.value = newSearchParams.get("queryChat");
  }, []);
  return (
    <div className="border-b-2 py-4 px-2 w-64 ">
      <Form>
        <div className="relative  my-2">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            name="queryChat"
            id="queryChat"
            ref={query}
            onChange={handleSearch}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 dark:border-gray-200 dark:placeholder-[#3b3c3c] dark:text-[#000915] dark:focus:ring-[#000915] dark:focus:border-[#000915]"
            placeholder={t("Chat.SearforChats")}
            required
          />
        </div>
      </Form>{" "}
    </div>
  );
}
