const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getHtmlData = async () => {
  try{
    let { data: htmlResponse } = await axios.get('https://codequiz.azurewebsites.net/', {
      headers: {
          Cookie: "hasCookie=true;"
      }
    })
    return [ , htmlResponse]
  }catch(err){
    return [err]
  }
}

(async _ =>{
  const Args = process.argv.slice(2);

  const foundName = Args.length && Args[0];

  if(!foundName) {
    console.log('Error: Please run using "node index.js FUNDCODE"')
    return
  }

  let [error, htmlResponse] = await getHtmlData()

  if(error) {
    console.log('Error: Not get HTML data, Please try again.')
    return
  }

  let dom = new JSDOM(htmlResponse)
  let doc = dom.window.document

  let tableRows = doc.querySelectorAll('table tbody tr')
  let navColumn = null

  for(let i=0 ; i<tableRows.length ; i++){
    let firstColumn = tableRows[i].querySelector('td:nth-child(1)')

    if(firstColumn && firstColumn.textContent.trim() === foundName.trim()) {
      navColumn = tableRows[i].querySelector('td:nth-child(2)')
      break
    } 
  }

  const nav = navColumn && navColumn.textContent.trim()

  console.log(nav ? `Nav is: ${nav}` : "Not found!!!")
})()