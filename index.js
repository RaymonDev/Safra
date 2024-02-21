async function mainFunction() {

    let [tab] = await chrome.tabs.query({ active: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {

            if (document.documentElement.lang === "") {
                document.documentElement.lang = "en";
            }
            
            const url = "https://api.softcatala.org/traductor/v1/translate";
            const elements = document.querySelectorAll('p, h1, h2, h3, a');

            const pElements = Array.from(elements).filter(element => element.tagName === 'P');
            const h1Elements = Array.from(elements).filter(element => element.tagName === 'H1');
            const h2Elements = Array.from(elements).filter(element => element.tagName === 'H2');
            const h3Elements = Array.from(elements).filter(element => element.tagName === 'H3');
            const aElements = Array.from(elements).filter(element => element.tagName === 'A');

            const translateElement = async (element) => {
                const params = new URLSearchParams();
                params.append("langpair", document.documentElement.lang + "|ca_valencia");
                params.append("q", element.innerHTML); // Use innerHTML instead of textContent

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: params
                });

                const data = await response.json();
                element.innerHTML = data.responseData.translatedText; // Use innerHTML instead of textContent
            };

            for (const element of pElements) {
                await translateElement(element);
            }

            for (const element of h1Elements) {
                await translateElement(element);
            }

            for (const element of h2Elements) {
                await translateElement(element);
            }

            for (const element of h3Elements) {
                await translateElement(element);
            }

            for (const element of aElements) {
                await translateElement(element);
            }
        }
    });
}

document.getElementById('button').addEventListener('click', mainFunction);
