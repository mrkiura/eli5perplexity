# eli5perplexity


Allows selecting text on a web page and displaying a tooltip with the buttons "Search", "Eli5" and "Esc".

A quick proof of concept showing the functionality to select text on a web page and querying the perplexity API to:
- perform an online lookup of the selected text
- Explain the selected snippet like you would to a five-year-old (Eli5 - Explain like I'm five)



https://github.com/mrkiura/eli5perplexity/assets/17288133/666d2810-6047-44fb-a55d-2636cb700e18



## Setup

### Add API KEY to .env file
Create a `.env` file and set your perplexity API key
```bash
REACT_APP_PERPLEXITY_API_KEY=<your perplexity AI API key>
```

### Install node modules

```bash
npm install
```

### Start the app.
```bash
npm run start
```

