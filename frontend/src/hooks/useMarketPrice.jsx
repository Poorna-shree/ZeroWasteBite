import { useState, useEffect } from "react";
import axios from "axios";

export default function useMarketPrice(category, state, district) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("manual"); // 'auto' or 'manual'
  const [level, setLevel] = useState(null); // district | state | national

  useEffect(() => {
    const fetchPrice = async () => {
      if (!category || !state || !district) return;

      setLoading(true);
      try {
        const res = await axios.get("https://zwb-backend.onrender.com/api/market-price", {
          params: { crop: category, state, district },
        });

        const data = res.data;

        if (data?.found && data.modal_price) {
          const perKg = Number(data.modal_price) / 100;
          setPrice(perKg);
          setSource("auto");
          setLevel(data.level);
        } else {
          setPrice(null);
          setSource("manual");
          setLevel(null);
        }
      } catch (err) {
        console.error("Market price fetch error: ", err);
        setPrice(null);
        setSource("manual");
        setLevel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [category, state, district]);

  return { price, setPrice, loading, source, level };
}
