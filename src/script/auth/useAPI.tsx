import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { APIBasePath } from "@/script/config.json";
import { useNavigate } from "react-router-dom";

export const useAPI = (keyName: string, defaultValue: string | null) => {
  const navigate = useNavigate();
  // cookie the data
  const [cookies, setCookie] = useCookies([keyName]);
  const expireDate = new Date(2147483647 * 1000);
  // console.log(expireDate);
  // store value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = cookies?.[keyName];
      if (value) {
        return typeof value === "object" ? JSON.stringify(value) : value;
      } else {
        setCookie(keyName, JSON.stringify(defaultValue), {
          expires: expireDate,
        });
        return defaultValue;
      }
    } catch (error) {
      return defaultValue;
    }
  });
  // set new value
  const setValue = async (newValue: string | null) => {
    try {
      if (newValue === null) {
        setCookie(keyName, newValue, {
          expires: expireDate,
        });
        setStoredValue(newValue);
      } else {
        const data = JSON.parse(newValue);
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("password", data.password);

        const result = await axios({
          method: "POST",
          url: `${APIBasePath}/checkTeacherLogin.php`,
          // headers: { "content-type": "application/x-www-form-urlencoded" },
          data: formData,
        })
          .then((response) => response.data)
          .catch((error) => console.log(error));

        // console.log(result);

        if (result.status === 404) {
          setStoredValue(null);
          navigate("/login", {
            replace: true,
            state: {
              err: "ไม่พบผู้ใช้งาน",
              username: data.username,
              password: data.password,
            },
          });
        }

        if (result.status === 403 && result.type === 3) {
          setStoredValue(null);
          navigate("/login", {
            replace: true,
            state: {
              err: "password ไม่ถูกต้อง",
              username: data.username,
              password: data.password,
            },
          });
        }

        if (result.status === 200) {
          const userData = JSON.stringify(result.data);
          setCookie(keyName, userData, {
            expires: expireDate,
          });
          setStoredValue(userData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
