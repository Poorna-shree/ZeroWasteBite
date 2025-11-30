import React, { useEffect, useState } from "react";
import axios from "axios";

function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const GNEWS_KEY = "1e618b8c7f49c2b87410d90cd735f472";

  // ✅ broader and fallback search terms
  const queries = [
    "food donation India",
    "food waste India",
    "NGO food distribution India",
    "hunger relief India",
    "leftover food donation India",
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      let foundArticles = [];
      try {
        for (const query of queries) {
          const res = await axios.get(
            `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=10&apikey=${GNEWS_KEY}`
          );
          if (res.data.articles && res.data.articles.length > 0) {
            console.log(`✅ Found ${res.data.articles.length} for "${query}"`);
            foundArticles = res.data.articles;
            break; // stop after finding first non-empty result
          }
        }
        setArticles(foundArticles);
      } catch (error) {
        console.error("❌ Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p className="text-gray-600 text-center">Loading food-related news...</p>;
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl mt-16 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">
        Latest Food Donation & Waste Management News in India 🇮🇳
      </h2>

      {articles.length === 0 ? (
        <p className="text-gray-500 text-center">
          No news found — please try again later.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt="news"
                  className="rounded-xl w-full h-40 object-cover mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {article.description}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 font-semibold hover:underline"
              >
                Read More →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsFeed;
