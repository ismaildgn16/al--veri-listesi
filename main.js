import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import {
  clearBtn,
  container,
  displayAlert,
  form,
  grocery,
  list,
  submitBtn,
} from "./js/helper.js";

//* Düzenleme Seçenekleri
let editElement;
let editFlag = false; //* Düzenleme modunda olup olmadığını belirtir
let editID = ""; //* Düzenleme yapılan öğenin benzersiz kimliği

//! Fonksiyonlar

//* Silme butonuna tıkladığımızda çalışır.
const deleteItem = (e) => {
  //* Sil butonuna tıkladığımızda parentElement ile silmek istediğimiz article etiketine ulaştık.
  // const element = e.target.parentElement.parentElement.parentElement;
  //* Belirli bir kimliğe göre arama yapmak için kullanırız.
  const element = e.currentTarget.closest(".grocery-item");

  const id = element.dataset.id;

  list.removeChild(element);

  displayAlert("Başarıyla Kaldırıldı", "danger");

  removeFormLocalStorage(id);
};

//* Güncelleme butonuna tıkladığımızda çalışır.
const editItem = (e) => {
  const element = e.currentTarget.closest(".grocery-item");
  //* Kapsayıcı üzerinden kardeş elemente ulaştık.
  editElement = e.target.parentElement.parentElement.previousElementSibling;
  //* Form içerisinde bulunan inputun değerini düzenlenen öğenin metniyle doldur.
  grocery.value = editElement.innerHTML;
  editFlag = true;
  //* Düzenlenen öğenin kimliğini al
  editID = element.dataset.id;
  submitBtn.textContent = "Düzenle";
};

//* Form gönderildiğinde çalışır.
function addItem(e) {
  //* Sayfanın yenilenmesini engeller.
  e.preventDefault();
  //* Inputun değerini alıp bir değişkene aktardık.
  const value = grocery.value;
  //* uuid kütüphanesini kullanarak benzersiz bir id oluşturduk.
  const id = uuidv4();

  //* Eğer inputun içerisi boş değilse ve düzenleme modunda değilsek
  if (value !== "" && !editFlag) {
    //* Yeni bir "article" elementi oluşturmak için createElement metodunu kullandık.
    const element = document.createElement("article");
    //* Yeni bir veri kimliği oluşturur.
    let attr = document.createAttribute("data-id");
    attr.value = id;
    //* Oluşturduğumuz id'yi elemente ekledik.
    element.setAttributeNode(attr);
    //* Oluşturduğumuz article etiketine grocery-item class'ını ekledik.
    element.classList.add("grocery-item");
    //* Oluşturduğumuz article etiketinin çerisine html etiketlerini aktrdık ve dinamik yaptık.
    element.innerHTML = `
    <p class="title">${value}</p>
      <div class="btn-container">
        <button type="button" class="edit-btn">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    //* list kapsayıcısına, oluşturduğumuz article etiketini ekledik.
    list.appendChild(element);
    //* conteiner'a show-container class'ı ekledik.
    container.classList.add("show-container");
    displayAlert("Başarıyla Eklenildi", "success");

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    //* localStorage'a ekleme işlemi yapacak fonksiyona eklemek istediğim verinin id'sini ve value'sunu parametre olarak gönderdim
    addToLocalStorage(id, value);
    grocery.value = "";
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    submitBtn.textContent = "Ekle";
    displayAlert("Değer Değiştirildi", "success");

    editLocalStorage(editID, value);
    grocery.value = "";
  }
}

//* Listeyi temizleye tıklanıldığında çalışır.
const clearItems = () => {
  // container.innerHTML = "";
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  container.classList.remove("show-container");

  //* localStorage'dan list verisini sil
  localStorage.removeItem("list");
};

//* localStorage'da list verisi varsa veriyi getir yoksa boş bir dizi dönder.
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

//* localStorage a ekleme işlemi yap
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

//* localStorage'dan id'ye göre silme işlemi
const removeFormLocalStorage = (id) => {
  let items = getLocalStorage();

  items = items.filter((item) => item.id !== id);

  //* localStorage'a güncellenmiş veriyi gönder.
  localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
  let items = getLocalStorage();

  // items = items.map((item) => {
  //   if (item.id === id) {
  //     item.value = value;
  //   }
  //   return item;
  // });

  items = items.map((item) => (item.id === id ? { ...item, value } : item));

  localStorage.setItem("list", JSON.stringify(items));
};

const createListItem = (id, value) => {
  //* Yeni bir `article` etiketi oluşturmak için createElement metodunu kullandık
  const element = document.createElement("article");
  //* Yeni bir veri kimliği oluşturur
  let attr = document.createAttribute("data-id");
  attr.value = id;
  //* Oluşturduğumuz id'yi elemente ekledik
  element.setAttributeNode(attr);
  //* Oluşturduğumuz article etiketine grocery-item classını ekledik
  element.classList.add("grocery-item");
  //* Oluşturduğumuz article etiketinin içerisine html etiketlerimi aktardık ve dinamik yaptık
  element.innerHTML = `
        <p class="title">${value}</p>
       <div class="btn-container">
           <button type="button" class="edit-btn">
               <i class="fa-solid fa-pen-to-square"></i>
           </button>
           <button type="button" class="delete-btn">
               <i class="fa-solid fa-trash"></i>
           </button>
       </div>
   `;

  //* list kapsayıcısına oluşturduğumuz article etiketini ekledik
  list.appendChild(element);
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
};

const setupItems = () => {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
};

//! Olay İzleyicileri
//* Forma gönderilme olayı ekle ve gönderilme olayında çalışacak addItem fonksiyonunu çalıştır.
form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

//* Sayfa yüklendiğinde setupItems fonsiyonunu çalıştır.
window.addEventListener("DOMContentLoaded", setupItems);
