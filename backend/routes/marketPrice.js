const express = require('express');
const axios = require('axios');
const router = express.Router();

const DATA_GOV_RESOURCE = '9ef84268-d588-465a-a308-a864a43d0070';
const DATA_GOV_URL = `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE}`;

const API_KEY = process.env.DATA_GOV_API_KEY;
if (!API_KEY) {
  console.warn('Warning: DATA_GOV_API_KEY not set in env');
}

// In-memory cache
const cache = {};
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

router.get('/', async (req, res) => {
  try {
    const { state, district, crop } = req.query;
    if (!state || !district || !crop) {
      return res.status(400).json({ error: 'Missing query params. Required: state, district, crop' });
    }

    const cacheKey = `${state.toLowerCase()}|${district.toLowerCase()}|${crop.toLowerCase()}`;
    const cached = cache[cacheKey];
    if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
      return res.json({ ...cached.data, cached: true });
    }

    const baseParams = {
      'api-key': API_KEY,
      format: 'json',
      'filters[state]': state,
      'filters[district]': district,
      'filters[commodity]': crop,
      limit: 10
    };

    let records = null;
    let level = 'district';

    // 1. Try district
    const districtResp = await axios.get(DATA_GOV_URL, { params: baseParams });
    if (districtResp.data?.records?.length) {
      records = districtResp.data.records;
    } else {
      // 2. Try state
      const stateParams = {
        ...baseParams
      };
      delete stateParams['filters[district]'];

      const stateResp = await axios.get(DATA_GOV_URL, { params: stateParams });
      if (stateResp.data?.records?.length) {
        records = stateResp.data.records;
        level = 'state';
      } else {
        // 3. Try national (only commodity)
        const nationalParams = {
          'api-key': API_KEY,
          format: 'json',
          'filters[commodity]': crop,
          limit: 10
        };

        const nationalResp = await axios.get(DATA_GOV_URL, { params: nationalParams });
        if (nationalResp.data?.records?.length) {
          records = nationalResp.data.records;
          level = 'national';
        }
      }
    }

    if (!records) {
      return res.status(404).json({ found: false, message: 'No records found for this crop/location' });
    }

    // Pick the most recent record
    const parseDate = (d) => {
      try {
        const [dd, mm, yyyy] = d.split('/');
        return new Date(`${yyyy}-${mm}-${dd}`);
      } catch {
        return new Date(0);
      }
    };

    let bestRecord = records[0];
    let bestDate = parseDate(bestRecord.arrival_date);
    for (const rec of records) {
      const date = parseDate(rec.arrival_date);
      if (date > bestDate) {
        bestDate = date;
        bestRecord = rec;
      }
    }

    const result = {
      found: true,
      level,
      commodity: bestRecord.commodity,
      variety: bestRecord.variety || null,
      market: bestRecord.market || null,
      district: bestRecord.district || null,
      state: bestRecord.state || null,
      modal_price: bestRecord.modal_price ? Number(bestRecord.modal_price) : null,
      min_price: bestRecord.min_price ? Number(bestRecord.min_price) : null,
      max_price: bestRecord.max_price ? Number(bestRecord.max_price) : null,
      arrival_date: bestRecord.arrival_date || null,
      raw: bestRecord
    };

    cache[cacheKey] = { ts: Date.now(), data: result };
    return res.json(result);
  } catch (err) {
    console.error('market-price error:', err.message || err);
    return res.status(500).json({ error: 'Failed to fetch market price' });
  }
});

module.exports = router;
