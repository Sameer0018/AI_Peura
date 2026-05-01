const API_KEY = "AIzaSyC4Wa-womnfbvjHWC57RSPv9BZ_t9K0et4";

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    if (data.models) {
        console.log("Available Models:");
        data.models.forEach(m => console.log(m.name));
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}

listModels();
