import { DOMParser } from "https://cdn.skypack.dev/@xmldom/xmldom?dts";
import * as xpath from "https://cdn.skypack.dev/xpath?dts";
import { ensureFileSync } from "https://deno.land/std@0.106.0/fs/mod.ts";

interface IStock {
  name: string;
  type: string;
  id: string;
  order: string;
}

interface IOrder {
  stocks: IStock[];
  order: string;
}

(async () => {
  const html = await Deno.readTextFile("./data.html");
  const doc = new DOMParser().parseFromString(html);

  const section = xpath.select(
    './/section[ contains( ., "最近调仓" ) ]',
    doc,
  )[0] as Node;
  // get the last updated date
  const orderContent =
    (xpath.select('.//p[ contains( ., "份" ) ]', section)[0] as Node)
      .textContent!.trim();

  ensureFileSync("./data.json");
  const text = Deno.readTextFileSync("./data.json");
  if (text.trim() != "") {
    const lastOrder: IOrder = JSON.parse(text);
    if (orderContent == lastOrder.order) {
      console.log("not update");
      return;
    }
  }

  const table = xpath.select(
    './/table[ contains( ., "份" ) ]',
    section,
  )[0] as Node;
  const rows = xpath.select(".//tr", table) as Node[];

  const stocks: IStock[] = [];
  for (const row of rows) {
    // /html/body/div[2]/div[2]/div/section[3]/table/tbody/tr[1]/td[1]/div[1]
    const td1 = (xpath.select("./td[1]", row)[0] as Node);
    const td2 = (xpath.select("./td[2]", row)[0] as Node);
    const name = (xpath.select("./div[1]", td1)[0] as Node).textContent!.trim();
    const type = (xpath.select("./div[2]/div[1]", td1)[0] as Node).textContent!
      .trim();
    const id =
      ((xpath.select("./div[2]/div[2]", td1)[0] as Node).textContent!.trim());
    const order = td2.textContent!.trim();

    stocks.push({
      name,
      type,
      id,
      order,
    });
  }

  console.log("number of stocks", stocks.length);

  const result: IOrder = {
    stocks,
    order: orderContent,
  };

  await Deno.writeTextFile("./data.json", JSON.stringify(result, null, 2));
  const sendKey = Deno.env.get("SEND_KEY");
  var sendContent = "";
  for (const stock of stocks) {
    sendContent +=
      `${stock.name}[${stock.id}][${stock.type}]: ${stock.order}\n`;
  }
  console.log(sendContent);
  const sendUrl = encodeURI(
    `https://sctapi.ftqq.com/${sendKey}.send?title=MONEY&desp=${sendContent}`,
  );
  await fetch(sendUrl);
})();
