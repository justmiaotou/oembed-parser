// utils -> fetchEmbed

var HttpsProxyAgent = require('https-proxy-agent');

const fetch = require('node-fetch').default;

const isAccessTokenNeeded = (provider) => {
  return ['Instagram', 'Facebook'].includes(provider.provider_name) ;
};

// It's better to use your own access token
const getTemporaryAccessTokenForFacebook = () => {
  return '365101066946402|a56861eb5b787f9e9a18e4e09ea5c873'
}

const getRegularUrl = (query, basseUrl) => {
  return basseUrl.replace(/\{format\}/g, 'json') + '?' + query;
};

const fetchEmbed = async (url, provider, params = {}) => {
  const {
    provider_name, // eslint-disable-line camelcase
    provider_url, // eslint-disable-line camelcase
  } = provider;

  const queries = [
    'format=json',
    `url=${encodeURIComponent(url)}`,
  ];

  const {
    maxwidth = 0,
    maxheight = 0,
    proxyUrl,
    access_token,
    ...rest
  } = params;

  if (maxwidth > 0) {
    queries.push(`maxwidth=${maxwidth}`);
  }
  if (maxheight > 0) {
    queries.push(`maxheight=${maxheight}`);
  }

  if (access_token) {
    queries.push(`access_token=${access_token}`)
  } else if (isAccessTokenNeeded(provider)) {
    queries.push(`access_token=${getTemporaryAccessTokenForFacebook()}`)
  }

  for (const key in rest) {
     queries.push(`${key}=${rest[key]}`)
  }

  const query = queries.join('&');

  const link = getRegularUrl(query, provider.url);
  let fetchOpt = {mode: 'no-cors'}
  if (proxyUrl) {
    fetchOpt.agent = new HttpsProxyAgent(proxyUrl)
  }
  const res = await fetch(link, fetchOpt);
  const json = await res.json();
  json.provider_name = provider_name; // eslint-disable-line camelcase
  json.provider_url = provider_url; // eslint-disable-line camelcase
  return json;
};

module.exports = fetchEmbed;
