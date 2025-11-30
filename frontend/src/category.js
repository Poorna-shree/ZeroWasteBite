import carrot from "./assets/Carrot.png";  // one common image
import tomoto from "./assets/Tomoto.jpg";
import onion from "./assets/Onion.jpg";
import chilli from "./assets/Chilli.jpg";
import apple from "./assets/Apple.jpg";
import rice from "./assets/Rice.jpg";
import mango from "./assets/Mango.jpg";
import others from "./assets/Others.jpg";
// Item categories (from schema enum)
export const categories = [
  { category: "carrot", image: carrot },
  { category: "tomato", image: tomoto },
  { category: "onion", image: onion },
  { category: "mango", image: mango },
  { category: "apple", image: apple },
  { category: "chilli", image: chilli },
  { category: "rice", image: rice },
  { category: "Others", image: others },
];

// Food types (from schema enum)
export const foodTypes = [
  { type: "vegitables" },
  { type: "fruites" },
];
