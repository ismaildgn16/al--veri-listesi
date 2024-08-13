export const form = document.querySelector(".grocery-form");
export const grocery = document.getElementById("grocery");
export const list = document.querySelector(".grocery-list");
export const container = document.querySelector(".grocery-container");
export const submitBtn = document.querySelector(".submit-btn");
export const clearBtn = document.querySelector(".clear-btn");
const alert = document.querySelector(".alert");
export const displayAlert = (text, action) => {
  //* Dışarıdan parametre ile gelen text'i alert class'lı p etiketinin içerisine aktar.
  alert.textContent = text;
  //* Dışarıdan parametre ile gelen class ismini ekledik.
  alert.classList.add(`alert-${action}`);
  //* 3 saniye sonra içerisindeki fonksiyonu çalıştırır.
  setTimeout(() => {
    //* alert'in içerisini boşalt
    alert.textContent = "";
    //* alert'in class'ını sil
    alert.classList.remove(`alert-${action}`);
  }, 1000);
};
